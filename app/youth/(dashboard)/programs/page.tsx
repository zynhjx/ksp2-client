"use client"

import { useState } from "react"
import TitleWithSearchBar from "@/components/TitleWithSearchBar"
import ProgramCard from "@/components/ProgramCard"

const filters = [
  {
    label: "Status",
    options: ["All", "Ongoing", "Upcoming", "Completed"],
  },
  {
    label: "Category",
    options: ["All", "Health", "Education", "Livelihood", "Environment"],
  }
]

const Programs = () => {
  const [search, setSearch] = useState("")

  return (
    <>
      <TitleWithSearchBar
        title="Programs"
        subtitle="Explore ongoing and upcoming activities."
        search={search}
        setSearch={setSearch}
        buttonLabel="Add Program"
        searchPlaceholder="Search by program name"
      />

      <div 
        className="grid gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}
      >
        <ProgramCard/>
        <ProgramCard/>
        <ProgramCard/>
        <ProgramCard/>
        <ProgramCard/>
        <ProgramCard/>
        <ProgramCard/>
      </div>

    </>
  )
}

export default Programs