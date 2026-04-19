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