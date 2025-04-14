"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

import { LampContainer } from "@/components/ui/lamp"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

const stats = [
  { 
    label: "Active Freelancers", 
    value: "2,500+", 
    color: "cyan",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    )
  },
  { 
    label: "Project Completion Rate", 
    value: "98%", 
    color: "magenta",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    )
  },
  { 
    label: "Secured in Escrow", 
    value: "$5M+", 
    color: "gold",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
        <line x1="1" y1="10" x2="23" y2="10"></line>
      </svg>
    )
  },
]

export function Hero() {
  return (
    <div className="h-screen w-full bg-black relative flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full absolute top-24">
        <LampContainer>
          <h1 className="mt-8 bg-opacity-50 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-center text-4xl font-bold tracking-tight text-transparent md:text-5xl">
            Find Your Next Gig
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-center text-lg text-slate-300">
            Connect with top companies and secure your next opportunity.
          </p>
          <div className="mt-8 flex gap-4">
            <Button>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline">Learn More</Button>
          </div>
        </LampContainer>
      </div>
    </div>
  )
} 