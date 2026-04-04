
'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import AuthCardTitle from "@/components/auth/AuthCardTitle";
import AuthCardFooter from "@/components/auth/AuthCardFooter";
import FormInput from "@/components/auth/form/FormInput";
import { EXPRESS_API_URL } from "@/lib/env";
import { useRouter } from "next/navigation";
import Button from '@/components/Button';
import { toast } from 'react-toastify';


type RegisterPageProps = {
    fetchedEmail?: string
}

const RegisterClientPage = ({ fetchedEmail }: RegisterPageProps) => {
  const router = useRouter();
  const [email, setEmail] = useState(fetchedEmail || "")
  const [sending, setSending] = useState(false)
  const [agreed, setAgreed] = useState(fetchedEmail? true : false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true)
    try {
      const res = await fetch(`${EXPRESS_API_URL}/api/auth/register/email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
        credentials: "include"
      });


      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData?.message || "Something went wrong.");
        return; 
      }

      const data = await res.json()
      toast.success(data.message)
      
      
      router.push("/auth/register/verify")

      

    } catch (err) {
      console.error("Error sending request:", err);
    } finally {
      setSending(false)
    }
  }

  const isValidEmail = (email: string) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

  const isFormValid = email.trim() !== "" && isValidEmail(email) && agreed;


  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <AuthCardTitle title={"Sign up with email"}/>

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

      <Button
        type="submit"
        primary
        disabled={!isFormValid || sending}
      >
        {sending ? "Sending" : "Continue"}
      </Button>


      <AuthCardFooter type={"register"} />

    </form>
  )
}
export default RegisterClientPage
