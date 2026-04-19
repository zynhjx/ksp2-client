"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import AnnouncementCard from "@/components/AnnouncementCard"
import {
  fetchYouthAnnouncements,
  type YouthAnnouncement,
} from "@/lib/youthAnnouncements"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const typeOptions = ["All", "General", "Event", "Urgent", "Reminder", "Opportunity"]

const Announcements = () => {
  const router = useRouter()
  const apiBase = process.env.NEXT_PUBLIC_EXPRESS_API_URL

  const [announcements, setAnnouncements] = useState<YouthAnnouncement[]>([])
  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("All")

  useEffect(() => {
    let active = true

    const loadAnnouncements = async () => {
      const result = await fetchYouthAnnouncements(apiBase)
      if (!active) return

      if (!result.ok) {
        if (result.status === 403 && result.reason === "pending_activation") {
          router.replace("/activation-pending")
          return
        }

        if (result.status === 403 && result.reason === "account_suspended") {
          router.replace("/403?reason=account_suspended")
          return
        }

        setAnnouncements([])
        setLoadError(result.message)
        setLoadingAnnouncements(false)
        return
      }

      setAnnouncements(result.data)
      setLoadError("")
      setLoadingAnnouncements(false)
    }

    void loadAnnouncements()

    return () => {
      active = false
    }
  }, [apiBase, router])

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase()

    return announcements.filter((announcement) => {
      const matchesSearch =
        !query ||
        [announcement.title, announcement.content].some((value) =>
          value.toLowerCase().includes(query)
        )

      const matchesType =
        typeFilter === "All" ||
        announcement.type.toLowerCase() === typeFilter.toLowerCase()

      return matchesSearch && matchesType
    })
  }, [announcements, search, typeFilter])

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-dark-blue">
              Announcements
            </h1>
            <p className="text-gray-500">
              Stay updated with latest news and important information
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search announcements..."
          />

          <div className="flex gap-2">
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48 h-12.5! bg-white! border border-gray-200 rounded-sm px-4">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {loadingAnnouncements ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          Loading announcements...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-dashed border-red-300 bg-theme-card-white p-8 text-center text-red-600">
          {loadError}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          No announcements match your search or filters.
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredAnnouncements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      )}
    </>
  )
}

export default Announcements
