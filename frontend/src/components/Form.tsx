import { useRef, useEffect, useState } from "react"
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const getBalance = async (publicKey: string): Promise<number> => {
    try {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        return balance / LAMPORTS_PER_SOL; 
    } catch (error) {
        console.error("Error fetching balance:", error);
        throw new Error("Failed to fetch balance");
    }
}


const SendMoneyForm = (): any => {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const toaddress = useRef<HTMLInputElement>(null);
    const toamt = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const publicKey = localStorage.getItem("publicKey");
        if (!publicKey) {
            toast.error("Please sign in to send SOL.");
            return;
        }
        setWalletAddress(publicKey);
        getBalance(publicKey)
            .then(setBalance)
            .catch(() => setBalance(null));
    }, []);


    const sendSOL = async (e: React.FormEvent) => {
        e.preventDefault();
        const toAddressValue = toaddress.current?.value;
        const toAmtValue = toamt.current?.value;
        if (!toAddressValue || !toAmtValue) {
            toast.error("Please fill in all fields.");
            return;
        }
        try {
            await axios.post("http://localhost:3000/api/v1/txn/sign", {
                toAddress: toAddressValue,
                amount: toAmtValue
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`,
                },
            }).then((res) => {
                if (res.data.error) {
                    toast.error(res.data.error);
                    return;
                }
                console.log("Transaction response:", res.data);
                toast.success("Transaction successful! Signature: " + res.data.signature);
            }
            ).catch((err) => {
                console.error("Transaction error:", err);
                toast.error("Transaction failed. Please try again.");
            });
            toast.success("Transaction sent!");
            if (walletAddress) {
                const newBalance = await getBalance(walletAddress);
                setBalance(newBalance);
            }
        } catch (error) {
            console.error("Error sending SOL:", error);
            toast.error("Failed to send SOL. Please try again.");
        }
    }

    if (!walletAddress) return null;

    return (
        <form
            onSubmit={sendSOL}
            className="flex flex-col gap-6 w-full max-w-md mx-auto bg-[linear-gradient(135deg,_#ece9e6_0%,_#ffffff_100%)] p-10 rounded-2xl shadow-2xl border-2 border-gray-200 transition-transform duration-200 hover:scale-[1.02]"
        >
            <div className="mb-2 flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <span className="text-base font-semibold text-gray-700">Your Wallet Address:</span>
                    <span className="text-xs font-mono break-all text-gray-500">{walletAddress}</span>
                    <Badge variant="outline" className="ml-2 text-xs text-purple-500 border-purple-400 bg-purple-100">Devnet only</Badge>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-base font-medium text-gray-600">Current Balance:</span>
                    <span className="text-xl font-bold text-blue-800">
                        {balance !== null ? `${balance} SOL` : "Loading..."}
                    </span>
                </div>
            </div>
            <label className="text-sm font-semibold text-gray-700" htmlFor="sol-address">
                Recipient Address
            </label>
            <Input
                id="sol-address"
                type="text"
                placeholder="Enter the address to send SOL..."
                ref={toaddress}
                className="bg-white/90 focus:bg-white transition"
            />
            <label className="text-sm font-semibold text-gray-700 " htmlFor="sol-amount">
                Amount (SOL)
            </label>
            <Input
                id="sol-amount"
                type="decimal"
                min="0.000001"
                placeholder="SOL amount"
                ref={toamt}
                className="bg-white/90 focus:bg-white transition"
            />
            <Button
                type="submit"
                variant="outline"
                className="font-semibold tracking-wide shadow-md hover:shadow-lg transition mt-2"
            >
                Send
            </Button>
        </form>
    )
}

export default SendMoneyForm;