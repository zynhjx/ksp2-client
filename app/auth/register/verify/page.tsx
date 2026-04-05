import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import RegisterVerifyClientPage from "@/components/auth/register/verify/RegisterVerifyClientPage";

export default async function VerifyLayout() {
  
  const cookieStore = await cookies()
	const token = cookieStore.get("verificationToken")?.value

  const res = await fetch("http://localhost:5000/api/auth/check-status", {
	headers: {
	  "Authorization": `Bearer ${token}`, // common practice
	  "Content-Type": "application/json",
	},
  })

	if (!res.ok) {
		redirect("/auth/register")
	}

	const decoded = await res.json()
	
  return (
		<RegisterVerifyClientPage fetchedEmail={decoded.data.email} fetchedTtl={decoded.data.ttl} token={token}/>
  );
}
