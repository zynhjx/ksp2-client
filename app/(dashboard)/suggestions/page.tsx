"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import SuggestionCard from "@/components/SuggestionCard"
import EmptyState from "@/components/EmptyState"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  createYouthSuggestion,
  fetchYouthSuggestions,
  type YouthSuggestion,
} from "@/lib/youthSuggestions"

const EMPTY_FORM = {
  title: "",
  description: "",
  suggestedSolution: "",
  location: "",
}

const Suggestions = () => {
  const router = useRouter()
  const apiBase = process.env.NEXT_PUBLIC_EXPRESS_API_URL

  const [suggestions, setSuggestions] = useState<YouthSuggestion[]>([])
  const [loadingSuggestions, setLoadingSuggestions] = useState(true)
  const [loadError, setLoadError] = useState("")
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitPending, setSubmitPending] = useState(false)
  const [submitError, setSubmitError] = useState("")

  useEffect(() => {
    let active = true

    const loadSuggestions = async () => {
      const result = await fetchYouthSuggestions(apiBase)
      if (!active) return

      if (!result.ok) {
        if (result.status === 403 && result.reason === "pending_activation") {
          router.replace("/activation-pending")
          return
        }

        setSuggestions([])
        setLoadError(result.message)
        setLoadingSuggestions(false)
        return
      }

      setSuggestions(result.data)
      setLoadError("")
      setLoadingSuggestions(false)
    }

    void loadSuggestions()

    return () => {
      active = false
    }
  }, [apiBase, router])

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async () => {
    if (!isValid) return

    setSubmitPending(true)
    setSubmitError("")

    const result = await createYouthSuggestion(apiBase, {
      title: form.title.trim(),
      description: form.description.trim(),
      suggestedSolution: form.suggestedSolution.trim(),
      location: form.location.trim(),
    })

    if (!result.ok) {
      if (result.status === 403 && result.reason === "pending_activation") {
        router.replace("/activation-pending")
        return
      }

      if (result.status === 403 && result.reason === "account_suspended") {
        router.replace("/403?reason=account_suspended")
        return
      }

      setSubmitError(result.message)
      setSubmitPending(false)
      return
    }

    if (result.data) {
      setSuggestions((prev) => [result.data as YouthSuggestion, ...prev])
    }

    setForm(EMPTY_FORM)
    setOpen(false)
    setSubmitPending(false)
  }

  const handleCancel = () => {
    setForm(EMPTY_FORM)
    setSubmitError("")
    setOpen(false)
  }

  const isValid =
    form.title.trim() &&
    form.description.trim() &&
    form.suggestedSolution.trim() &&
    form.location.trim()

  const filteredSuggestions = useMemo(() => {
    const query = search.trim().toLowerCase()

    return suggestions.filter((s) => {
      return (
        query === "" ||
        [s.title, s.description, s.suggestedSolution, s.location].some((value) =>
          value.toLowerCase().includes(query)
        )
      )
    })
  }, [suggestions, search])

  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-dark-blue">Community Suggestions</h1>
            <p className="text-gray-500">Share our ideas and feedback to help improve programs and services in your barangay</p>
          </div>

          <div className="ml-auto flex items-center">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <button className="bg-theme-dark-blue text-theme-white px-5 py-2 rounded-md">
                  + Add Suggestion
                </button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-lg p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl font-bold text-theme-dark-blue">
                    Submit a Suggestion
                  </DialogTitle>
                  <DialogDescription>
                    Share your idea to help improve programs and services in your barangay.
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-2">
                  {/* Title */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                    <Input
                      id="title"
                      placeholder="e.g. Free Medical Checkup for Seniors"
                      value={form.title}
                      onChange={(e) => set("title", e.target.value)}
                      maxLength={150}
                    />
                    <p className="text-xs text-gray-400 text-right">{form.title.length}/150</p>
                  </div>

                  {/* Category */}
                  {/* removed */}

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the problem or concern you want to address..."
                      className="field-sizing-fixed w-full max-w-full resize-none overflow-x-hidden min-h-22.5 wrap-anywhere"
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                    />
                  </div>

                  {/* Suggested Solution */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="solution">Suggested Solution <span className="text-red-500">*</span></Label>
                    <Textarea
                      id="solution"
                      placeholder="What do you think would help solve the problem?"
                      className="field-sizing-fixed w-full max-w-full resize-none overflow-x-hidden min-h-22.5 wrap-anywhere"
                      value={form.suggestedSolution}
                      onChange={(e) => set("suggestedSolution", e.target.value)}
                    />
                  </div>

                  {/* Location */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="location">Location <span className="text-red-500">*</span></Label>
                    <Input
                      id="location"
                      placeholder="e.g. Covered Court, Sitio Mabini"
                      value={form.location}
                      onChange={(e) => set("location", e.target.value)}
                    />
                  </div>

                </div>

                {submitError ? (
                  <p className="text-sm text-red-600">{submitError}</p>
                ) : null}

                {/* Footer actions */}
                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                  <Button variant="outline" onClick={handleCancel} disabled={submitPending}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isValid || submitPending}
                    className="bg-theme-dark-blue text-white hover:bg-theme-dark-blue/90"
                  >
                    {submitPending ? "Submitting..." : "Submit Suggestion"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search suggestions..."
          />
        </div>
      </div>

      <div
        className="grid items-start gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(420px, 1fr))" }}
      >
        {loadingSuggestions ? (
          <EmptyState loading loadingMessage="Loading suggestions..." colSpan />
        ) : loadError ? (
          <div className="col-span-full rounded-2xl border border-dashed border-red-300 bg-theme-card-white p-8 text-center text-red-600">
            {loadError}
          </div>
        ) : filteredSuggestions.length > 0 ? (
          filteredSuggestions.map((suggestion) => (
            <SuggestionCard key={suggestion.id} suggestion={suggestion} />
          ))
        ) : (
          <EmptyState message="No suggestions found." colSpan />
        )}
      </div>
    </>
  )
}

export default Suggestions