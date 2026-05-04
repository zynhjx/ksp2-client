'use client'

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import Title from "@/components/Title"
import ListContainer from "@/components/ListContainer"
import { twMerge } from "tailwind-merge"
import { announcementCategoryColors, categoryColorClasses } from "@/lib/utils"
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Lightbulb,
  Megaphone,
  Users,
} from "lucide-react"
import type { YouthProgram } from "@/lib/youthPrograms"
import type { YouthAnnouncement } from "@/lib/youthAnnouncements"

// --- Mock Data ---

const MOCK_PROGRAMS: YouthProgram[] = [
  {
    id: "1",
    name: "SK Youth Leadership Summit",
    description: "Leadership training and workshops for youth aged 15–24.",
    category: "Education",
    location: "Barangay Hall, Main Building",
    createdAt: "2025-03-01T00:00:00Z",
    startDate: "2026-05-15",
    untilDate: "2026-05-17",
    status: "Upcoming",
    participants: 80,
  },
  {
    id: "2",
    name: "Coastal Cleanup Drive",
    description: "Community effort to clean shorelines and promote eco-awareness.",
    category: "Environment",
    location: "Barangay Beach Area",
    createdAt: "2025-03-10T00:00:00Z",
    startDate: "2026-05-20",
    untilDate: "2026-05-20",
    status: "Upcoming",
    participants: 50,
  },
  {
    id: "7",
    name: "Youth Entrepreneurship Workshop",
    description: "Practical sessions on starting and managing a small business.",
    category: "Livelihood",
    location: "SK Office, Training Room",
    createdAt: "2025-04-12T00:00:00Z",
    startDate: "2026-05-25",
    untilDate: "2026-05-26",
    status: "Upcoming",
    participants: 40,
  },
  {
    id: "8",
    name: "Barangay Cultural Night",
    description: "Showcase of local arts, dances, and cultural performances.",
    category: "Culture",
    location: "Barangay Covered Court",
    createdAt: "2025-04-20T00:00:00Z",
    startDate: "2026-06-01",
    untilDate: "2026-06-01",
    status: "Upcoming",
    participants: 120,
  },
  {
    id: "9",
    name: "First Aid & Safety Training",
    description: "Basic life support and emergency response training for youth volunteers.",
    category: "Safety",
    location: "Barangay Health Center",
    createdAt: "2025-04-22T00:00:00Z",
    startDate: "2026-06-08",
    untilDate: "2026-06-09",
    status: "Upcoming",
    participants: 60,
  },
  {
    id: "10",
    name: "Tree Planting Campaign",
    description: "Reforestation drive to restore greenery in the barangay.",
    category: "Environment",
    location: "Barangay Park & Open Lots",
    createdAt: "2025-05-01T00:00:00Z",
    startDate: "2026-06-15",
    untilDate: "2026-06-15",
    status: "Upcoming",
    participants: 90,
  },
  {
    id: "3",
    name: "Free Medical Mission",
    description: "Free health services including checkups, dental, and medicines.",
    category: "Health",
    location: "Barangay Covered Court",
    createdAt: "2025-04-01T00:00:00Z",
    startDate: "2026-04-20",
    untilDate: "2026-05-10",
    status: "Ongoing",
    participants: 200,
  },
  {
    id: "4",
    name: "Livelihood Skills Training",
    description: "Hands-on training on basic electronics and carpentry for youth.",
    category: "Livelihood",
    location: "SK Office, 2nd Floor",
    createdAt: "2025-04-05T00:00:00Z",
    startDate: "2026-04-28",
    untilDate: "2026-05-28",
    status: "Ongoing",
    participants: 35,
  },
  {
    id: "11",
    name: "Digital Literacy Program",
    description: "Computer basics and internet safety training for youth and seniors.",
    category: "Technology",
    location: "Barangay Computer Lab",
    createdAt: "2025-04-10T00:00:00Z",
    startDate: "2026-04-15",
    untilDate: "2026-05-15",
    status: "Ongoing",
    participants: 45,
  },
  {
    id: "12",
    name: "Nutrition Month Feeding Program",
    description: "Daily feeding assistance for malnourished children in the barangay.",
    category: "Nutrition",
    location: "Day Care Center",
    createdAt: "2025-04-15T00:00:00Z",
    startDate: "2026-05-01",
    untilDate: "2026-05-31",
    status: "Ongoing",
    participants: 75,
  },
  {
    id: "5",
    name: "Sports Fest 2025",
    description: "Inter-purok sports competition promoting teamwork and fitness.",
    category: "Sports",
    location: "Barangay Sports Complex",
    createdAt: "2025-01-15T00:00:00Z",
    startDate: "2025-11-01",
    untilDate: "2025-11-30",
    status: "Completed",
    participants: 150,
  },
  {
    id: "6",
    name: "Barangay Innovation Forum",
    description: "Youth-led forum on technology and local governance innovations.",
    category: "Innovation",
    location: "Barangay Hall, Conference Room",
    createdAt: "2025-02-20T00:00:00Z",
    startDate: "2025-08-12",
    untilDate: "2025-08-12",
    status: "Completed",
    participants: 60,
  },
]

