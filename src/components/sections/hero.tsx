"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { NeonText } from "@/components/ui/neon-text"
import { GlassCard } from "@/components/ui/glass-card"
import Link from "next/link"

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

// Particle component for the background
const Particle = ({ delay, duration, size, x, y }: { 
  delay: number, 
  duration: number, 
  size: number, 
  x: number, 
  y: number 
}) => {
  return (
    <motion.div
      className="absolute rounded-full bg-cyan-500/10"
      style={{ width: size, height: size }}
      initial={{ opacity: 0, x, y }}
      animate={{ 
        opacity: [0, 0.5, 0],
        x: [x, x + 20, x],
        y: [y, y - 20, y],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  )
}

// Generate random particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 5 + Math.random() * 10,
    size: 2 + Math.random() * 4,
    x: Math.random() * 100,
    y: Math.random() * 100,
  }))
}

const particles = generateParticles(50)

export function Hero() {
  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient with noise texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black" />
      <div className="absolute inset-0 bg-[url('/noise.svg')] opacity-5" />
      
      {/* Animated particle grid */}
      <div className="absolute inset-0">
        <svg className="w-full h-full opacity-30" viewBox="0 0 100 100">
          <pattern
            id="grid"
            width="4"
            height="4"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="2" cy="2" r="0.5" fill="currentColor" className="text-cyan-500/20" />
          </pattern>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <Particle
            key={particle.id}
            delay={particle.delay}
            duration={particle.duration}
            size={particle.size}
            x={`${particle.x}%`}
            y={`${particle.y}%`}
          />
        ))}
      </div>

      {/* Content with parallax effect */}
      <motion.div 
        className="relative container mx-auto px-4 pt-32 pb-20"
        style={{ y, opacity }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <NeonText
              size="3xl"
              color="cyan"
              gradient
              pulse
              className="font-bold mb-6 sm:text-5xl md:text-6xl lg:text-7xl"
            >
              Talent Assured.
              <br />
              Success Guaranteed.
            </NeonText>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto"
          >
            Connect with top freelancers, deliver exceptional projects, and grow your business with our premium freelancing platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button size="lg" variant="default" glow="cyan" asChild className="relative overflow-hidden group">
              <Link href="/signup?role=client">
                <span className="relative z-10">Find Talent</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                />
              </Link>
            </Button>
            <Button size="lg" variant="glass" glow="magenta" asChild className="relative overflow-hidden group">
              <Link href="/signup?role=freelancer">
                <span className="relative z-10">Find Work</span>
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-magenta-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  whileHover={{ scale: 1.05 }}
                />
              </Link>
            </Button>
          </motion.div>

          {/* Stats with counting animation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <GlassCard
                  glowColor={stat.color as "cyan" | "magenta" | "gold"}
                  className="py-6 px-4"
                  gradient
                  noise
                  animated
                >
                  <div className="flex items-center justify-center mb-2">
                    <div className={`text-${stat.color}-400 mr-2`}>
                      {stat.icon}
                    </div>
                    <NeonText
                      size="2xl"
                      color={stat.color as "cyan" | "magenta" | "gold"}
                      gradient
                      className="font-bold"
                    >
                      {stat.value}
                    </NeonText>
                  </div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Decorative elements with enhanced glow */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute top-1/4 -left-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-1/4 -right-20 w-60 h-60 bg-magenta-500/20 rounded-full blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.15, 0.05] }}
          transition={{ duration: 7, repeat: Infinity, delay: 2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl"
        />
      </div>
    </div>
  )
} 