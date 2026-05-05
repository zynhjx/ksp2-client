
"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { MapPin, Clock } from "lucide-react"

type SuggestionCardProps = {
  suggestion?: {
    id: string
    title: string
    description: string
    suggestedSolution: string
    location: string
    createdAt?: string
  }
  canModify?: boolean
  onApprove?: (id: string) => void
  onDecline?: (id: string) => void
  onDelete?: (id: string) => void
}

const mockSuggestion = {
  id: "1",
  title: "Improve Street Lighting in Barangay",
  description:
    "Many areas in our barangay lack adequate street lighting, making it unsafe for residents to walk at night. This poses security risks and impacts quality of life.",
  suggestedSolution:
    "Install LED street lights on major streets and pathways. Consider solar-powered options for cost efficiency and sustainability.",
  location: "Main Street, Various Areas",
  createdAt: new Date().toISOString(),
}


const SuggestionCard = ({ suggestion }: SuggestionCardProps) => {
  const current = suggestion || mockSuggestion
  const [open, setOpen] = useState(false)

  // Card layout
  const CardContent = (
    <div className="flex flex-col gap-3 p-4">
      {/* Title */}
      <h2 className="text-base font-semibold text-gray-900 leading-snug wrap-anywhere line-clamp-3">
        {current.title}
      </h2>

      {/* Description + Suggested Solution (scrollable in dialog) */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Description
          </span>
          <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere line-clamp-5">
            {current.description}
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Suggested Solution
          </span>
          <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere line-clamp-5">
            {current.suggestedSolution}
          </p>
        </div>
        {current.createdAt && (
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Submitted
            </span>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <Clock size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
              <span>{new Date(current.createdAt).toLocaleString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}</span>
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <hr className="border-gray-100" />

      {/* Location */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPin size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
          <span className="wrap-anywhere">{current.location}</span>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <article
        className="group relative border border-gray-200 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        {CardContent}
      </article>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden gap-0" aria-describedby={undefined}>
          <div className="px-6 pt-6 pb-2">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold text-gray-900 leading-snug wrap-anywhere max-w-[calc(100%-2.5rem)]">
                {current.title}
              </DialogTitle>
            </DialogHeader>
          </div>
          {/* Scrollable desc+solution */}
          <div className="max-h-[30rem] overflow-y-auto px-6 pt-2 pb-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Description
              </span>
              <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere">
                {current.description}
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                Suggested Solution
              </span>
              <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere">
                {current.suggestedSolution}
              </p>
            </div>
            {current.createdAt && (
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
                  Submitted
                </span>
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
                  <span>{new Date(current.createdAt).toLocaleString("en-PH", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit", hour12: true })}</span>
                </div>
              </div>
            )}
          </div>
          {/* Divider */}
          <hr className="border-gray-100 mx-6" />
          {/* Location */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-6 pt-2 pb-6">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <MapPin size={12} strokeWidth={2} className="text-gray-400 shrink-0" />
              <span className="wrap-anywhere">{current.location}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SuggestionCard