const MOCK_ANNOUNCEMENTS: YouthAnnouncement[] = [
  {
    id: "1",
    title: "Youth Leadership Summit — Registration Now Open",
    content:
      "We are now accepting registrations for the SK Youth Leadership Summit scheduled on May 15–17. Slots are limited to 80 participants. Sign up at the SK Office or message our official page.",
    type: "event",
    postedBy: "SK Chairperson",
    postedAt: "2026-04-28T09:00:00Z",
  },
  {
    id: "2",
    title: "Curfew for Minors Strictly Enforced Starting May 1",
    content:
      "The barangay council reminds all residents that the 10 PM curfew for minors is strictly enforced. Parents are responsible for their children's whereabouts.",
    type: "urgent",
    postedBy: "Barangay Captain",
    postedAt: "2026-04-30T16:00:00Z",
  },
  {
    id: "3",
    title: "Reminder: Free Medical Mission Until May 10",
    content:
      "The free medical mission is ongoing at the covered court until May 10. Bring your barangay ID or any valid ID. No appointment needed.",
    type: "reminder",
    postedBy: "SK Health Committee",
    postedAt: "2026-04-18T08:30:00Z",
  },
  {
    id: "4",
    title: "SK Scholarship Grant Applications Open",
    content:
      "Eligible youths aged 16–24 who are enrolled in college may apply for the SK scholarship grant. Submit requirements at the SK Office by May 31.",
    type: "opportunity",
    postedBy: "SK Secretary",
    postedAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "5",
    title: "Monthly Cleanup Drive Every Last Friday",
    content:
      "Join your neighbors every last Friday of the month for the barangay-wide cleanup. Gloves and trash bags provided. Meet at the covered court at 7 AM.",
    type: "general",
    postedBy: "SK Environment Committee",
    postedAt: "2026-04-05T07:00:00Z",
  },
  {
    id: "6",
    title: "Barangay Cultural Night — Performers Needed",
    content:
      "We are looking for youth performers for the upcoming Barangay Cultural Night on June 1. Singers, dancers, and spoken word artists are welcome. Register at the SK Office before May 20.",
    type: "event",
    postedBy: "SK Cultural Committee",
    postedAt: "2026-04-02T11:00:00Z",
  },
  {
    id: "7",
    title: "Suspension of Classes Due to Typhoon Signal",
    content:
      "All classes in the barangay are suspended effective immediately due to Typhoon Signal No. 2. Residents are advised to stay indoors and away from flood-prone areas.",
    type: "urgent",
    postedBy: "Barangay Disaster Risk Reduction Office",
    postedAt: "2026-03-28T06:00:00Z",
  },
  {
    id: "8",
    title: "Livelihood Skills Training Enrollment Extended",
    content:
      "Due to high demand, enrollment for the Livelihood Skills Training has been extended until May 5. Only a few slots remain — secure yours at the SK Office.",
    type: "reminder",
    postedBy: "SK Livelihood Committee",
    postedAt: "2026-03-25T09:30:00Z",
  },
  {
    id: "9",
    title: "Digital Literacy Program Now Enrolling",
    content:
      "The Digital Literacy Program is open for enrollment. Learn computer basics, internet safety, and job-ready digital skills. Free for all barangay youth aged 15–30.",
    type: "opportunity",
    postedBy: "SK Technology Committee",
    postedAt: "2026-03-20T08:00:00Z",
  },
  {
    id: "10",
    title: "General Assembly This Saturday at 9 AM",
    content:
      "All registered SK youth members are invited to attend the quarterly general assembly this Saturday at the Barangay Hall. Attendance will be recorded.",
    type: "general",
    postedBy: "SK Chairperson",
    postedAt: "2026-03-15T14:00:00Z",
  },
]

