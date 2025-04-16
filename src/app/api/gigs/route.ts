import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

// Schema for gig creation
const createGigSchema = z.object({
  title: z.string().min(10).max(100),
  description: z.string().min(50),
  budget: z.number().min(5),
  timeline: z.string(),
  skills: z.array(z.string())
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = createGigSchema.parse(json);

    const gig = await db.gig.create({
      data: {
        title: body.title,
        description: body.description,
        budget: body.budget,
        timeline: body.timeline,
        skills: JSON.stringify(body.skills),
        clientId: session.user.id,
      },
    });

    // Notify relevant freelancers (implement notification system)
    // TODO: Add notification logic here

    return NextResponse.json(gig);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse("Invalid request data", { status: 422 });
    }

    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const skills = searchParams.get("skills")?.split(",") || [];
    const status = searchParams.get("status") || "OPEN";

    const gigs = await db.gig.findMany({
      where: {
        status: status as any,
        ...(skills.length > 0 && {
          skills: {
            contains: skills.join(",")
          }
        })
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            proposals: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(gigs);
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
} 