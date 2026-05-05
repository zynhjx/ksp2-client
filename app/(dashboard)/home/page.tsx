'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Title from "@/components/Title"
import ListContainer from "@/components/ListContainer"
import { twMerge } from "tailwind-merge"
import { announcementIconBg, announcementIconColor, announcementBadge, categoryColorClasses } from "@/lib/utils"
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarX2,
  CheckCircle2,
  Clock,
  Cpu,
  Drumstick,
  FlaskConical,
  Globe,
  HandCoins,
  Heart,
  Inbox,
  Landmark,
  Leaf,
  Lightbulb,
  Megaphone,
  Music2,
  ShieldCheck,
  Sparkles,
  Swords,
  Trophy,
  Users,
  Wheat,
  Wrench,
} from "lucide-react"
import type { YouthProgram } from "@/lib/youthPrograms"
import type { YouthAnnouncement } from "@/lib/youthAnnouncements"
import { fetchYouthPrograms } from "@/lib/youthPrograms"
import { fetchYouthAnnouncements } from "@/lib/youthAnnouncements"

// --- Sub-components ---

const EmptyState = ({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
}) => (
  <div className="w-full rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-8 text-center">
    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white border border-gray-200 text-gray-400 shadow-sm">
      {icon}
    </div>
    <p className="text-sm font-semibold text-gray-600">{title}</p>
    <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
  </div>
)

