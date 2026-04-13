"use client"

import TitleWithSearchBar from "@/components/TitleWithSearchBar"
import { useState } from "react"

const filters = [
  {
    label: "Category",
    options: ["All", "Health", "Education", "Livelihood", "Environment"],
  }
]

const Suggestions = () => {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("")


  return (
    <>
      <TitleWithSearchBar
        title="Community Suggestions"
        search={search}
        setSearch={setSearch}
        subtitle="Share our ideas and feedback to help improve programs and services in your barangay"
        searchPlaceholder="Search suggestions..."
        filter={filters}
      />
    </>
  )
}
export default Suggestions
