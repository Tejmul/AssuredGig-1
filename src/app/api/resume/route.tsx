import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth.config";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

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
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get the user's resume from the database
    const resume = await prisma.resume.findUnique({
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
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

// POST handler to create or update a user's resume
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate the resume data
    const validatedData = resumeSchema.parse(body);
    
    // Check if the user already has a resume
    const existingResume = await prisma.resume.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    let resume;
    
    if (existingResume) {
      // Update the existing resume
      resume = await prisma.resume.update({
        where: {
          id: existingResume.id,
        },
        data: {
          personalInfo: validatedData.personalInfo,
          summary: validatedData.summary,
          experience: validatedData.experience,
          education: validatedData.education,
          skills: validatedData.skills,
          certifications: validatedData.certifications,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create a new resume
      resume = await prisma.resume.create({
        data: {
          userId: session.user.id,
          personalInfo: validatedData.personalInfo,
          summary: validatedData.summary,
          experience: validatedData.experience,
          education: validatedData.education,
          skills: validatedData.skills,
          certifications: validatedData.certifications,
        },
      });
    }

    return NextResponse.json(resume);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error saving resume:", error);
    return NextResponse.json(
      { error: "Failed to save resume" },
      { status: 500 }
    );
  }
} 