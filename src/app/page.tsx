"use client"

import { Hero } from "@/components/sections/hero"
import { FeaturedCategories } from "@/components/sections/featured-categories"
import { Testimonials } from "@/components/sections/testimonials"
import { BackgroundBeams } from "@/components/ui/background-beams"

export default function HomePage() {
  return (
    <main className="bg-black relative">
      <BackgroundBeams className="absolute inset-0 z-0" />
      <div className="relative z-10">
        <Hero />
        <FeaturedCategories />
        <Testimonials />
      </div>
    </main>
  )
} 