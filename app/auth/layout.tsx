'use client'

import { EXPRESS_API_URL } from '@/lib/env'
import { useRouter } from 'next/navigation'
import React, {ReactNode, useEffect, useState} from 'react'

const AuthLayout = ({children}: {children: ReactNode}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    const auth = async () => {
      try {
        const res = await fetch(`${EXPRESS_API_URL}/api/auth/me`, {
          credentials: "include"
        });

        if (res.ok) {
          router.replace("/")
        }

        const result = await res.json();
        console.log(result);

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false)
      }
    }

    auth()
  }, [])


  if (loading) {
    return <div>Loading...</div> // or spinner
  }

  return (
    <div className="min-h-screen bg-theme-white md:bg-gray-50 flex flex-col items-center md:justify-center md:p-6 text-gray-900">
      <div className="w-full mt-8 md:mt-0 max-w-full md:max-w-md bg-theme-white md:rounded-3xl md:shadow-xl md:shadow-theme-blue/40 md:border border-gray-100 overflow-hidden p-8 md:p-12">
          {children}
      </div>
    </div>
  )
}
export default AuthLayout
