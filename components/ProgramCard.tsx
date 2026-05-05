"use client"

import { useState } from "react"
import { MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Program = {
  id: string
  name: string
  status: string
  category: string
  location: string
  description: string
  createdAt: string
  updatedAt?: string
  startDate: string
  untilDate: string
}

type ProgramCardProps = {
  program: Program
}

const MetaItem = ({
  label,
  value,
  valueClassName = "",
}: {
  label: string
  value: string
  valueClassName?: string
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
      {label}
    </span>
    <span className={`text-sm font-semibold leading-snug ${valueClassName || "text-gray-800"}`}>
      {value}
    </span>
  </div>
)

const ProgramCard = ({ program }: ProgramCardProps) => {
  const [open, setOpen] = useState(false)
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      health:         "bg-red-50 text-red-700 border-red-200",
      education:      "bg-blue-50 text-blue-700 border-blue-200",
      livelihood:     "bg-amber-50 text-amber-700 border-amber-200",
      environment:    "bg-green-50 text-green-700 border-green-200",
      community:      "bg-teal-50 text-teal-700 border-teal-200",
      youth:          "bg-pink-50 text-pink-700 border-pink-200",
      sports:         "bg-orange-50 text-orange-700 border-orange-200",
      technology:     "bg-indigo-50 text-indigo-700 border-indigo-200",
      culture:        "bg-violet-50 text-violet-700 border-violet-200",
      safety:         "bg-rose-50 text-rose-700 border-rose-200",
      welfare:        "bg-cyan-50 text-cyan-700 border-cyan-200",
      employment:     "bg-yellow-50 text-yellow-700 border-yellow-200",
      agriculture:    "bg-lime-50 text-lime-700 border-lime-200",
      innovation:     "bg-purple-50 text-purple-700 border-purple-200",
      infrastructure: "bg-stone-50 text-stone-700 border-stone-200",
      outreach:       "bg-sky-50 text-sky-700 border-sky-200",
      disaster:       "bg-red-50 text-red-800 border-red-300",
      nutrition:      "bg-emerald-50 text-emerald-700 border-emerald-200",
      tourism:        "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200",
      governance:     "bg-slate-50 text-slate-700 border-slate-200",
    }
    return map[category.toLowerCase()] ?? "bg-gray-100 text-gray-600 border-gray-200"
  }

  const getCategoryTextColor = (category: string) => {
    const map: Record<string, string> = {
      health:         "text-red-700",
      education:      "text-blue-700",
      livelihood:     "text-amber-700",
      environment:    "text-green-700",
      community:      "text-teal-700",
      youth:          "text-pink-700",
      sports:         "text-orange-700",
      technology:     "text-indigo-700",
      culture:        "text-violet-700",
      safety:         "text-rose-700",
      welfare:        "text-cyan-700",
      employment:     "text-yellow-700",
      agriculture:    "text-lime-700",
      innovation:     "text-purple-700",
      infrastructure: "text-stone-700",
      outreach:       "text-sky-700",
      disaster:       "text-red-800",
      nutrition:      "text-emerald-700",
      tourism:        "text-fuchsia-700",
      governance:     "text-slate-700",
    }
    return map[category.toLowerCase()] ?? "text-gray-700"
  }

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      ongoing: "text-emerald-700",
      upcoming: "text-sky-700",
      completed: "text-gray-600",
    }
    return map[status.toLowerCase()] ?? "text-gray-700"
  }

  return (
    <>
      {/* Card — click to open dialog */}
      <article
        onClick={() => setOpen(true)}
        className="group relative cursor-pointer border border-gray-200 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200"
      >
        <div className="flex flex-col gap-3 p-4 flex-1">
          {/* Title */}
          <h2 className="text-base font-semibold text-gray-900 leading-snug line-clamp-3">
            {program.name}
          </h2>

          {/* Description */}
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-6">
            {program.description}
          </p>

          {/* Divider */}
          <hr className="border-gray-100" />

          {/* Metadata Grid — 3×2 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            <MetaItem
              label="Status"
              value={program.status}
              valueClassName={getStatusColor(program.status)}
            />
            <MetaItem
              label="Category"
              value={program.category}
              valueClassName={`text-sm font-semibold leading-snug ${getCategoryTextColor(program.category)}`}
            />
            <MetaItem label="Created" value={formatDateTime(program.createdAt)} />
            <MetaItem
              label="Last Modified"
              value={program.updatedAt ? formatDateTime(program.updatedAt) : "—"}
            />
            <MetaItem label="Start" value={formatDateTime(program.startDate)} />
            <MetaItem label="Until" value={formatDateTime(program.untilDate)} />
          </div>
        </div>

        {/* Footer — Location */}
        <div className="flex items-center gap-1.5 px-4 py-2.5 border-t border-gray-100 bg-gray-50">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
          <span className="text-xs text-gray-500 truncate">{program.location}</span>
        </div>
      </article>

      {/* Detail Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0" aria-describedby={undefined}>
          <div className="flex flex-col gap-3 p-5">
            {/* Title */}
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-gray-900 leading-snug max-w-[calc(100%-2.5rem)]">
                {program.name}
              </DialogTitle>
            </DialogHeader>

            {/* Description — scrollable if long */}
            <div className="max-h-60 overflow-y-auto pr-1">
              <p className="text-sm text-gray-500 leading-relaxed">
                {program.description}
              </p>
            </div>

            {/* Divider */}
            <hr className="border-gray-100" />

            {/* Metadata Grid — 3×2 matching card layout */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <MetaItem
                label="Status"
                value={program.status}
                valueClassName={getStatusColor(program.status)}
              />
              <MetaItem
                label="Category"
                value={program.category}
                valueClassName={`text-sm font-semibold leading-snug ${getCategoryTextColor(program.category)}`}
              />
              <MetaItem label="Created" value={formatDateTime(program.createdAt)} />
              <MetaItem
                label="Last Modified"
                value={program.updatedAt ? formatDateTime(program.updatedAt) : "—"}
              />
              <MetaItem label="Start" value={formatDateTime(program.startDate)} />
              <MetaItem label="Until" value={formatDateTime(program.untilDate)} />
            </div>
          </div>

          {/* Footer — Location */}
          <div className="flex items-center gap-1.5 px-5 py-2.5 border-t border-gray-100 bg-gray-50">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
            <span className="text-xs text-gray-500">{program.location}</span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ProgramCard