import { cookies } from "next/headers";
import RegisterClientPage from "@/components/auth/register/RegisterClientPage";
import { redirect } from "next/navigation";

export default async function RegisterPage() {

	const cookieStore = await cookies()
	const token = cookieStore.get("verificationToken")?.value

	const res = await fetch("http://localhost:5000/api/auth/check-status", {
    headers: {
      "Authorization": `Bearer ${token}`, // common practice
      "Content-Type": "application/json",
    },
  })

  if (res.ok) {
    redirect("/auth/register/verify")
  }

  return (
    <RegisterClientPage/>
  );
}