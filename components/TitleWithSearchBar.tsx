"use client"

import { useState } from "react"
import { twMerge } from "tailwind-merge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type FilterType = {
  label: string
  options: string[]
}

type TitleWithSearchBarType = {
  title: string
  subtitle?: string
  filter?: FilterType[]
  actionButton?: boolean
  buttonLabel?: string
  onButtonClick?: () => void
  searchPlaceholder: string
  search: string
  setSearch: React.Dispatch<React.SetStateAction<string>>
}

const TitleWithSearchBar = ({
    title, 
    subtitle, 
    filter, 
    actionButton, 
    buttonLabel, 
    onButtonClick, 
    searchPlaceholder,
    search,
    setSearch
  }: TitleWithSearchBarType) => {

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({})

  const handleFilterChange = (label: string, value: string) => {
    setSelectedFilters((prev) => ({ ...prev, [label]: value }))
  }

  return (
    <div className="flex flex-col mb-8">
      <div className="flex mb-6">
        <div className="flex flex-col space-y-1">
          <h1 className={twMerge("font-bold text-2xl text-theme-dark-blue")}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-500">{subtitle}</p>
          )}
        </div>

        {actionButton &&  (
          <div className="ml-auto flex items-center">
            <button
              onClick={onButtonClick}
              className="bg-theme-dark-blue text-theme-white px-5 py-2 rounded-md"
            >
              {buttonLabel ?? "Button"}
            </button>
          </div>
        )}
        
      </div>
      
      <div className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white flex-1 px-4 py-3 rounded-sm focus:outline-0 border border-gray-200"
          placeholder={searchPlaceholder}
        />

        {filter && filter.length > 0 && (
          <div className="flex gap-2">
            {filter.map((f) => (
              <Select
                key={f.label}
                value={selectedFilters[f.label] ?? ""}
                onValueChange={(value) => handleFilterChange(f.label, value)}
              >
                <SelectTrigger className="w-40 bg-white! border border-gray-200 rounded-sm px-4 py-3 h-12.5!">
                  <SelectValue placeholder={f.label} />
                </SelectTrigger>
                <SelectContent>
                  {f.options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default TitleWithSearchBar