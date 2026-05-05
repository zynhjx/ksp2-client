'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchYouthProfile, updateYouthProfile } from "@/lib/youthProfile"

type ProfileDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const toTitleCase = (value: string = "") =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const formatDOB = (value: string) => {
  if (!value) return "—"
  // value is YYYY-MM-DD; parse as local date to avoid timezone shifts
  const [year, month, day] = value.split("-").map(Number)
  if (!year || !month || !day) return value
  const date = new Date(year, month - 1, day)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString("en-PH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const InfoField = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-medium text-slate-700">{value || "—"}</p>
  </div>
)

const EMPTY_FORM = {
  first_name: "",
  last_name: "",
  barangay: "",
  education: "",
  employment_status: "",
  gender: "",
  date_of_birth: "",
}

const ProfileDialog = ({ open, onOpenChange }: ProfileDialogProps) => {
  const { user, setUser } = useAuth()
  const router = useRouter()
  const apiBase = process.env.NEXT_PUBLIC_EXPRESS_API_URL

  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [loadError, setLoadError] = useState("")
  const [saveError, setSaveError] = useState("")
  const [form, setForm] = useState(EMPTY_FORM)

  // Reset state whenever dialog closes
  useEffect(() => {
    if (!open) {
      setSaveError("")
    }
  }, [open])

  // Sync form from user context when opening
  useEffect(() => {
    if (open && user) {
      setForm({
        first_name: user.first_name ?? "",
        last_name: user.last_name ?? "",
        barangay: user.barangay ?? "",
        education: user.education ?? "",
        employment_status: user.employment_status ?? "",
        gender: user.gender ?? "",
        date_of_birth: user.date_of_birth ?? "",
      })
    }
  }, [open, user])

  // Fetch latest profile whenever dialog opens
  useEffect(() => {
    if (!open) return

    let active = true
    setIsLoading(true)
    setLoadError("")

    const load = async () => {
      const result = await fetchYouthProfile(apiBase)
      if (!active) return

      if (!result.ok || !result.data) {
        if (result.status === 403 && result.reason === "pending_activation") {
          onOpenChange(false)
          router.replace("/activation-pending")
          return
        }
        setLoadError(result.message)
        setIsLoading(false)
        return
      }

      const profile = result.data
      setUser({
        ...(user ?? {
          id: profile.id,
          role: profile.role,
          status: profile.status,
        }),
        id: profile.id,
        email: profile.email,
        role: profile.role,
        status: profile.status,
        first_name: profile.first_name,
        last_name: profile.last_name,
        barangay: profile.barangay,
        education: profile.education,
        employment_status: profile.employment_status,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
      })
      setForm({
        first_name: profile.first_name,
        last_name: profile.last_name,
        barangay: profile.barangay,
        education: profile.education,
        employment_status: profile.employment_status,
        gender: profile.gender,
        date_of_birth: profile.date_of_birth,
      })
      setLoadError("")
      setIsLoading(false)
    }

    void load()
    return () => { active = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleCancelEdit = () => {
    setSaveError("")
    onOpenChange(false)
  }

  const handleRequestSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSaving) return
    setIsSaveConfirmOpen(true)
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    setSaveError("")

    const result = await updateYouthProfile(apiBase, {
      firstName: form.first_name.trim(),
      lastName: form.last_name.trim(),
      barangay: form.barangay.trim(),
      education: form.education.trim(),
      employmentStatus: form.employment_status.trim(),
      gender: form.gender.trim(),
      dateOfBirth: form.date_of_birth,
    })

    if (!result.ok || !result.data) {
      if (result.status === 403 && result.reason === "pending_activation") {
        setIsSaving(false)
        onOpenChange(false)
        router.replace("/activation-pending")
        return
      }
      setSaveError(result.message)
      setIsSaving(false)
      return
    }

    const profile = result.data
    setUser({
      ...user,
      id: profile.id,
      email: profile.email,
      role: profile.role,
      status: profile.status,
      first_name: profile.first_name,
      last_name: profile.last_name,
      barangay: profile.barangay,
      education: profile.education,
      employment_status: profile.employment_status,
      gender: profile.gender,
      date_of_birth: profile.date_of_birth,
    })

    setIsSaving(false)
  }

  const fullName =
    `${toTitleCase(user?.first_name ?? "")} ${toTitleCase(user?.last_name ?? "")}`.trim() ||
    "Youth Member"
  const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || "Y"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
        </DialogHeader>

        {loadError && (
          <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
            {loadError}
          </div>
        )}

        <form id="profile-form" onSubmit={handleRequestSave} className="space-y-3">
            {saveError && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                {saveError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pd-first-name">First Name</Label>
                <Input
                  id="pd-first-name"
                  value={form.first_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                  className="h-9 bg-white"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pd-last-name">Last Name</Label>
                <Input
                  id="pd-last-name"
                  value={form.last_name}
                  onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                  className="h-9 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pd-email">Email</Label>
              <Input
                id="pd-email"
                type="email"
                value={user?.email ?? ""}
                className="h-9 bg-white"
                disabled
                readOnly
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pd-barangay">Barangay</Label>
                <Input
                  id="pd-barangay"
                  value={form.barangay}
                  onChange={(e) => setForm((prev) => ({ ...prev, barangay: e.target.value }))}
                  className="h-9 bg-white"
                  disabled
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pd-education">Education</Label>
                <Input
                  id="pd-education"
                  value={form.education}
                  onChange={(e) => setForm((prev) => ({ ...prev, education: e.target.value }))}
                  className="h-9 bg-white"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pd-employment">Employment Status</Label>
                <Input
                  id="pd-employment"
                  value={form.employment_status}
                  onChange={(e) => setForm((prev) => ({ ...prev, employment_status: e.target.value }))}
                  className="h-9 bg-white"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pd-gender">Gender</Label>
                <Input
                  id="pd-gender"
                  value={form.gender}
                  onChange={(e) => setForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className="h-9 bg-white"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pd-dob">Date of Birth</Label>
              <Input
                id="pd-dob"
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm((prev) => ({ ...prev, date_of_birth: e.target.value }))}
                className="h-9 bg-white"
                required
              />
            </div>
          </form>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelEdit}
            disabled={isSaving}
          >
            Cancel
          </Button>

          <AlertDialog open={isSaveConfirmOpen} onOpenChange={setIsSaveConfirmOpen}>
            <Button
              type="submit"
              form="profile-form"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Save profile changes?</AlertDialogTitle>
                <AlertDialogDescription>
                  Your profile information will be updated with these changes.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    setIsSaveConfirmOpen(false)
                    await handleSave()
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileDialog
