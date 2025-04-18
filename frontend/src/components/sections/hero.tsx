"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { LampContainer } from "@/components/ui/lamp"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

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
          <div className="mt-8 flex gap-4 justify-center">
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