'use client'

import {
  HomeIcon,
  LucideIcon,
  LucideLayoutDashboard,
  Calendar,
  LightbulbIcon,
  Sidebar as SidebarIcon,
  ChevronRight,
  LogOut,
  Megaphone,
  ChevronUp
} from "lucide-react";
import Swal from "sweetalert2";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from 'tailwind-merge';
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useState } from "react";

const toTitleCase = (str: string = "") => {
  return str
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const youthNavs = [
  {name: "Dashboard", icon: LucideLayoutDashboard, path: "/youth/dashboard"},
  {name: "Programs", icon: Calendar, path: "/youth/programs"},
  {name: "Suggestions", icon: LightbulbIcon, path: "/youth/suggestions"},
  {name: "Announcements", icon: Megaphone, path: "/youth/announcements"}
]

const skNavs = [
  {name: "Dashboard", icon: LucideLayoutDashboard, path: "dashboard"},
  {name: "Programs", icon: HomeIcon, path: "home"},
  {name: "Suggestions", icon: HomeIcon, path: "dwadaw"},
]

const adminNavs = [
  {name: "Dashboard", icon: LucideLayoutDashboard, path: "dashboard"},
  {name: "Programs", icon: HomeIcon, path: "home"},
  {name: "Suggestions", icon: HomeIcon, path: "dwadaw"},
]


const Sidebar = () => {
  const pathname = usePathname();
  const { isOpen, toggleSidebar } = useSidebar()
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const { user, setUser } = useAuth()
  const router = useRouter()
  const userNavs = () => {
    if (pathname.startsWith("/youth")) {
      return youthNavs
    } else if (pathname.startsWith("/sk")) {
      return skNavs
    } else {
      return adminNavs
    }
  }
  
  const onLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, logout",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      Swal.fire({
        title: "Logged out",
        text: "You have been successfully logged out.",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        setUser(null)
        router.push("/auth/login");
      });
    }
  }
  return (
    <aside className={twMerge(
      "absolute top-0 bottom-0 left-0 xl:static bg-white text-black box-border flex flex-col z-50",
      isOpen ? "w-70" : "w-auto",
      !isOpen && "max-w-18 -translate-x-full md:translate-x-0"
    )}>
      <header className={twMerge(
        "bg-transparent h-12.5 flex relative items-center p-3 box-content border-white/20 border-b"
      )}>
        <div className={twMerge(
          "relative h-10 w-20",
          !isOpen && "hidden"
        )}>
          <Image
            src={"/LogoTextDark.svg"}
            alt={"logo"}
            fill
            loading="eager"
            style={{ objectFit: "contain" }}
            className={"ml-2"}
          />
        </div>
        <button onClick={() => toggleSidebar()}
          className={twMerge(
            "p-3 cursor-pointer hover:bg-white/10 rounded-2xl border-none",
            isOpen && "ml-auto"
          )
        }>
          <SidebarIcon size={24}/>
        </button>
      </header>
      <nav className={twMerge(
        "p-3 overflow-hidden box-border",

      )}>
        <ul className={"flex flex-col gap-y-3"}>
          {userNavs().map((nav: {name: string, icon: LucideIcon, path: string}) => (
            <li key={nav.name}>
              <Link href={nav.path} className={twMerge(
                "flex gap-x-4 p-3 rounded-xl items-center",
                pathname !== nav.path && "hover:bg-theme-dark-blue/20",
                pathname === nav.path && "bg-theme-dark-blue text-white"
              )}>
                <nav.icon
                  size={24}
                />
                <span className={twMerge(!isOpen && "hidden", "text-sm")}>{nav.name}</span>
                {pathname === nav.path && isOpen && (
                  <ChevronRight size={20} color={"white"} className={"ml-auto"}/>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <footer
        className={twMerge(
          "hidden md:block mt-auto h-auto p-2 border-t border-gray-200",
        )}
      >
        <div className={twMerge("flex hover:cursor-pointer p-2 items-center",
          isOpen && "gap-x-3 hover:bg-black/10 rounded-md "
        )}
          onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        >
          <div className="flex rounded-lg h-10 w-10 bg-theme-dark-blue justify-center items-center text-white text-lg font-bold">{user?.first_name.charAt(0).toUpperCase()}</div>
          <div className={twMerge(
            "flex flex-1 flex-col justify-center min-w-0",
            !isOpen && "hidden",
          )}>
            <span className={"text-sm truncate"}>{`${toTitleCase(user?.first_name)} ${toTitleCase(user?.last_name)}`}</span>
            <span className={"text-xs text-gray-500 truncate"}>{user?.email}</span>
          </div>
          <div className={twMerge("p-2",
            !isOpen && "hidden"
          )}>
            <ChevronUp size={20} color="gray"/>
          </div>
        </div>
      </footer>

    </aside>
  )
}
export default Sidebar
