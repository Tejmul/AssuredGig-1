"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

interface SparklesCoreProps {
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  particleCount?: number;
  particleColor?: string;
  particleSpeed?: number;
}

export const SparklesCore = ({
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1,
  particleCount = 50,
  particleColor = "#FFF",
  particleSpeed = 1,
}: SparklesCoreProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref);
  const controls = useAnimation();
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * (maxSize - minSize) + minSize,
        duration: Math.random() * 2 + 1,
      }));
      setParticles(newParticles);
    }
  }, [isInView, controls, particleCount, minSize, maxSize]);

  return (
    <div
      ref={ref}
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{ background }}
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0"
      >
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: [
                `${particle.x}%`,
                `${particle.x + (Math.random() - 0.5) * 20}%`,
                `${particle.x}%`,
              ],
              y: [
                `${particle.y}%`,
                `${particle.y + (Math.random() - 0.5) * 20}%`,
                `${particle.y}%`,
              ],
            }}
            transition={{
              duration: particle.duration * particleSpeed,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              background: particleColor,
              boxShadow: `0 0 ${particle.size * 2}px ${particleColor}`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}; 