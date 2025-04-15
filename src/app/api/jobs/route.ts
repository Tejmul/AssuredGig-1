import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Validation schemas
const jobSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  budget: z.number().min(1, "Budget must be at least 1"),
  deadline: z.string().datetime().optional(),
  skills: z.array(z.string()).optional(),
  isPremium: z.boolean().optional(),
});

const querySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  minBudget: z.string().optional(),
  maxBudget: z.string().optional(),
  skills: z.string().optional(),
  isPremium: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

// Error handling utility
const handleApiError = (error: unknown) => {
  console.error("API Error:", error);
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: "Invalid request data", details: error.errors },
      { status: 400 }
    );
  }
  
  return NextResponse.json(
    { error: "Internal server error" },
    { status: 500 }
  );
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(searchParams));
    
    // Build filter conditions
    const where: any = {};
    
    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: "insensitive" } },
        { description: { contains: query.search, mode: "insensitive" } },
      ];
    }
    
    if (query.category) {
      where.category = query.category;
    }
    
    if (query.minBudget) {
      where.budget = { ...where.budget, gte: parseFloat(query.minBudget) };
    }
    
    if (query.maxBudget) {
      where.budget = { ...where.budget, lte: parseFloat(query.maxBudget) };
    }
    
    if (query.skills) {
      const skills = query.skills.split(",").map((skill) => skill.trim());
      // Since skills is stored as JSON, we need to use a raw query for this
      where.skills = {
        path: ["$"],
        array_contains: skills,
      };
    }
    
    if (query.isPremium) {
      where.isPremium = query.isPremium === "true";
    }
    
    // Pagination
    const page = parseInt(query.page || "1");
    const limit = parseInt(query.limit || "10");
    const skip = (page - 1) * limit;
    
    // Get jobs with pagination
    const [jobs, total] = await Promise.all([
      db.job.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      db.job.count({ where }),
    ]);
    
    return NextResponse.json({
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is a client
    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Only clients can post jobs" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const data = jobSchema.parse(body);
    
    // Create the job
    const job = await db.job.create({
      data: {
        ...data,
        clientId: session.user.id,
        skills: data.skills || [], // Ensure skills is always an array
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
} 