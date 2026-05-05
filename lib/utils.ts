import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const categoryColorClasses: Record<string, string> = {
  All: "bg-gray-500",

  Health: "bg-red-500",
  Education: "bg-blue-500",
  Livelihood: "bg-amber-500",
  Environment: "bg-green-500",

  Community: "bg-teal-500",
  Youth: "bg-pink-500",
  Sports: "bg-orange-500",
  Technology: "bg-indigo-500",
  Culture: "bg-violet-500",

  Safety: "bg-rose-500",
  Welfare: "bg-cyan-500",
  Employment: "bg-yellow-500",
  Agriculture: "bg-lime-500",
  Innovation: "bg-purple-500",

  Infrastructure: "bg-stone-500",
  Outreach: "bg-sky-500",
  Disaster: "bg-red-600",
  Nutrition: "bg-emerald-500",
  Tourism: "bg-fuchsia-500",
  Governance: "bg-slate-500",
};

export const announcementCategoryColors: Record<string, string> = {
  general: "bg-blue-500",
  event: "bg-green-500",
  urgent: "bg-red-500",
  reminder: "bg-yellow-500",
  opportunity: "bg-purple-500",
};

export const announcementIconBg: Record<string, string> = {
  general: "bg-blue-100 border-blue-200",
  urgent: "bg-red-100 border-red-200",
  event: "bg-purple-100 border-purple-200",
  reminder: "bg-amber-100 border-amber-200",
  opportunity: "bg-emerald-100 border-emerald-200",
  default: "bg-blue-100 border-blue-200",
};

export const announcementIconColor: Record<string, string> = {
  general: "text-blue-500",
  urgent: "text-red-500",
  event: "text-purple-500",
  reminder: "text-amber-500",
  opportunity: "text-emerald-500",
  default: "text-blue-500",
};

export const announcementBadge: Record<string, string> = {
  general: "bg-blue-50 text-blue-700 border-blue-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
  event: "bg-purple-50 text-purple-700 border-purple-200",
  reminder: "bg-amber-50 text-amber-700 border-amber-200",
  opportunity: "bg-emerald-50 text-emerald-700 border-emerald-200",
  default: "bg-gray-100 text-gray-700 border-gray-200",
};