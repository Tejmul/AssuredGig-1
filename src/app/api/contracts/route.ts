import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth.config"
import { z } from "zod"
import { ContractStatus, ProposalStatus } from "@prisma/client"
import type { Session } from "next-auth"

// Validation schemas
const contractSchema = z.object({
  proposalId: z.string(),
  milestones: z.array(
    z.object({
      description: z.string().min(3, "Description must be at least 3 characters"),
      amount: z.number().min(1, "Amount must be at least 1"),
    })
  ).optional(),
})

const querySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  status: z.enum(["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
})

// Validation schema for creating a contract
const createContractSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().min(1, "Description cannot be empty"),
  budget: z.number().positive("Budget must be positive"),
  deadline: z.string().datetime(),
  freelancerId: z.string(),
})

// Error handling utility
const handleApiError = (error: unknown) => {
  console.error("[API_ERROR]", error);
  
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: error.errors[0].message },
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
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    
    // Build filter conditions
    const where: any = {
      OR: [
        { clientId: session.user.id },
        { freelancerId: session.user.id },
      ],
    };
    
    if (status && status !== "all") {
      where.status = status;
    }
    
    if (search) {
      where.OR.push(
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } }
      );
    }
    
    // Fetch contracts
    const contracts = await db.contract.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(contracts);
  } catch (error) {
    console.error("Error fetching contracts:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    
    const body = await request.json();
    const data = createContractSchema.parse(body);
    
    // Create contract
    const contract = await db.contract.create({
      data: {
        title: data.title,
        description: data.description,
        budget: data.budget,
        deadline: data.deadline,
        status: "PENDING",
        clientId: session.user.id,
        freelancerId: data.freelancerId,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    
    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error("Error creating contract:", error);
    
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
  }
} 