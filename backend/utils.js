const {
  Connection,
  Keypair,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
  PublicKey,
  LAMPORTS_PER_SOL,
} = require("@solana/web3.js");

async function sendTxn({ privateKey, toAddress, amount }) {
  const connection = new Connection("https://api.devnet.solana.com");
  const fromKeypair = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(privateKey))
  );
  const toPublicKey = new PublicKey(toAddress);

  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: fromKeypair.publicKey,
      toPubkey: toPublicKey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  );
  

  const { blockhash } = await connection.getLatestBlockhash();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = fromKeypair.publicKey;
  transaction.sign(fromKeypair);

  const serializedTransaction = transaction.serialize();
  console.log(
    "Serialized Transaction:",
    serializedTransaction.toString("base64")
  );
  console.log("Transaction Details:", {
    from: fromKeypair.publicKey.toString(),
    to: toPublicKey.toString(),
    amount: amount,
    blockhash: blockhash,
  });

  try {
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      fromKeypair,
    ]);
    console.log("Transaction successful with signature:", signature);
    return { success: true, signature };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { success: false, error: error.message };
  }
}




module.exports = { sendTxn,  };
