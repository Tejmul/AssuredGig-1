import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Cal.com API integration
const CAL_API_KEY = process.env.CAL_API_KEY;
const CAL_API_URL = "https://api.cal.com/v1";

// Validation schema
const meetingSchema = z.object({
  title: z.string().min(1, "Title cannot be empty"),
  description: z.string().optional(),
  startTime: z.string().datetime(),
  endTime: z.string().datetime(),
  timeZone: z.string().default("UTC"),
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
        freelancer: true,
        client: true,
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
    const data = meetingSchema.parse(body);
    
    // Create meeting in Cal.com
    const response = await fetch(`${CAL_API_URL}/scheduling/availability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${CAL_API_KEY}`,
      },
      body: JSON.stringify({
        eventTypeId: process.env.CAL_EVENT_TYPE_ID,
        start: data.startTime,
        end: data.endTime,
        timeZone: data.timeZone,
        title: data.title,
        description: data.description,
        attendees: [
          {
            email: contract.client.email,
            name: contract.client.name,
          },
          {
            email: contract.freelancer.email,
            name: contract.freelancer.name,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Cal.com API error:", error);
      return NextResponse.json(
        { error: "Failed to schedule meeting" },
        { status: 500 }
      );
    }
    
    const meeting = await response.json();
    
    // Store meeting details in the database
    // Note: You might want to add a Meeting model to your schema
    // For now, we'll just return the Cal.com response
    
    return NextResponse.json(meeting, { status: 201 });
  } catch (error) {
    console.error("Error scheduling meeting:", error);
    
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
        freelancer: true,
        client: true,
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
    
    // Get meetings from Cal.com
    const response = await fetch(`${CAL_API_URL}/scheduling/availability?eventTypeId=${process.env.CAL_EVENT_TYPE_ID}`, {
      headers: {
        Authorization: `Bearer ${CAL_API_KEY}`,
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error("Cal.com API error:", error);
      return NextResponse.json(
        { error: "Failed to fetch meetings" },
        { status: 500 }
      );
    }
    
    const meetings = await response.json();
    
    return NextResponse.json(meetings);
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 