"use client"

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

const AnnouncementCard = ({ announcement }: AnnouncementCardProps) => {
  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "general":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "event":
        return "bg-green-50 text-green-700 border-green-200"
      case "urgent":
        return "bg-red-50 text-red-700 border-red-200"
      case "reminder":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "opportunity":
        return "bg-purple-50 text-purple-700 border-purple-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-theme-card-white shadow-sm transition-all duration-180 hover:shadow-md hover:border-gray-300">
      <div className="flex flex-col gap-5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 leading-snug">
              {announcement.title}
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed line-clamp-3 wrap-break-word">
              {announcement.content}
            </p>
          </div>
          <span
            className={`inline-flex shrink-0 rounded-2xl border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] ${getTypeColor(
              announcement.type
            )}`}
          >
            {announcement.type}
          </span>
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
  )
}

export default AnnouncementCard
