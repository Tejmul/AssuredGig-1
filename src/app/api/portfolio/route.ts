import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const portfolioSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string(),
    })
  ),
  education: z.array(
    z.object({
      degree: z.string(),
      institution: z.string(),
      startDate: z.string(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      url: z.string().url().optional(),
      technologies: z.array(z.string()),
    })
  ),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || user.role !== "FREELANCER") {
      return new NextResponse("Only freelancers can create portfolios", {
        status: 403,
      });
    }

    const body = await req.json();
    const validatedData = portfolioSchema.parse(body);

    const portfolio = await db.portfolio.create({
      data: {
        ...validatedData,
        userId: session.user.id,
      },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    console.error("[PORTFOLIO_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId && userId !== session.user.id) {
      // Public portfolio view
      const portfolio = await db.portfolio.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
        },
      });

      if (!portfolio) {
        return new NextResponse("Portfolio not found", { status: 404 });
      }

      return NextResponse.json(portfolio);
    }

    // User's own portfolio
    const portfolio = await db.portfolio.findUnique({
      where: { userId: session.user.id },
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    console.error("[PORTFOLIO_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validatedData = portfolioSchema.parse(body);

    const portfolio = await db.portfolio.update({
      where: { userId: session.user.id },
      data: validatedData,
    });

    return NextResponse.json(portfolio);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 });
    }
    console.error("[PORTFOLIO_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 