'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'

const privateRoutePrefixes = ['/home', '/programs', '/suggestions', '/announcements', '/profile']
const authRoutePrefixes = ['/auth', '/login', '/register']

const PublicFooter = () => {
  const pathname = usePathname()

  const shouldHideFooter = privateRoutePrefixes.some((prefix) => pathname.startsWith(prefix))

  if (shouldHideFooter) {
    return null
  }

  const isAuthRoute = authRoutePrefixes.some((prefix) => pathname.startsWith(prefix))

  if (isAuthRoute) {
    return (
      <div className="absolute bottom-0 left-0 right-0 w-full">
        <Footer />
      </div>
    )
  }

  return <Footer />
}

export default PublicFooter
