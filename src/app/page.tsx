"use client"

import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { FeaturedCategories } from "@/components/sections/featured-categories"
import { Testimonials } from "@/components/sections/testimonials"

export default function HomePage() {
  return (
    <main className="bg-black">
      <Hero />
      <HowItWorks />
      <FeaturedCategories />
      <Testimonials />
    </main>
  )
} 