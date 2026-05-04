'use client'

import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { useSidebar } from "@/context/SidebarContext"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CircleUser, LogOutIcon, Menu } from "lucide-react"
import ProfileDialog from "@/components/ProfileDialog"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"

const toTitleCase = (str: string = "") => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

const MobileHeader = () => {

  const { isOpen, toggleSidebar } = useSidebar()
  const { user, setUser } = useAuth()
  const router = useRouter()
  const userInitial = user?.first_name?.charAt(0)?.toUpperCase() || "Y"
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "x-app-type": "youth",
        },
      })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
      router.push("/auth/login")
    }
  }

  return (
    <>
    <div className="md:hidden fixed bg-theme-dark-blue top-0 right-0 left-0 h-18.75 px-4 flex items-center z-20">
      <div className="flex items-center w-18 justify-center">
        <button onClick={() => toggleSidebar()}
          className={twMerge(
            "p-3 cursor-pointer hover:bg-white/10 rounded-2xl border-none",
            isOpen && "ml-auto"
          )
        }>
          <Menu color="#F9FAFB" size={24}/>
        </button>
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="h-10 w-10 rounded-md bg-theme-white text-theme-dark-blue flex items-center justify-center text-base font-bold shadow-sm cursor-pointer"
              aria-label="Open user menu"
            >
              {userInitial}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuLabel>
              <div className="flex items-center gap-3 rounded-md p-1">
                <div className="h-9 w-9 shrink-0 rounded-md bg-theme-dark-blue text-theme-white flex items-center justify-center text-sm font-bold">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {`${toTitleCase(user?.first_name || "")}${user?.last_name ? ` ${toTitleCase(user.last_name)}` : ""}`.trim() || "Youth User"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault()
                  setProfileOpen(true)
                }}
              >
                <CircleUser /> Profile
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <LogOutIcon /> Logout
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You will be signed out and need to log in again to access your account.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.preventDefault()
                        handleLogout()
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
      <ProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  )
}

export default MobileHeader