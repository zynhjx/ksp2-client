'use client'

import Title from "@/components/Title"
import { useAuth } from "@/context/AuthContext"
import { div } from "framer-motion/client"

const stats = [
  {label: "Suggestions", value: 21},
  {label: "Likes", value: 21},
  {label: "Programs Joined", value: 21},
  {label: "Ongoing Programs", value: 21}
]

const Dashboard = () => {

  const { user } = useAuth()

  return (
    <>
      <Title className="text-center mb-8 text-3xl">Dashboard</Title>

      <div className="flex gap-4">
        {stats.map((s) => (
          <div key={s.label}
            className="bg-theme-card-white border border-theme-card-border shadow-sm rounded-2xl h-20 flex-1 flex flex-col justify-center items-center"
          >
            <span className="text-2xl font-bold">{s.value}</span>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </>
  )
}
export default Dashboard
