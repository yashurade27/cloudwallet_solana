import React, { useRef } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const SignUp = () => {
  const navigate = useNavigate();
  const username = useRef<HTMLInputElement>(null);
  const password = useRef<HTMLInputElement>(null);
  const email = useRef<HTMLInputElement>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const usernameValue = username.current?.value;
    const passwordValue = password.current?.value;
    const emailValue = email.current?.value;

    if (!usernameValue || !passwordValue || !emailValue) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const res = await axios.post("https://cloudwallet-solana.onrender.com/api/v1/signup", {
        username: usernameValue,
        password: passwordValue,
        email: emailValue,
      });
      console.log("Sign up response:", res.data);
      if (res.data.error) {
        toast.error(res.data.error);
        return;
      }
      navigate("/signin");
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Sign up failed. Try again."
      );
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col gap-6 w-full max-w-md mx-auto bg-[linear-gradient(135deg,_#f8fafc_0%,_#e2e8f0_100%)] p-10 rounded-2xl shadow-2xl border border-gray-200 transition-transform duration-200 hover:scale-[1.02]"
    >
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Create your account</h2>
      <Input
        ref={username}
        type="text"
        placeholder="Username"
        className="bg-white/90 focus:bg-white transition"
      />
      <Input
        ref={email}
        type="email"
        placeholder="Email"
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
        Sign Up
      </Button>
      <div className="text-sm text-gray-600 text-center mt-2">
        Already have an account?{" "}
        <Link
          to="/signin"
          className="text-blue-500 hover:underline font-semibold"
        >
          Login
        </Link>
      </div>
    </form>
  );
};

export default SignUp;
