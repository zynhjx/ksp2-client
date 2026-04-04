'use client'

import { useState, useEffect } from "react"
import AuthCardTitle from "@/components/auth/AuthCardTitle"
import FormInput from "@/components/auth/form/FormInput"
import { toast } from "react-toastify"
import Button from "@/components/Button"
import { EXPRESS_API_URL } from "@/lib/env"

type RegisterVerifyClientProps = {
    fetchedEmail: string,
		fetchedTtl: number,
		token: string
}

const RegisterVerifyClientPage = ({ fetchedEmail, fetchedTtl, token }: RegisterVerifyClientProps) => {
	const [countdown, setCountdown] = useState(fetchedTtl)
	const [otp, setOtp] = useState("")

	const isFormValid = otp.trim() !== "" && otp.length === 6

	const handleResend = async () => {
		try {
			const res = await fetch(`${EXPRESS_API_URL}/api/auth/register/email/resend`, {
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				}
			});

			const data = await res.json();
			toast.success(data.message)
			setCountdown(60); // reset countdown after sending
		} catch (error) {
			console.error("Error resending OTP:", error);
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		toast.info(otp)

	}

	useEffect(() => {
		if (countdown <= 0) return;

		const interval = setInterval(() => {
			setCountdown((prev) => prev - 1);
		}, 1000);

		return () => clearInterval(interval); // cleanup
	}, [countdown]);

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
			<AuthCardTitle title={"Check your inbox"} className="mb-3"/>

			<p className="text-sm text-gray-700 text-center mb-4">
				An OTP has been sent to <span className="font-medium text-theme-blue">{fetchedEmail}</span>. Please check your inbox and enter it below.
			</p>

			<FormInput
				value={otp}
				name={"otp"}
				onChange={(e) => (setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)))}
				inputMode="numeric"
				type={"text"}
				maxLength={6}
				pattern="\d"
				placeholder='012345'
				label={"One Time Password (OTP)"}
			/>

			<Button
				primary
				type="submit"
				disabled={!isFormValid}
			>
				Verify
			</Button>

			
			<p className="text-sm text-gray-700 text-center">
				Didn&apos;t receive the code?{" "}
				<button
					type="button"
					onClick={handleResend}
					disabled={countdown > 0}
					className="font-medium text-theme-blue hover:underline hover:cursor-pointer disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
				>
					{countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
				</button>
			</p>
    </form>
  )
}

export default RegisterVerifyClientPage