import React, { useRef } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";

const SignIn = () => {
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const usernameValue = username.current?.value;
    const passwordValue = password.current?.value;

    if (!usernameValue || !passwordValue) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("https://cloudwallet-solana.onrender.com/signin", {
        username: usernameValue,
        password: passwordValue,
      });
      console.log("Sign in response:", res.data);
      localStorage.setItem("publicKey", res.data.publicKey);
      localStorage.setItem("token", res.data.token);

      toast.success("Signed in! Welcome back.");
      navigate("/send");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Sign in failed. Try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSignIn}
      className="flex flex-col gap-6 w-full max-w-md mx-auto bg-[linear-gradient(135deg,_#f8fafc_0%,_#e2e8f0_100%)] p-10 rounded-2xl shadow-2xl border border-gray-200 transition-transform duration-200 hover:scale-[1.02]"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Login</h2>
      <Input
        ref={username}
        type="text"
        placeholder="Username"
        className="bg-white/90 focus:bg-white transition"
      />
      <Input
        ref={password}
        type="password"
        placeholder="Password"
        className="bg-white/90 focus:bg-white transition"
      />
      <Button
        type="submit"
        className="font-semibold tracking-wide shadow hover:shadow-lg transition mt-2"
      >
        Sign In
      </Button>
      <div className="text-sm text-gray-600 text-center mt-2">
        New here?{" "}
        <Link
          to="/signup"
          className="text-blue-500 hover:underline font-semibold"
        >
          Sign Up
        </Link>
      </div>
    </form>
  );
};

export default SignIn;
