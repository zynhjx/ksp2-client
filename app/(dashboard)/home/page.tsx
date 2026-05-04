'use client'

import { useEffect, useMemo, useState } from "react"
import Title from "@/components/Title"
import ListContainer from "@/components/ListContainer"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { twMerge } from "tailwind-merge"
import { announcementCategoryColors, categoryColorClasses } from "@/lib/utils"
import { fetchYouthPrograms, type YouthProgram } from "@/lib/youthPrograms"
import {
  fetchYouthAnnouncements,
  type YouthAnnouncement,
} from "@/lib/youthAnnouncements"

const EmptyState = ({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) => (
  <div className="w-full rounded-2xl border border-dashed border-theme-blue/25 bg-theme-blue/4 px-5 py-7 text-center">
    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-theme-blue/15 bg-white text-theme-blue/60">
      <span className="text-xs font-semibold">i</span>
    </div>
    <p className="text-sm font-semibold text-theme-blue/85">{title}</p>
    <p className="mt-1 text-xs text-theme-blue/65">{subtitle}</p>
  </div>
)

const Home = () => {
  const { user } = useAuth()
  const router = useRouter()
  const apiBase = process.env.NEXT_PUBLIC_EXPRESS_API_URL

  const [programs, setPrograms] = useState<YouthProgram[]>([])
  const [programsLoading, setProgramsLoading] = useState(true)
  const [programsError, setProgramsError] = useState("")
  const [announcements, setAnnouncements] = useState<YouthAnnouncement[]>([])
  const [announcementsLoading, setAnnouncementsLoading] = useState(true)
  const [announcementsError, setAnnouncementsError] = useState("")

  useEffect(() => {
    let active = true

    const loadPrograms = async () => {
      const result = await fetchYouthPrograms(apiBase)
      if (!active) return

      if (!result.ok) {
        if (result.status === 403 && result.reason === "pending_activation") {
          router.replace("/activation-pending")
          return
        }

        setPrograms([])
        setProgramsError(result.message)
        setProgramsLoading(false)
        return
      }

      setPrograms(result.data)
      setProgramsError("")
      setProgramsLoading(false)
    }

    void loadPrograms()

    return () => {
      active = false
    }
  }, [apiBase, router])

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

        setAnnouncements([])
        setAnnouncementsError(result.message)
        setAnnouncementsLoading(false)
        return
      }

      setAnnouncements(result.data.slice(0, 8))
      setAnnouncementsError("")
      setAnnouncementsLoading(false)
    }

    void loadAnnouncements()

    return () => {
      active = false
    }
  }, [apiBase, router])

  const upcomingPrograms = useMemo(
    () => programs.filter((program) => program.status === "Upcoming"),
    [programs]
  )

  const ongoingPrograms = useMemo(
    () => programs.filter((program) => program.status === "Ongoing"),
    [programs]
  )

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const displayName = user?.first_name?.trim() || "there"

  const formatProgramDate = (value: string) => {
    if (!value) return "TBA"

    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return "TBA"

    return date.toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <section className="relative overflow-hidden mb-6 rounded-3xl border border-theme-blue/10 bg-linear-to-br from-theme-dark-blue via-theme-blue to-cyan-500 p-6 md:p-8 text-white shadow-lg shadow-theme-blue/20">
        <div className="absolute -right-14 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-16 -bottom-18 h-56 w-56 rounded-full bg-cyan-200/20 blur-2xl" />

        <div className="relative z-10">
          <Title className="mb-2 text-3xl text-white">
            {getGreeting()}, {displayName}!
          </Title>
          <p className="text-sm md:text-base text-blue-100/95">
            Here is your youth dashboard snapshot for today.
          </p>
        </div>
      </section>

      <div className="grid grid-cols-6 gap-4 xl:gap-y-0">
        <div className="grid col-span-6 xl:col-span-4 grid-cols-1 gap-4">

          <ListContainer
            title="Upcoming Program" 
            onViewAll={() => router.push("/programs?filter=upcoming")}
          >
            <div
              className={twMerge(
                "flex flex-col h-84 gap-2 overflow-y-auto pr-1",
                upcomingPrograms.length === 0 && "justify-center items-center"
              )}
            >
              {programsLoading ? (
                <p className="text-sm text-theme-blue/50 italic">Loading programs...</p>
              ) : programsError ? (
                <p className="text-sm text-red-500 italic">{programsError}</p>
              ) : upcomingPrograms.length === 0 ? (
                <EmptyState
                  title="No upcoming programs yet"
                  subtitle="New programs for your barangay will appear here."
                />
              ) : (
                upcomingPrograms.map((l) => {

                  return (
                    <div
                      key={l.id}
                      className={twMerge(
                        "group flex items-center justify-between border border-gray-100 bg-white rounded-xl px-4 py-3 gap-4 shadow-sm hover:shadow-md hover:border-theme-blue/20 transition-all",
                      )}
                    >
                      {/* Left: dot + title + location */}
                      <div className="flex flex-4 items-center gap-3 min-w-0">
                        <div className={twMerge("m-2 w-2 h-2 rounded-full shrink-0",
                          categoryColorClasses[l.category]
                        )} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-theme-blue truncate group-hover:text-theme-dark-blue transition-colors">
                            {l.name}
                          </p>
                          <p className={twMerge("text-xs mt-0.5 text-gray-500 truncate")}>
                            {l.description}
                          </p>
                        </div>
                      </div>

                      {/* Right: start time */}
                        <span className={twMerge("text-xs flex-1 font-semibold text-theme-blue/80 shrink-0 tabular-nums text-end truncate")}>
                          {formatProgramDate(l.startDate)}
                        </span>
                    </div>
                  );
                })
              )}
            </div>
          </ListContainer>



          <ListContainer
            title="Ongoing Program"
            onViewAll={() => router.push("/programs?filter=ongoing")}
          >
            <div
              className={twMerge(
                "flex flex-col h-84 gap-2 overflow-y-auto pr-1",
                ongoingPrograms.length === 0 && "justify-center items-center"
              )}
            >
              {programsLoading ? (
                <p className="text-sm text-theme-blue/50 italic">Loading programs...</p>
              ) : programsError ? (
                <p className="text-sm text-red-500 italic">{programsError}</p>
              ) : ongoingPrograms.length === 0 ? (
                <EmptyState
                  title="No ongoing programs right now"
                  subtitle="Programs that are currently active will be listed here."
                />
              ) : (
                ongoingPrograms.map((l) => {

                  return (
                    <div
                      key={l.id}
                      className={twMerge(
                        "group flex items-center justify-between border border-gray-100 bg-white rounded-xl px-4 py-3 gap-4 shadow-sm hover:shadow-md hover:border-theme-blue/20 transition-all",
                      )}
                    >
                      {/* Left: dot + title + location */}
                      <div className="flex flex-4 items-center gap-3 min-w-0">
                        <div className={twMerge("m-2 w-2 h-2 rounded-full shrink-0",
                          categoryColorClasses[l.category]
                        )} />
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-theme-blue truncate group-hover:text-theme-dark-blue transition-colors">
                            {l.name}
                          </p>
                          <p className={twMerge("text-xs mt-0.5 text-gray-500 truncate")}>
                            {l.description}
                          </p>
                        </div>
                      </div>

                      <span className={twMerge("flex-1 text-xs text-end font-semibold text-theme-blue/80 shrink-0 tabular-nums min-w-0 truncate")}>
                        {l.location}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </ListContainer>
        </div>
        
        <div className="col-span-6 xl:col-span-2">
          <ListContainer
            title="Announcements" 
            onViewAll={() => router.push("/announcements")}
            className="h-auto max-h-200"
          >
            <div 
              className={twMerge("flex flex-col min-h-100 overflow-y-auto space-y-2 pr-1",
                announcements.length === 0 && "justify-center items-center"
              )}
            >
              {announcementsLoading ? (
                <p className="text-sm text-theme-blue/50 italic">Loading announcements...</p>
              ) : announcementsError ? (
                <p className="text-sm text-red-500 italic">{announcementsError}</p>
              ) : announcements.length === 0 ? (
                <EmptyState
                  title="No announcements yet"
                  subtitle="Important updates from SK will show up here."
                />
              ) : (
                announcements.map((l) => (
                  <div key={l.id}
                    className="group flex items-start border border-gray-100 bg-white rounded-xl px-3.5 py-3 gap-3 shadow-sm hover:shadow-md hover:border-theme-blue/20 transition-all"
                  >
                    <div className="flex flex-1 min-w-0 items-start space-x-2">
                      <div className={twMerge("shrink-0 flex items-center justify-center rounded-full h-4 w-4 animate-pulse",
                        announcementCategoryColors[l.type.toLowerCase()]
                      )}>
                        <div className="rounded-full h-2 w-2 bg-white"/>
                      </div>
                      <div className="flex flex-col min-w-0">
                        <p className="text-xs font-semibold text-theme-blue truncate group-hover:text-theme-dark-blue transition-colors">{l.title}</p>
                        <p className="text-[11px] leading-4 text-gray-500 line-clamp-2">
                          {l.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>
          </ListContainer>
        </div>
        

        
      </div>
      
    </>
  )
}
export default Home
