'use client'

import { usePathname } from 'next/navigation'
import Footer from '@/components/Footer'

const privateRoutePrefixes = ['/home', '/programs', '/suggestions', '/announcements', '/profile']

const PublicFooter = () => {
  const pathname = usePathname()

  const shouldHideFooter = privateRoutePrefixes.some((prefix) => pathname.startsWith(prefix))

  if (shouldHideFooter) {
    return null
  }

  return <Footer />
}

export default PublicFooter
