import { apiFetch } from "@/lib/api"

export type ProgramStatus = "Upcoming" | "Ongoing" | "Completed"

export type YouthProgram = {
  id: string
  name: string
  description: string
  category: string
  location: string
  createdAt: string
  startDate: string
  untilDate: string
  status: ProgramStatus
  participants: number
}

type YouthProgramApiRecord = {
  id?: number | string
  program_name?: string
  description?: string
  category?: string
  location?: string
  start_date?: string
  end_date?: string
  created_at?: string
}

type ApiResult = {
  ok: boolean
  status: number
  message: string
  reason?: string
  data: YouthProgram[]
}

const toStartOfDay = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

const toEndOfDay = (value: string) => {
  const date = new Date(`${value}T23:59:59.999`)
  return Number.isNaN(date.getTime()) ? null : date
}

const deriveStatus = (startDate: string, endDate: string): ProgramStatus => {
  const now = new Date()
  const start = toStartOfDay(startDate)
  const end = toEndOfDay(endDate)

  if (!start || !end) return "Upcoming"
  if (now < start) return "Upcoming"
  if (now > end) return "Completed"
  return "Ongoing"
}

const normalizeProgram = (record: YouthProgramApiRecord): YouthProgram => {
  const startDate = String(record.start_date ?? "")
  const endDate = String(record.end_date ?? startDate)

  return {
    id: String(record.id ?? ""),
    name: String(record.program_name ?? "Untitled Program"),
    description: String(record.description ?? "No description available."),
    category: String(record.category ?? "General"),
    location: String(record.location ?? "TBA"),
    createdAt: String(record.created_at ?? new Date().toISOString()),
    startDate,
    untilDate: endDate,
    status: deriveStatus(startDate, endDate),
    participants: 0,
  }
}

export async function fetchYouthPrograms(apiBase?: string): Promise<ApiResult> {
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      message: "Missing API URL configuration.",
      data: [],
    }
  }

  try {
    const response = await apiFetch(`${apiBase}/api/youth/programs`, {
      method: "GET",
      credentials: "include",
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: String(body?.message ?? "Failed to load programs."),
        reason: typeof body?.reason === "string" ? body.reason : undefined,
        data: [],
      }
    }

    const rows = Array.isArray(body?.data) ? (body.data as YouthProgramApiRecord[]) : []

    return {
      ok: true,
      status: response.status,
      message: String(body?.message ?? "Programs fetched successfully"),
      data: rows.map(normalizeProgram),
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
