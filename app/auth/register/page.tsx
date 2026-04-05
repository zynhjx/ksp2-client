import { cookies } from "next/headers";
import RegisterClientPage from "@/components/auth/register/RegisterClientPage";
import { redirect } from "next/navigation";
import { EXPRESS_API_URL } from "@/lib/env";

export default async function RegisterPage() {

	const cookieStore = await cookies()
	const token = cookieStore.get("verificationToken")?.value
  let shouldRedirect;

  try {
    const res = await fetch(`${EXPRESS_API_URL}/api/auth/check-status`, {
      headers: {
        "Authorization": `Bearer ${token}`, // common practice
        "Content-Type": "application/json",
      },
    })

    const response = await res.json()
    console.log("register ssr:")
    console.log(response)

    if (res.ok) {
      shouldRedirect = true
    } else {
      shouldRedirect = false
    }
    
  } catch (err) {
    console.log("catch err: " + err)
  }

	if (shouldRedirect) {
    redirect("/auth/register/verify")
  }

  return (
    <RegisterClientPage/>
  );
}