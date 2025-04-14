"use client"

import { motion } from "framer-motion"
import { NeonText } from "@/components/ui/neon-text"
import { GlassCard } from "@/components/ui/glass-card"
import { BackgroundBeams } from "@/components/ui/background-beams"

const steps = [
  {
    title: "Create Your Profile",
    description: "Sign up as a client or freelancer and complete your profile to get started.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    color: "cyan",
  },
  {
    title: "Post or Browse Jobs",
    description: "Clients can post detailed job requirements, while freelancers can browse and apply to opportunities.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    color: "magenta",
  },
  {
    title: "Connect & Collaborate",
    description: "Use our secure messaging and file sharing to communicate and collaborate effectively.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    color: "gold",
  },
  {
    title: "Secure Payments",
    description: "Our escrow system ensures secure payments for both clients and freelancers.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    ),
    color: "cyan",
  },
]

export default function HowItWorksPage() {
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
              How AssuredGig Works
            </NeonText>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              A simple four-step process to connect with the perfect freelancer or client.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <GlassCard
                  glowColor={step.color as "cyan" | "magenta" | "gold"}
                  className="p-6 h-full"
                >
                  <div className={`text-${step.color}-400 mb-4`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-400">
                    {step.description}
                  </p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
} 