const StatCard = ({
  label,
  value,
  icon,
  accent,
  onClick,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
  accent: string
  onClick?: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className={twMerge(
      "group flex items-center gap-3 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm transition-all text-left w-full",
      onClick
        ? "hover:shadow-md hover:border-gray-200 cursor-pointer"
        : "cursor-default pointer-events-none",
    )}
  >
    <div
      className={twMerge(
        "flex h-10 w-10 items-center justify-center rounded-xl text-white shrink-0",
        accent,
      )}
    >
      {icon}
    </div>
    <div>
      <p className="text-xl font-bold text-theme-dark-blue leading-none">{value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
    </div>
  </button>
)

const QuickAction = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-sm hover:shadow-md hover:border-theme-blue/25 transition-all w-full text-left"
  >
    <div className="flex items-center gap-3">
      <span className="text-theme-blue/70">{icon}</span>
      <span className="text-sm font-medium text-gray-700 group-hover:text-theme-dark-blue transition-colors">
        {label}
      </span>
    </div>
    <ArrowRight size={14} className="text-gray-400 group-hover:text-theme-blue transition-colors" />
  </button>
)

const announcementTypeLabel: Record<string, string> = {
  general: "General",
  event: "Event",
  urgent: "Urgent",
  reminder: "Reminder",
  opportunity: "Opportunity",
}

const announcementTypeIcon: Record<string, React.ReactNode> = {
  general:     <Megaphone size={18} />,
  urgent:      <AlertTriangle size={18} />,
  event:       <CalendarDays size={18} />,
  reminder:    <Bell size={18} />,
  opportunity: <Sparkles size={18} />,
}

const programCategoryIcon: Record<string, React.ReactNode> = {
  Health:         <Heart size={16} />,
  Education:      <BookOpen size={16} />,
  Livelihood:     <HandCoins size={16} />,
  Environment:    <Leaf size={16} />,
  Community:      <Users size={16} />,
  Youth:          <Sparkles size={16} />,
  Sports:         <Trophy size={16} />,
  Technology:     <Cpu size={16} />,
  Culture:        <Music2 size={16} />,
  Safety:         <ShieldCheck size={16} />,
  Welfare:        <Heart size={16} />,
  Employment:     <Wrench size={16} />,
  Agriculture:    <Wheat size={16} />,
  Innovation:     <FlaskConical size={16} />,
  Infrastructure: <Wrench size={16} />,
  Outreach:       <Globe size={16} />,
  Disaster:       <Swords size={16} />,
  Nutrition:      <Drumstick size={16} />,
  Tourism:        <Globe size={16} />,
  Governance:     <Landmark size={16} />,
}

const programCategoryIconBg: Record<string, string> = {
  Health:         "bg-red-100 border-red-200 text-red-500",
  Education:      "bg-blue-100 border-blue-200 text-blue-500",
  Livelihood:     "bg-amber-100 border-amber-200 text-amber-500",
  Environment:    "bg-green-100 border-green-200 text-green-500",
  Community:      "bg-teal-100 border-teal-200 text-teal-500",
  Youth:          "bg-pink-100 border-pink-200 text-pink-500",
  Sports:         "bg-orange-100 border-orange-200 text-orange-500",
  Technology:     "bg-indigo-100 border-indigo-200 text-indigo-500",
  Culture:        "bg-violet-100 border-violet-200 text-violet-500",
  Safety:         "bg-rose-100 border-rose-200 text-rose-500",
  Welfare:        "bg-cyan-100 border-cyan-200 text-cyan-500",
  Employment:     "bg-yellow-100 border-yellow-200 text-yellow-600",
  Agriculture:    "bg-lime-100 border-lime-200 text-lime-600",
  Innovation:     "bg-purple-100 border-purple-200 text-purple-500",
  Infrastructure: "bg-stone-100 border-stone-200 text-stone-500",
  Outreach:       "bg-sky-100 border-sky-200 text-sky-500",
  Disaster:       "bg-red-100 border-red-200 text-red-600",
  Nutrition:      "bg-emerald-100 border-emerald-200 text-emerald-500",
  Tourism:        "bg-fuchsia-100 border-fuchsia-200 text-fuchsia-500",
  Governance:     "bg-slate-100 border-slate-200 text-slate-500",
  default:        "bg-gray-100 border-gray-200 text-gray-500",
}

// --- Page ---

const Home = () => {
  const { user } = useAuth()
  const router = useRouter()
  const apiBase = process.env.NEXT_PUBLIC_EXPRESS_API_URL

  const [programs, setPrograms] = useState<YouthProgram[]>([])
  const [announcements, setAnnouncements] = useState<YouthAnnouncement[]>([])

  useEffect(() => {
    let active = true

    const loadData = async () => {
      const [programsResult, announcementsResult] = await Promise.all([
        fetchYouthPrograms(apiBase),
        fetchYouthAnnouncements(apiBase),
      ])

      if (!active) return

      if (programsResult.ok) setPrograms(programsResult.data)
      if (announcementsResult.ok) setAnnouncements(announcementsResult.data)
    }

    void loadData()

    return () => {
      active = false
    }
  }, [apiBase])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 18) return "Good afternoon"
    return "Good evening"
  }

  const displayName = user?.first_name
    ? user.first_name.charAt(0).toUpperCase() + user.first_name.slice(1).toLowerCase()
    : "there"

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  const formatDateTime = (value: string) =>
    new Date(value).toLocaleDateString("en-PH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })

  const upcomingPrograms = useMemo(
    () => programs.filter((p) => p.status === "Upcoming"),
    [programs],
  )

  const ongoingPrograms = useMemo(
    () => programs.filter((p) => p.status === "Ongoing"),
    [programs],
  )

  const completedCount = useMemo(
    () => programs.filter((p) => p.status === "Completed").length,
    [programs],
  )

  return (
    <>
      <Title className="mb-6">{getGreeting()}, {displayName}!</Title>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Upcoming Programs"
          value={upcomingPrograms.length}
          icon={<Clock size={18} />}
          accent="bg-sky-500"
          onClick={() => router.push("/programs?filter=upcoming")}
        />
        <StatCard
          label="Ongoing Programs"
          value={ongoingPrograms.length}
          icon={<Activity size={18} />}
          accent="bg-green-500"
          onClick={() => router.push("/programs?filter=ongoing")}
        />
        <StatCard
          label="Completed Programs"
          value={completedCount}
          icon={<CheckCircle2 size={18} />}
          accent="bg-violet-500"
          onClick={() => router.push("/programs?filter=completed")}
        />
        <StatCard
          label="Announcements"
          value={announcements.length}
          icon={<Megaphone size={18} />}
          accent="bg-amber-500"
          onClick={() => router.push("/announcements")}
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        {/* Left — Announcements + Upcoming Programs */}
        <div className="xl:col-span-3 flex flex-col gap-4">
          <ListContainer
            title="Latest Announcements"
            onViewAll={() => router.push("/announcements")}
          >
            {announcements.length === 0 ? (
              <EmptyState
                icon={<Inbox size={18} />}
                title="No announcements yet"
                subtitle="Check back later for updates from your barangay."
              />
            ) : (
            <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
              {announcements.map((a) => (
                <div
                  key={a.id}
                  className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm hover:shadow-md hover:border-theme-blue/20 transition-all"
                >
                  <div
                    className={twMerge(
                      "mt-0.5 shrink-0 flex items-center justify-center rounded-full h-8 w-8 border",
                      announcementIconBg[a.type] ?? announcementIconBg.default,
                      announcementIconColor[a.type] ?? announcementIconColor.default,
                    )}
                  >
                    {announcementTypeIcon[a.type] ?? <Megaphone size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-theme-blue group-hover:text-theme-dark-blue transition-colors leading-snug">
                      {a.title}
                    </p>
                    <p className="text-xs leading-relaxed text-gray-500 line-clamp-2 mt-1">
                      {a.content}
                    </p>
                    <p className="text-xs text-gray-400 mt-1.5">
                      {formatDateTime(a.postedAt)} · {a.postedBy}
                    </p>
                  </div>
                  <span
                    className={twMerge(
                      "shrink-0 self-start text-[11px] font-semibold uppercase rounded-full border px-2.5 py-0.5",
                      announcementBadge[a.type] ?? announcementBadge.default,
                    )}
                  >
                    {announcementTypeLabel[a.type]}
                  </span>
                </div>
              ))}
            </div>            )}          </ListContainer>

          <ListContainer
            title="Upcoming Programs"
            onViewAll={() => router.push("/programs?filter=upcoming")}
          >
            {upcomingPrograms.length === 0 ? (
              <EmptyState
                icon={<CalendarX2 size={18} />}
                title="No upcoming programs yet"
                subtitle="New programs for your barangay will appear here."
              />
            ) : (
              <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
                {upcomingPrograms.map((p) => (
                  <div
                    key={p.id}
                    className="group flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3.5 gap-4 shadow-sm hover:shadow-md hover:border-theme-blue/20 transition-all"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={twMerge(
                          "shrink-0 flex h-8 w-8 items-center justify-center rounded-full border",
                          programCategoryIconBg[p.category] ?? programCategoryIconBg.default,
                        )}
                      >
                        {programCategoryIcon[p.category] ?? <Activity size={16} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-theme-blue truncate group-hover:text-theme-dark-blue transition-colors">
                          {p.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-0.5">{p.location}</p>
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold text-sky-600 tabular-nums">
                        {formatDate(p.startDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ListContainer>
        </div>

        {/* Right — Ongoing Programs + Quick Actions */}
        <div className="xl:col-span-2 flex flex-col gap-4">
          <ListContainer
            title="Ongoing Programs"
            onViewAll={() => router.push("/programs?filter=ongoing")}
          >
            {ongoingPrograms.length === 0 ? (
              <EmptyState
                icon={<Activity size={18} />}
                title="No ongoing programs right now"
                subtitle="Active programs will be listed here."
              />
            ) : (
              <div className="flex flex-col gap-2.5 max-h-80 overflow-y-auto pr-1">
                {ongoingPrograms.map((p) => (
                  <div
                    key={p.id}
                    className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm hover:shadow-md hover:border-theme-blue/20 transition-all"
                  >
                    <div
                      className={twMerge(
                        "shrink-0 flex h-8 w-8 items-center justify-center rounded-full border mt-0.5",
                        programCategoryIconBg[p.category] ?? programCategoryIconBg.default,
                      )}
                    >
                      {programCategoryIcon[p.category] ?? <Activity size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-theme-blue group-hover:text-theme-dark-blue transition-colors leading-snug">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{p.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Until {formatDate(p.untilDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ListContainer>

          {/* Quick Actions */}
          <section className="flex flex-col bg-theme-card-white shadow-sm rounded-2xl p-5">
            <h2 className="text-lg font-semibold text-theme-blue mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-2">
              <QuickAction
                icon={<Lightbulb size={16} />}
                label="Submit a Suggestion"
                onClick={() => router.push("/suggestions")}
              />
              <QuickAction
                icon={<Users size={16} />}
                label="Browse All Programs"
                onClick={() => router.push("/programs")}
              />
              <QuickAction
                icon={<Megaphone size={16} />}
                label="View All Announcements"
                onClick={() => router.push("/announcements")}
              />
            </div>
          </section>
        </div>
      </div>
    </>
  )
}

export default Home
