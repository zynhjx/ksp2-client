import { apiFetch } from "@/lib/api"

export type AnnouncementType = "general" | "event" | "urgent" | "reminder" | "opportunity"

export type YouthAnnouncement = {
  id: string
  title: string
  content: string
  type: AnnouncementType
  postedBy: string
  postedAt: string
}

type YouthAnnouncementApiRecord = {
  id?: number | string
  title?: string
  description?: string
  type?: string
  posted_by?: string
  created_at?: string
}

type ApiResult = {
  ok: boolean
  status: number
  message: string
  reason?: string
  data: YouthAnnouncement[]
}

const allowedTypes: AnnouncementType[] = ["general", "event", "urgent", "reminder", "opportunity"]

const normalizeType = (value: unknown): AnnouncementType => {
  const normalized = String(value ?? "").trim().toLowerCase()
  return allowedTypes.includes(normalized as AnnouncementType)
    ? (normalized as AnnouncementType)
    : "general"
}

const normalizeAnnouncement = (record: YouthAnnouncementApiRecord): YouthAnnouncement => {
  return {
    id: String(record.id ?? ""),
    title: String(record.title ?? "Untitled Announcement"),
    content: String(record.description ?? "No description provided."),
    type: normalizeType(record.type),
    postedBy: String(record.posted_by ?? "SK Council"),
    postedAt: String(record.created_at ?? new Date().toISOString()),
  }
}

export async function fetchYouthAnnouncements(apiBase?: string): Promise<ApiResult> {
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      message: "Missing API URL configuration.",
      data: [],
    }
  }

  try {
    const response = await apiFetch(`${apiBase}/api/youth/announcements`, {
      method: "GET",
      credentials: "include",
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: String(body?.message ?? "Failed to load announcements."),
        reason: typeof body?.reason === "string" ? body.reason : undefined,
        data: [],
      }
    }

    const rows = Array.isArray(body?.data) ? (body.data as YouthAnnouncementApiRecord[]) : []

    return {
      ok: true,
      status: response.status,
      message: String(body?.message ?? "Announcements fetched successfully"),
      data: rows.map(normalizeAnnouncement),
    }
  } catch {
    return {
      ok: false,
      status: 500,
      message: "Unable to connect to the server.",
      data: [],
    }
  }
}
