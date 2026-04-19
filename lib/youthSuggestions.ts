import { apiFetch } from "@/lib/api"

export type YouthSuggestion = {
  id: string
  title: string
  description: string
  suggestedSolution: string
  location: string
  category: string
  createdAt: string
}

type YouthSuggestionApiRecord = {
  id?: number | string
  title?: string
  description?: string
  suggested_solution?: string
  location?: string
  category?: string
  created_at?: string
}

type ApiResult = {
  ok: boolean
  status: number
  message: string
  reason?: string
  data: YouthSuggestion[]
}

type CreateApiResult = {
  ok: boolean
  status: number
  message: string
  reason?: string
  data: YouthSuggestion | null
}

type CreateSuggestionInput = {
  title: string
  description: string
  suggestedSolution: string
  location: string
  category: string
}

const normalizeSuggestion = (record: YouthSuggestionApiRecord): YouthSuggestion => ({
  id: String(record.id ?? ""),
  title: String(record.title ?? "Untitled Suggestion"),
  description: String(record.description ?? "No description provided."),
  suggestedSolution: String(record.suggested_solution ?? "No suggested solution provided."),
  location: String(record.location ?? "TBA"),
  category: String(record.category ?? "General"),
  createdAt: String(record.created_at ?? new Date().toISOString()),
})

export async function fetchYouthSuggestions(apiBase?: string): Promise<ApiResult> {
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      message: "Missing API URL configuration.",
      data: [],
    }
  }

  try {
    const response = await apiFetch(`${apiBase}/api/youth/suggestions`, {
      method: "GET",
      credentials: "include",
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: String(body?.message ?? "Failed to load suggestions."),
        reason: typeof body?.reason === "string" ? body.reason : undefined,
        data: [],
      }
    }

    const rows = Array.isArray(body?.data) ? (body.data as YouthSuggestionApiRecord[]) : []

    return {
      ok: true,
      status: response.status,
      message: String(body?.message ?? "Suggestions fetched successfully"),
      data: rows.map(normalizeSuggestion),
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

export async function createYouthSuggestion(
  apiBase: string | undefined,
  payload: CreateSuggestionInput
): Promise<CreateApiResult> {
  if (!apiBase) {
    return {
      ok: false,
      status: 500,
      message: "Missing API URL configuration.",
      data: null,
    }
  }

  try {
    const response = await apiFetch(`${apiBase}/api/youth/suggestions`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
        suggested_solution: payload.suggestedSolution,
        location: payload.location,
        category: payload.category,
      }),
    })

    const body = await response.json().catch(() => ({}))

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: String(body?.message ?? "Failed to create suggestion."),
        reason: typeof body?.reason === "string" ? body.reason : undefined,
        data: null,
      }
    }

    return {
      ok: true,
      status: response.status,
      message: String(body?.message ?? "Suggestion created successfully"),
      data: body?.data ? normalizeSuggestion(body.data as YouthSuggestionApiRecord) : null,
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
