import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

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
    
    // Fetch contract with related data
    const contract = await db.contract.findUnique({
      where: { id: contractId },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
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
    
    // Check if user is part of the contract
    if (contract.clientId !== session.user.id && contract.freelancerId !== session.user.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    return NextResponse.json(contract);
  } catch (error) {
    console.error("Error fetching contract:", error);
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
    
    // Check if contract exists
    const contract = await db.contract.findUnique({
      where: { id: contractId },
    });
    
    if (!contract) {
      return NextResponse.json(
        { error: "Contract not found" },
        { status: 404 }
      );
    }
    
    // Only the client can update the contract
    if (contract.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the client can update the contract" },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Update contract
    const updatedContract = await db.contract.update({
      where: { id: contractId },
      data: {
        title: body.title,
        description: body.description,
        budget: body.budget,
        deadline: body.deadline,
        status: body.status,
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        freelancer: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    return NextResponse.json(updatedContract);
  } catch (error) {
    console.error("Error updating contract:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 