'use client'

import Link from 'next/link'
import React, {useState} from 'react'
import AuthCardTitle from "@/components/auth/AuthCardTitle";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import FormInput from "@/components/auth/form/FormInput";
import { EXPRESS_API_URL } from "@/lib/env";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email")?.toString().trim();

    try {
      const res = await fetch(`${EXPRESS_API_URL}/api/auth/register/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });


      if (res.ok) {
        router.push("/auth/register/verify-email");
      }
    } catch (e) {
      console.error("Error sending request:", e);
      alert("Network error. Please try again later.");
    }
   

  }

  const isFormValid = email.trim() !== "" && email.includes("@") && email.includes(".") && agreed;

  return (
    <>
      <AuthCardTitle title={"Get started"}/>

      <form onSubmit={handleSubmit} className={"space-y-2"}>

        <FormInput
          value={email}
          name={"email"}
          onChange={(e) => (setEmail(e.target.value))}
          type={"email"}
          placeholder={"john@example.com"}
          label={"Email Address"} />

        <div className="flex gap-x-2 mt-5 mb-4 items-center px-2">
          <input
            type={"checkbox"}
            checked={agreed}
            onChange={() => {setAgreed(prev => !prev)}}
            className={"accent-theme-blue h-4 w-4 hover:cursor-pointer focus:outline-none"}/>

          <p className="text-sm text-gray-600 text-center">
            I agree to the{" "}
            <Link href="/terms" className="underline text-theme-blue">Terms of Use</Link> and{" "}
            <Link href="/privacy" className="underline text-theme-blue">Privacy Policy</Link>.
          </p>
        </div>


        <button
          type="submit"
          disabled={!isFormValid}
          className="w-full py-4 rounded-xl bg-theme-blue text-white font-bold hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>

      </form>

      <AuthCardFooter type={"register"} />
    </>
  )
}
export default RegisterPage
