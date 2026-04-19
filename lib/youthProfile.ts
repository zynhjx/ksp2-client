import { apiFetch } from "@/lib/api"

export type YouthProfile = {
  id: string
  email: string
  role: string
  status: string
  first_name: string
  last_name: string
  barangay: string
  education: string
  employment_status: string
  gender: string
  date_of_birth: string
}

type YouthProfileApiRecord = {
  id?: number | string
  email?: string
  role?: string
  status?: string
  first_name?: string
  last_name?: string
  barangay?: string
  education?: string
  employment_status?: string
  gender?: string
  date_of_birth?: string
}

type ApiResult = {
  ok: boolean
  status: number
  message: string
  reason?: string
  data: YouthProfile | null
}

export type UpdateYouthProfileInput = {
  firstName: string
  lastName: string
  barangay: string
  education: string
  employmentStatus: string
  gender: string
  dateOfBirth: string
}

const toDateInputValue = (value: string) => {
  const raw = String(value ?? "").trim()
  if (!raw) return ""

  // Accept common API formats like YYYY-MM-DD and ISO timestamps.
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10)
  }

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return ""

  const year = parsed.getUTCFullYear()
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0")
  const day = String(parsed.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

const normalizeProfile = (record: YouthProfileApiRecord): YouthProfile => ({
  id: String(record.id ?? ""),
  email: String(record.email ?? ""),
  role: String(record.role ?? "youth"),
  status: String(record.status ?? "active"),
  first_name: String(record.first_name ?? ""),
  last_name: String(record.last_name ?? ""),
  barangay: String(record.barangay ?? ""),
  education: String(record.education ?? ""),
  employment_status: String(record.employment_status ?? ""),
  gender: String(record.gender ?? ""),
  date_of_birth: toDateInputValue(String(record.date_of_birth ?? "")),
})

export async function fetchYouthProfile(apiBase?: string): Promise<ApiResult> {
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      message: "Missing API URL configuration.",
      data: null,
    }
  }

  try {
    const response = await apiFetch(`${apiBase}/api/youth/profile`, {
      method: "GET",
      credentials: "include",
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: String(body?.message ?? "Failed to load profile."),
        reason: typeof body?.reason === "string" ? body.reason : undefined,
        data: null,
      }
    }

    return {
      ok: true,
      status: response.status,
      message: String(body?.message ?? "Profile fetched successfully"),
      data: body?.data ? normalizeProfile(body.data as YouthProfileApiRecord) : null,
    }
  } catch {
    return {
      ok: false,
      status: 500,
      message: "Unable to connect to the server.",
      data: null,
    }
  }
}

export async function updateYouthProfile(
  apiBase: string | undefined,
  payload: UpdateYouthProfileInput
): Promise<ApiResult> {
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      message: "Missing API URL configuration.",
      data: null,
    }
  }

  try {
    const response = await apiFetch(`${apiBase}/api/youth/profile`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formData: payload,
      }),
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: String(body?.message ?? "Failed to update profile."),
        reason: typeof body?.reason === "string" ? body.reason : undefined,
        data: null,
      }
    }

    return {
      ok: true,
      status: response.status,
      message: String(body?.message ?? "Profile updated successfully"),
      data: body?.data ? normalizeProfile(body.data as YouthProfileApiRecord) : null,
    }
  } catch {
    return {
      ok: false,
      status: 500,
      message: "Unable to connect to the server.",
      data: null,
    }
  }
}