// --- Sub-components ---

const EmptyState = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="w-full rounded-2xl border border-dashed border-theme-blue/25 bg-theme-blue/4 px-5 py-7 text-center">
    <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full border border-theme-blue/15 bg-white text-theme-blue/60">
      <span className="text-xs font-semibold">i</span>
    </div>
    <p className="text-sm font-semibold text-theme-blue/85">{title}</p>
    <p className="mt-1 text-xs text-theme-blue/65">{subtitle}</p>
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

const announcementTypeBadge: Record<string, string> = {
  general: "bg-blue-50 text-blue-700 border-blue-200",
  event: "bg-green-50 text-green-700 border-green-200",
  urgent: "bg-red-50 text-red-700 border-red-200",
  reminder: "bg-amber-50 text-amber-700 border-amber-200",
  opportunity: "bg-purple-50 text-purple-700 border-purple-200",
}

// --- Page ---

const Home = () => {
  const { user } = useAuth()
  const router = useRouter()

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
    () => MOCK_PROGRAMS.filter((p) => p.status === "Upcoming"),
    [],
  )

  const ongoingPrograms = useMemo(
    () => MOCK_PROGRAMS.filter((p) => p.status === "Ongoing"),
    [],
  )

  const completedCount = useMemo(
    () => MOCK_PROGRAMS.filter((p) => p.status === "Completed").length,
    [],
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
          value={MOCK_ANNOUNCEMENTS.length}
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
            <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
              {MOCK_ANNOUNCEMENTS.map((a) => (
                <div
                  key={a.id}
                  className="group flex items-start gap-3 rounded-xl border border-gray-100 bg-white px-4 py-3.5 shadow-sm hover:shadow-md hover:border-theme-blue/20 transition-all"
                >
                  <div
                    className={twMerge(
                      "mt-0.5 shrink-0 flex items-center justify-center rounded-full h-5 w-5",
                      announcementCategoryColors[a.type],
                    )}
                  >
                    <div className="rounded-full h-2 w-2 bg-white" />
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
                      announcementTypeBadge[a.type],
                    )}
                  >
                    {announcementTypeLabel[a.type]}
                  </span>
                </div>
              ))}
            </div>
          </ListContainer>

          <ListContainer
            title="Upcoming Programs"
            onViewAll={() => router.push("/programs?filter=upcoming")}
          >
            {upcomingPrograms.length === 0 ? (
              <EmptyState
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
                          "h-3 w-3 rounded-full shrink-0",
                          categoryColorClasses[p.category],
                        )}
                      />
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
                      <p className="text-xs text-gray-400 mt-0.5">
                        {p.participants} participants
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
                        "mt-1 h-3 w-3 rounded-full shrink-0",
                        categoryColorClasses[p.category],
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-theme-blue group-hover:text-theme-dark-blue transition-colors leading-snug">
                        {p.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">{p.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Until {formatDate(p.untilDate)} · {p.participants} participants
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
