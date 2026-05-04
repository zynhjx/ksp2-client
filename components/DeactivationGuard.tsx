'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const DeactivationGuard = () => {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('account:suspended', handler)
    return () => window.removeEventListener('account:suspended', handler)
  }, [])

  const handleAcknowledge = () => {
    setOpen(false)
    router.replace('/auth/login')
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Account Suspended</DialogTitle>
          <DialogDescription>
            Your account has been suspended. You will be redirected to the sign-in page.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleAcknowledge}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeactivationGuard
