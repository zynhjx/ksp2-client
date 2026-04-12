'use client'

import {
  HomeIcon,
  LucideIcon,
  LucideLayoutDashboard,
  Calendar,
  LightbulbIcon,
  Sidebar as SidebarIcon,
  ChevronRight
} from "lucide-react";
import { useState} from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { twMerge } from 'tailwind-merge';
import { useSidebar } from "@/context/SidebarContext";
import { useAuth } from "@/context/AuthContext";

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
  const { user } = useAuth()
  const userNavs = () => {
    if (pathname.startsWith("/youth")) {
      return youthNavs
    } else if (pathname.startsWith("/sk")) {
      return skNavs
    } else {
      return adminNavs
    }
  }

  return (
    <aside className={twMerge(
      "absolute top-0 bottom-0 left-0 xl:static bg-theme-dark-blue text-white box-border flex flex-col z-50",
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
            src={"/LogoTextLight.svg"}
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
                pathname !== nav.path && "hover:bg-white/10",
                pathname === nav.path && "bg-white/20"
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
          "hidden md:block mt-auto h-auto border-t border-white/20 p-4",
        )}
      >
        <div className={twMerge("flex",
          isOpen && "gap-x-3"
        )}>
          <div className="flex rounded-lg h-10 w-10 bg-blue-950 hover:cursor-pointer justify-center items-center text-base font-bold">F</div>
          <div className={twMerge(
            "flex flex-col justify-center",
            !isOpen && "hidden",
          )}>
            <span className={"text-sm"}>{`${toTitleCase(user?.first_name)} ${toTitleCase(user?.last_name)}`}</span>
            <span className={"text-xs text-gray-300"}>{user?.email}</span>
          </div>
        </div>
      </footer>

    </aside>
  )
}
export default Sidebar
