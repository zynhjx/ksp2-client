"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LogIn, Eye, EyeOff } from "lucide-react";
import AuthCardTitle from "@/components/auth/AuthCardTitle";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import FormInput from "@/components/auth/form/FormInput";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = formData.email.trim() !== "" && formData.password.trim() !== "";

  return (
      <>
        <AuthCardTitle title={"Welcome Back"} subtitle={"Sign in to your account to continue"}/>

        <form className="space-y-4">
          <FormInput
            value={formData.email}
            name={"email"}
            onChange={handleInputChange}
            type={"email"}
            label={"Email Address"}
            placeholder={"john@example.com"}/>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <a href="#" className="text-xs font-bold text-theme-blue hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 focus:border-theme-blue focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className="w-full py-4 rounded-xl bg-theme-blue text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sign In
            <LogIn size={20} />
          </button>

        </form>

        <AuthCardFooter type={"login"}/>
      </>
  );
};

export default LoginPage;
