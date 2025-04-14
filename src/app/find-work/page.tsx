"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { NeonText } from "@/components/ui/neon-text"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"
import { BackgroundBeams } from "@/components/ui/background-beams"

const jobs = [
  {
    id: 1,
    title: "Senior React Developer",
    client: "TechCorp Inc.",
    budget: "$5000-$10000",
    description: "Looking for an experienced React developer to build a modern web application...",
    skills: ["React", "TypeScript", "Node.js"],
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "UI/UX Designer",
    client: "Design Studio",
    budget: "$3000-$5000",
    description: "Need a creative UI/UX designer for a mobile app redesign project...",
    skills: ["Figma", "UI/UX", "Mobile Design"],
    posted: "1 day ago"
  },
  {
    id: 3,
    title: "Content Writer",
    client: "Marketing Agency",
    budget: "$1000-$2000",
    description: "Seeking a skilled content writer for blog posts and social media content...",
    skills: ["Content Writing", "SEO", "Social Media"],
    posted: "3 days ago"
  }
]

export default function FindWorkPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const allSkills = Array.from(new Set(jobs.flatMap(job => job.skills)))

  return (
    <main className="min-h-screen bg-black relative">
      <BackgroundBeams className="absolute inset-0 z-0" />
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <NeonText size="3xl" color="cyan" gradient className="mb-4">
              Find Your Next Opportunity
            </NeonText>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Browse through available jobs and find the perfect match for your skills.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <GlassCard className="p-6">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  Filters
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-300 mb-2">Search</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500"
                      placeholder="Search jobs..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Skills</label>
                    <div className="space-y-2">
                      {allSkills.map((skill) => (
                        <label key={skill} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedSkills.includes(skill)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedSkills([...selectedSkills, skill])
                              } else {
                                setSelectedSkills(selectedSkills.filter(s => s !== skill))
                              }
                            }}
                            className="form-checkbox h-4 w-4 text-cyan-500"
                          />
                          <span className="text-gray-300">{skill}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="lg:col-span-3">
              <div className="space-y-6">
                {jobs.map((job) => (
                  <GlassCard key={job.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                        <p className="text-gray-400">{job.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-500 font-semibold">{job.budget}</p>
                        <p className="text-gray-400 text-sm">{job.posted}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-4">{job.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                    <AnimatedButton
                      variant="primary"
                      className="w-full"
                    >
                      Apply Now
                    </AnimatedButton>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 