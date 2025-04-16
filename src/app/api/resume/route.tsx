import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { Session } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { db } from "@/lib/db";
import { z } from "zod";
import { Role } from "@prisma/client";

interface Session {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    role: Role;
    isTwoFactorEnabled: boolean;
    isOAuth: boolean;
  };
}

// Schema for resume data validation
const resumeSchema = z.object({
  personalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Professional title is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url("Invalid website URL").optional(),
  }),
  summary: z.string().min(10, "Summary must be at least 10 characters"),
  experience: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, "Job title is required"),
      content: z.string().min(1, "Job description is required"),
    })
  ),
  education: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, "Education title is required"),
      content: z.string().min(1, "Education details are required"),
    })
  ),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  certifications: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, "Certification title is required"),
      content: z.string().min(1, "Certification details are required"),
    })
  ).optional(),
});

// GET handler to retrieve a user's resume
export async function GET() {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's resume from the database
    const resume = await db.resume.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!resume) {
      return NextResponse.json(
        { error: "Resume not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("[RESUME_GET]", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}

// POST handler to create or update a user's resume
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions) as Session | null;
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (session.user.role !== "FREELANCER") {
      return NextResponse.json(
        { error: "Only freelancers can create resumes" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Validate the resume data
    const validatedData = resumeSchema.parse(body);
    
    // Check if the user already has a resume
    const existingResume = await db.resume.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (existingResume) {
      // Update the existing resume
      const updatedResume = await db.resume.update({
        where: {
          userId: session.user.id,
        },
        data: validatedData,
      });

      return NextResponse.json(updatedResume);
    }

    // Create a new resume
    const newResume = await db.resume.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(newResume);
  } catch (error) {
    console.error("[RESUME_POST]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
} 