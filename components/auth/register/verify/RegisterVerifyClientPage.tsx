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
		token: string | undefined
}

const RegisterVerifyClientPage = ({ fetchedEmail, fetchedTtl, token }: RegisterVerifyClientProps) => {
	const [countdown, setCountdown] = useState(fetchedTtl)
	const [otp, setOtp] = useState("")
	const [invalid, setInvalid] = useState(false)
	const [success, setSuccess] = useState(false)
	const [pendingResend, setPendingResend] = useState(false)

	const isFormValid = otp.trim() !== "" && otp.length === 6

	const handleResend = async () => {
		setPendingResend(true)
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
		} finally {
			setPendingResend(false)
		}
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			const res = await fetch(`${EXPRESS_API_URL}/api/auth/register/email/verify`, {
				method: "POST",
				headers: {
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ otp })
			});

			const data = await res.json();

			if (!res.ok) {
				toast.error(data.message)
				return
			}

			if (!data.success) {
				setInvalid(true)
				toast.error(data.message)
				return
			}
			
			setSuccess(true)
			toast.success(data.message)

		} catch (error) {
			console.error("Error: ", error);
			toast.error("Something went wrong")
		}
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
				onChange={(e) => {
					setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
					setInvalid(false)
				}}
				inputMode="numeric"
				type={"text"}
				maxLength={6}
				placeholder='012345'
				label={"One Time Password (OTP)"}
				error={invalid}
				success={success}
			/>

			<Button
				primary
				type="submit"
				disabled={!isFormValid || success}
				className={
					success ? "bg-green-600 text-white border-green-600" : ""
				}
			>
				{success ? "Verified" : "Verify"}
			</Button>

			
			<p className="text-sm text-gray-700 text-center">
				Didn&apos;t receive the code?{" "}
				<button
					type="button"
					onClick={handleResend}
					disabled={countdown > 0 || pendingResend || success}
					className="font-medium text-theme-blue hover:underline hover:cursor-pointer disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
				>
					{countdown > 0 ? `Resend code in ${countdown}s` : "Resend code"}
				</button>
			</p>
    </form>
  )
}

export default RegisterVerifyClientPage