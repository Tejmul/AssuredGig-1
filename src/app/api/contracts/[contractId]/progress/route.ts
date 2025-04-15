import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const milestoneSchema = z.object({
  description: z.string().min(1, "Description cannot be empty"),
  amount: z.number().min(1, "Amount must be at least 1"),
});

// Validation schema for milestone status update
const updateMilestoneSchema = z.object({
  milestoneId: z.string(),
  status: z.enum(["PENDING", "COMPLETED"]),
});

export async function POST(
  request: Request,
  { params }: { params: { contractId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { contractId } = params;
    
    // Check if contract exists and user is part of it
    const contract = await db.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: true,
      },
    });
    
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }
    
    if (contract.freelancerId !== session.user.id && contract.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const data = z.object({
      description: z.string().min(1, "Description cannot be empty"),
      amount: z.number().positive("Amount must be positive"),
    }).parse(body);
    
    // Create new milestone
    const milestone = await db.milestone.create({
      data: {
        description: data.description,
        amount: data.amount,
        status: "PENDING",
        contractId,
      },
    });
    
    return NextResponse.json(milestone, { status: 201 });
  } catch (error) {
    console.error("Error creating milestone:", error);
    
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

export async function GET(
  request: Request,
  { params }: { params: { contractId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { contractId } = params;
    
    // Check if contract exists and user is part of it
    const contract = await db.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }
    
    if (contract.freelancerId !== session.user.id && contract.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Calculate overall progress
    const totalMilestones = contract.milestones.length;
    const completedMilestones = contract.milestones.filter(
      (milestone) => milestone.status === "COMPLETED"
    ).length;
    
    const progress = totalMilestones > 0 
      ? (completedMilestones / totalMilestones) * 100 
      : 0;
    
    return NextResponse.json({
      milestones: contract.milestones,
      progress,
    });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { contractId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const { contractId } = params;
    
    // Check if contract exists and user is part of it
    const contract = await db.contract.findUnique({
      where: { id: contractId },
      include: {
        milestones: true,
      },
    });
    
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }
    
    if (contract.freelancerId !== session.user.id && contract.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    const data = updateMilestoneSchema.parse(body);
    
    // Check if milestone exists and belongs to the contract
    const milestone = await db.milestone.findFirst({
      where: {
        id: data.milestoneId,
        contractId,
      },
    });
    
    if (!milestone) {
      return NextResponse.json(
        { error: "Milestone not found" },
        { status: 404 }
      );
    }
    
    // Update milestone status
    const updatedMilestone = await db.milestone.update({
      where: {
        id: data.milestoneId,
      },
      data: {
        status: data.status,
      },
    });
    
    return NextResponse.json(updatedMilestone);
  } catch (error) {
    console.error("Error updating milestone:", error);
    
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