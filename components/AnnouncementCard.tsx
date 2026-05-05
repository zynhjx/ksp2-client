"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Bell, CalendarDays, Megaphone, Sparkles } from "lucide-react"
import { announcementIconBg, announcementIconColor, announcementBadge } from "@/lib/utils"

type Announcement = {
  id: string
  title: string
  type: "general" | "event" | "urgent" | "reminder" | "opportunity"
  content: string
  postedAt: string
  postedBy: string
}

type AnnouncementCardProps = {
  announcement: Announcement
}

const announcementIcon: Record<string, React.ReactNode> = {
  general:     <Megaphone size={22} />,
  urgent:      <AlertTriangle size={22} />,
  event:       <CalendarDays size={22} />,
  reminder:    <Bell size={22} />,
  opportunity: <Sparkles size={22} />,
  default:     <Megaphone size={22} />,
}

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const [open, setOpen] = useState(false)

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  const type = announcement.type
  const iconBg = announcementIconBg[type] ?? announcementIconBg.default
  const iconColor = announcementIconColor[type] ?? announcementIconColor.default
  const badgeClass = announcementBadge[type] ?? announcementBadge.default
  const icon = announcementIcon[type] ?? announcementIcon.default

  const getTypeTextColor = (t: string) => {
    switch (t.toLowerCase()) {
      case "general":     return "text-blue-700"
      case "event":       return "text-purple-700"
      case "urgent":      return "text-red-700"
      case "reminder":    return "text-amber-700"
      case "opportunity": return "text-emerald-700"
      default:            return "text-gray-700"
    }
  }

  return (
    <>
      <article
        onClick={() => setOpen(true)}
        className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-theme-card-white shadow-sm transition-all duration-180 hover:shadow-md hover:border-gray-300 cursor-pointer"
      >
        <div className="flex flex-col gap-5 p-5">
          {/* Title row with icon */}
          <div className="flex items-start gap-4">
            <div
              className={`shrink-0 flex h-11 w-11 items-center justify-center rounded-full border ${iconBg} ${iconColor}`}
            >
              {icon}
            </div>
            <div className="flex flex-col gap-3 flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-gray-900 leading-snug">
                  {announcement.title}
                </h2>
                <span
                  className={`inline-flex shrink-0 rounded-2xl border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${badgeClass}`}
                >
                  {announcement.type}
                </span>
              </div>
              {/* Description spans full width */}
              <p className="text-sm text-gray-600 leading-relaxed line-clamp-3 wrap-break-word">
                {announcement.content}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0">
              Posted by <strong className="text-gray-700">{announcement.postedBy}</strong>
            </p>
            <span className="text-xs text-gray-400">
              {formatDate(announcement.postedAt)}
            </span>
          </div>
        </div>
      </article>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0" aria-describedby={undefined}>
          {/* Title area */}
          <div className="px-6 pt-6 pb-2">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-gray-900 leading-snug line-clamp-3 max-w-[calc(100%-2.5rem)]">
                {announcement.title}
              </DialogTitle>
            </DialogHeader>
          </div>

          {/* Description */}
          <div className="max-h-96 overflow-y-auto px-6 pb-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              {announcement.content}
            </p>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 mx-6" />

          {/* Meta grid — Category | Posted At */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-6 py-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Category
              </span>
              <span className={`text-sm font-semibold leading-snug ${getTypeTextColor(announcement.type)}`}>
                {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Posted At
              </span>
              <span className="text-sm font-semibold text-gray-800 leading-snug">
                {formatDate(announcement.postedAt)}
              </span>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-100 mx-6" />

          {/* Footer — Posted by */}
          <div className="px-6 py-3 bg-gray-50">
            <p className="text-xs text-gray-500">
              Posted by <strong className="text-gray-700">{announcement.postedBy}</strong>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AnnouncementCard
