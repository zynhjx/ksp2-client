"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import ProgramCard from "@/components/ProgramCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchYouthPrograms, type YouthProgram } from "@/lib/youthPrograms"

const statusOptions = ["All", "Ongoing", "Upcoming", "Completed"]
const categoryOptions = [
  "All",
  "Health",
  "Education",
  "Livelihood",
  "Environment",
  "Community",
  "Youth",
  "Sports",
  "Technology",
  "Culture",
  "Safety",
  "Welfare",
  "Employment",
  "Agriculture",
  "Innovation",
  "Infrastructure",
  "Outreach",
  "Disaster",
  "Nutrition",
  "Tourism",
  "Governance",
];

const Programs = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const apiBase = process.env.NEXT_PUBLIC_EXPRESS_API_URL

  const rawFilter = searchParams.get("filter")
  const normalizedFilter = rawFilter?.trim().toLowerCase() ?? ""

  const statusFilterMap: Record<string, string> = {
    all: "All",
    ongoing: "Ongoing",
    upcoming: "Upcoming",
    completed: "Completed",
    joined: "Ongoing",
  }

  const initialStatusFilter = statusFilterMap[normalizedFilter] ?? "All"
  const initialCategoryFilter =
    categoryOptions.find((option) => option.toLowerCase() === normalizedFilter) ?? "All"

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter)
  const [categoryFilter, setCategoryFilter] = useState(
    initialStatusFilter !== "All" ? "All" : initialCategoryFilter
  )
  const [programs, setPrograms] = useState<YouthProgram[]>([])
  const [loadingPrograms, setLoadingPrograms] = useState(true)
  const [loadError, setLoadError] = useState("")

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
        setLoadError(result.message)
        setLoadingPrograms(false)
        return
      }

      setPrograms(result.data)
      setLoadError("")
      setLoadingPrograms(false)
    }

    void loadPrograms()

    return () => {
      active = false
    }
  }, [apiBase, router])

  const filteredPrograms = useMemo(() => {
    const query = search.trim().toLowerCase()

    return programs.filter((program) => {
      const matchesSearch =
        !query ||
        [program.name, program.description, program.category, program.location].some((value) =>
          value.toLowerCase().includes(query)
        )

      const matchesStatus =
        statusFilter === "All" || program.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesCategory =
        categoryFilter === "All" || program.category.toLowerCase() === categoryFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [programs, search, statusFilter, categoryFilter])


  return (
    <>
      <div className="flex flex-col mb-8">
        <div className="flex mb-6">
          <div className="flex flex-col space-y-1">
            <h1 className="font-bold text-3xl text-theme-dark-blue">Programs</h1>
            <p className="text-gray-500">Explore ongoing and upcoming activities.</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
            placeholder="Search by program name"
          />

          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-40 h-12.5! bg-white! border border-gray-200 rounded-sm px-4">
          <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40 h-12.5! bg-white! border border-gray-200 rounded-sm px-4">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          </div>
        </div>
      </div>

      {loadingPrograms ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          Loading programs...
        </div>
      ) : loadError ? (
        <div className="rounded-2xl border border-dashed border-red-300 bg-theme-card-white p-8 text-center text-red-600">
          {loadError}
        </div>
      ) : filteredPrograms.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-theme-card-white p-8 text-center text-gray-500">
          No programs match your search or filters.
        </div>
      ) : (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}
        >
          {filteredPrograms.map((program) => (
            <ProgramCard key={program.id} program={program} />
          ))}
        </div>
      )}
    </>
  )
}

export default Programs