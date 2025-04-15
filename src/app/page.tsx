"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Users, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section with Gradient Background */}
      <section className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-black via-background to-background">
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 -translate-x-1/2 top-1/3 w-[40rem] h-[40rem] bg-primary/20 rounded-full filter blur-[100px] opacity-50 animate-pulse" />
          <div className="absolute -right-4 bottom-1/4 w-72 h-72 bg-secondary/20 rounded-full filter blur-[80px] opacity-40 animate-pulse delay-1000" />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/70">
              The Future of
              <br />
              <span className="text-primary relative z-10">Freelancing</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Connect with top talent and opportunities in our premium freelance marketplace
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
          >
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Browse Jobs
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="animate-bounce"
          >
            <ChevronDown className="w-8 h-8 mx-auto text-muted-foreground" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid with Hover Effects */}
      <section className="py-32 bg-gradient-to-b from-background to-background/95">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Why Choose AssuredGig</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our premium features and secure platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Secure Payments",
                description: "Your payments are protected until you're completely satisfied with the work"
              },
              {
                icon: Clock,
                title: "Fast Delivery",
                description: "Get your projects completed on time with our efficient freelancers"
              },
              {
                icon: Users,
                title: "Elite Talent",
                description: "Access a curated pool of top-tier freelance professionals"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <div className="group relative p-8 rounded-2xl bg-black/40 border border-white/10 hover:border-primary/50 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                  <feature.icon className="h-12 w-12 text-primary mb-6" />
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Gradient */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/10 to-background" />
        
        {/* Large Branded Text - Positioned as background */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
        >
          <div className="w-full overflow-hidden">
            <h1 className="text-[8rem] md:text-[15rem] font-bold tracking-tighter text-white/10 select-none text-center whitespace-nowrap"
                style={{ letterSpacing: '-0.05em' }}>
              ASSUREDGIG
            </h1>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold mb-8">
              Ready to Get Started?
            </h2>
            <p className="text-xl md:text-2xl mb-12 text-muted-foreground">
              Join thousands of freelancers and clients who are already using AssuredGig to get work done.
            </p>
            <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90">
              Create an Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 