"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { NeonText } from "@/components/ui/neon-text"
import { GlassCard } from "@/components/ui/glass-card"
import { AnimatedButton } from "@/components/ui/animated-button"

const categories = [
  "Web Development",
  "Mobile Development",
  "UI/UX Design",
  "Content Writing",
  "Digital Marketing",
  "Data Science",
  "Video & Animation",
  "Business Consulting",
]

export default function HirePage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <NeonText size="3xl" color="cyan" gradient className="mb-4">
            Hire Top Talent
          </NeonText>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Find the perfect freelancer for your project from our pool of skilled professionals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Post a Job
              </h2>
              <form className="space-y-6">
                <div>
                  <label className="block text-gray-300 mb-2">Job Title</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    placeholder="e.g., Senior React Developer"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500 h-32"
                    placeholder="Describe your project requirements..."
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-2">Budget</label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:border-cyan-500"
                    placeholder="Enter your budget"
                  />
                </div>
                <AnimatedButton
                  variant="primary"
                  className="w-full"
                >
                  Post Job
                </AnimatedButton>
              </form>
            </GlassCard>
          </div>

          <div>
            <GlassCard className="p-6">
              <h2 className="text-2xl font-semibold text-white mb-6">
                Browse by Category
              </h2>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? "bg-cyan-500 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
} 