"use client"

import { MapPin } from "lucide-react"

type SuggestionCardProps = {
  suggestion?: {
    id: string
    title: string
    category: string
    description: string
    suggestedSolution: string
    location: string
  }
  canModify?: boolean
  onApprove?: (id: string) => void
  onDecline?: (id: string) => void
  onDelete?: (id: string) => void
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Education":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Employment":
      return "bg-violet-50 text-violet-700 border-violet-200"
    case "Health":
      return "bg-rose-50 text-rose-700 border-rose-200"
    case "Sports":
      return "bg-green-50 text-green-700 border-green-200"
    case "Environment":
      return "bg-teal-50 text-teal-700 border-teal-200"
    case "Community / Social":
      return "bg-orange-50 text-orange-700 border-orange-200"
    default:
      return "bg-gray-100 text-gray-600 border-gray-200"
  }
}

const mockSuggestion = {
  id: "1",
  title: "Improve Street Lighting in Barangay",
  category: "Community / Social",
  description:
    "Many areas in our barangay lack adequate street lighting, making it unsafe for residents to walk at night. This poses security risks and impacts quality of life.",
  suggestedSolution:
    "Install LED street lights on major streets and pathways. Consider solar-powered options for cost efficiency and sustainability.",
  location: "Main Street, Various Areas",
}

const SuggestionCard = ({ suggestion }: SuggestionCardProps) => {
  const current = suggestion || mockSuggestion

  return (
    <article className="group relative border border-gray-200 rounded-2xl bg-white flex flex-col overflow-hidden shadow-sm hover:shadow-lg hover:border-gray-300 transition-all duration-200">

      <div className="flex flex-col gap-3 p-4">
        {/* Title + Category */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-base font-semibold text-gray-900 leading-snug flex-1 wrap-anywhere">
            {current.title}
          </h2>
          <span
            className={`shrink-0 text-[11px] font-semibold rounded-full px-2.5 py-1 border ${getCategoryColor(current.category)}`}
          >
            {current.category}
          </span>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Description
          </span>
          <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere">
            {current.description}
          </p>
        </div>

        {/* Suggested Solution */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
            Suggested Solution
          </span>
          <p className="text-sm text-gray-600 leading-relaxed wrap-anywhere">
            {current.suggestedSolution}
          </p>
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
    </article>
  )
}

export default SuggestionCard