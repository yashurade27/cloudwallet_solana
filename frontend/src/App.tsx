import SendMoneyForm from "./components/Form"
import Navbar from "./components/Navbar"
import SignUp from "./components/SignUp"
import SignIn from "./components/SignIn"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { useEffect, useState } from "react"
import { Toaster } from "sonner"

function App() {
  const [, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    const publicKey = localStorage.getItem("publicKey");
    if (publicKey) setWalletAddress(publicKey);
  }, []);

  return (
    <BrowserRouter>
      <Toaster />
      <div className="min-h-screen w-full bg-[radial-gradient(circle,_rgba(238,174,202,1)_0%,_rgba(148,187,233,1)_100%)] grid grid-rows-[auto_1fr]">
        <Navbar />
        <div className="flex items-center justify-center">
          <Routes>
            <Route path="/send" element={<SendMoneyForm />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="*" element={<SignIn />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App