"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { GlassCard } from "@/components/ui/glass-card"
import { NeonText } from "@/components/ui/neon-text"

const testimonials = [
  {
    name: "Alex Johnson",
    role: "CEO, TechStart Inc.",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    quote: "AssuredGig has transformed how we hire freelancers. The quality of talent and the platform's security features give us complete confidence.",
    color: "cyan",
  },
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "https://i.pravatar.cc/150?img=5",
    rating: 5,
    quote: "I've found my best clients on AssuredGig. The escrow system ensures I get paid on time, and the platform's premium feel attracts quality clients.",
    color: "magenta",
  },
  {
    name: "Michael Rodriguez",
    role: "Marketing Director, GrowthCo",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    quote: "The freelancers we've hired through AssuredGig have consistently delivered exceptional work. The platform's premium experience matches our brand.",
    color: "gold",
  },
]

const StarRating = ({ rating, color }: { rating: number; color: "cyan" | "magenta" | "gold" }) => {
  const colorClasses = {
    cyan: "text-cyan-400",
    magenta: "text-magenta-400",
    gold: "text-amber-400",
  }

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <motion.svg
          key={i}
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill={i < rating ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={colorClasses[color]}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </motion.svg>
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-black" />
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <NeonText size="2xl" color="cyan" gradient pulse className="mb-4">
              Client Testimonials
            </NeonText>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Hear from our satisfied clients and freelancers about their experience with AssuredGig.
            </p>
          </motion.div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.name} variants={itemVariants}>
              <GlassCard
                glowColor={testimonial.color as "cyan" | "magenta" | "gold"}
                className="p-6 h-full flex flex-col"
                gradient
                noise
                animated
              >
                <div className="flex items-center mb-4">
                  <div className="relative mr-4">
                    <div className={`w-12 h-12 rounded-full overflow-hidden border-2 border-${testimonial.color}-500/30`}>
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-${testimonial.color}-500 border-2 border-black`} />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{testimonial.name}</h3>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} color={testimonial.color as "cyan" | "magenta" | "gold"} />
                </div>
                
                <blockquote className="text-gray-300 italic flex-grow">
                  "{testimonial.quote}"
                </blockquote>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <NeonText
                    size="sm"
                    color={testimonial.color as "cyan" | "magenta" | "gold"}
                    className="text-right"
                  >
                    Verified Client
                  </NeonText>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
} 