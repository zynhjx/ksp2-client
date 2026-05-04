"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

import Title from "@/components/Title"
import { useAuth } from "@/context/AuthContext"
import { fetchYouthProfile, updateYouthProfile } from "@/lib/youthProfile"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const toTitleCase = (value: string = "") =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")

const ProfilePage = () => {
  const router = useRouter()
  const { user, setUser } = useAuth()
  const apiBase = process.env.NEXT_PUBLIC_EXPRESS_API_URL

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSaveConfirmOpen, setIsSaveConfirmOpen] = useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileError, setProfileError] = useState("")
  const [saveError, setSaveError] = useState("")
  const [form, setForm] = useState({
    first_name: user?.first_name ?? "",
    last_name: user?.last_name ?? "",
    barangay: user?.barangay ?? "",
    education: user?.education ?? "",
    employment_status: user?.employment_status ?? "",
    gender: user?.gender ?? "",
    date_of_birth: user?.date_of_birth ?? "",
  })

  useEffect(() => {
    let active = true

    const loadProfile = async () => {
      const result = await fetchYouthProfile(apiBase)
      if (!active) return

      if (!result.ok || !result.data) {
        if (result.status === 403 && result.reason === "pending_activation") {
          router.replace("/activation-pending")
          return
        }

        setProfileError(result.message)
        setIsLoadingProfile(false)
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

      setProfileError("")
      setIsLoadingProfile(false)
    }

    void loadProfile()

    return () => {
      active = false
    }
  }, [apiBase, router, setUser])

  useEffect(() => {
    setForm({
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      barangay: user?.barangay ?? "",
      education: user?.education ?? "",
      employment_status: user?.employment_status ?? "",
      gender: user?.gender ?? "",
      date_of_birth: user?.date_of_birth ?? "",
    })
  }, [user])

  const fullName = useMemo(() => {
    if (!user) return "Youth Member"
    return `${toTitleCase(user.first_name)} ${toTitleCase(user.last_name)}`.trim()
  }, [user])

  const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || "U"

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
    setIsEditOpen(false)
  }

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-app-type": "youth",
        },
      })
    } catch {
      // Keep the UI responsive even if the logout endpoint fails.
    } finally {
      setUser(null)
      router.replace("/auth/login")
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <Title className="mb-0">Profile</Title>
        <p className="text-gray-500">
          Review your account details and keep your profile information up to date.
        </p>
      </div>

      {profileError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {profileError}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200/80 bg-theme-card-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-3xl bg-theme-blue text-3xl font-bold text-white">
              {userInitial}
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-semibold text-slate-900">{fullName}</h2>
              <p className="text-sm text-slate-500">{user?.email ?? "No email available"}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700">
                  {user?.role ?? "Youth"}
                </span>
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  {user?.status ?? "Active"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button type="button" className="bg-theme-blue text-white hover:bg-theme-blue/90">
                  Edit Account
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                  <DialogTitle>Edit Account</DialogTitle>
                  <DialogDescription>
                    Update the account details you want to keep current.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleRequestSave} className="space-y-4">
                  {saveError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-700">
                      {saveError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-first-name">First Name</Label>
                      <Input
                        id="profile-first-name"
                        value={form.first_name}
                        onChange={(event) => setForm((prev) => ({ ...prev, first_name: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-last-name">Last Name</Label>
                      <Input
                        id="profile-last-name"
                        value={form.last_name}
                        onChange={(event) => setForm((prev) => ({ ...prev, last_name: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-email">Email</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={user?.email ?? ""}
                      className="h-10 bg-white"
                      disabled
                      readOnly
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-barangay">Barangay</Label>
                      <Input
                        id="profile-barangay"
                        value={form.barangay}
                        onChange={(event) => setForm((prev) => ({ ...prev, barangay: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-education">Education</Label>
                      <Input
                        id="profile-education"
                        value={form.education}
                        onChange={(event) => setForm((prev) => ({ ...prev, education: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="profile-employment-status">Employment Status</Label>
                      <Input
                        id="profile-employment-status"
                        value={form.employment_status}
                        onChange={(event) => setForm((prev) => ({ ...prev, employment_status: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="profile-gender">Gender</Label>
                      <Input
                        id="profile-gender"
                        value={form.gender}
                        onChange={(event) => setForm((prev) => ({ ...prev, gender: event.target.value }))}
                        className="h-10 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="profile-date-of-birth">Date of Birth</Label>
                    <Input
                      id="profile-date-of-birth"
                      type="date"
                      value={form.date_of_birth}
                      onChange={(event) => setForm((prev) => ({ ...prev, date_of_birth: event.target.value }))}
                      className="h-10 bg-white"
                      required
                    />
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={isSaving}>
                      Cancel
                    </Button>
                    <AlertDialog open={isSaveConfirmOpen} onOpenChange={setIsSaveConfirmOpen}>
                      <AlertDialogTrigger asChild>
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                      </AlertDialogTrigger>
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
                </form>
              </DialogContent>
            </Dialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  Logout
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will end your current session and take you back to the login screen.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={handleLogout}>
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200/80 bg-theme-card-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Account Details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">First Name</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.first_name ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Last Name</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.last_name ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Email</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.email ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Barangay</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.barangay ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Education</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.education ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Employment Status</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.employment_status ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Gender</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.gender ?? "-"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Date of Birth</p>
              <p className="mt-2 text-sm font-medium text-slate-700">{isLoadingProfile ? "Loading..." : user?.date_of_birth ?? "-"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-theme-card-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Account Actions</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Edit account details</p>
              <p className="mt-1 text-sm text-slate-500">
                Update your name, email, barangay, education, employment status, gender, and birth date.
              </p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4">
              <p className="text-sm font-semibold text-red-700">Log out</p>
              <p className="mt-1 text-sm text-red-600">
                Use this when you want to end your current session on this dashboard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage