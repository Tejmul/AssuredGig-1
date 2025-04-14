"use client";
import { useEffect, useRef } from "react";

interface ParticleBackgroundProps {
  className?: string;
  particleSize?: number;
  particleCount?: number;
  particleSpeed?: number;
  particleColor?: string;
}

let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D | null;
let particles: Particle[] = [];
let particleSize = 2;
let particleCount = 100;
let particleSpeed = 1;
let particleColor = "#ffffff";
let animationFrameId: number;

class Particle {
  x: number = 0;
  y: number = 0;
  size: number = 0;
  speedX: number = 0;
  speedY: number = 0;

  constructor() {
    if (!canvas) return;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * particleSize;
    this.speedX = Math.random() * particleSpeed - particleSpeed / 2;
    this.speedY = Math.random() * particleSpeed - particleSpeed / 2;
  }

  update() {
    if (!canvas) return;
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x > canvas.width) {
      this.x = 0;
    } else if (this.x < 0) {
      this.x = canvas.width;
    }

    if (this.y > canvas.height) {
      this.y = 0;
    } else if (this.y < 0) {
      this.y = canvas.height;
    }
  }

  draw() {
    if (!ctx) return;
    ctx.fillStyle = particleColor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function createParticles() {
  particles = [];
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

function animate() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  animationFrameId = requestAnimationFrame(animate);
}

export const ParticleBackground = ({
  className = "",
  particleSize: size = 2,
  particleCount: count = 100,
  particleSpeed: speed = 1,
  particleColor: color = "#ffffff",
}: ParticleBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    canvas = canvasRef.current;
    ctx = canvas.getContext("2d");

    if (!ctx) return;

    particleSize = size;
    particleCount = count;
    particleSpeed = speed;
    particleColor = color;

    const resizeCanvas = () => {
      if (!canvas || !ctx) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    createParticles();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [size, count, speed, color]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ position: "fixed", top: 0, left: 0, pointerEvents: "none" }}
    />
  );
}; 