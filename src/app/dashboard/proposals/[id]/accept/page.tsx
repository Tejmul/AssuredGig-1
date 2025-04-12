import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AnimatedElement } from "@/components/ui/animated-element"

interface AcceptProposalPageProps {
  params: {
    id: string
  }
}

export default async function AcceptProposalPage({ params }: AcceptProposalPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "CLIENT") {
    redirect("/dashboard/proposals")
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          clientId: true,
          status: true,
        },
      },
      freelancer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })

  if (!proposal) {
    notFound()
  }

  // Check if user owns this job
  if (proposal.job.clientId !== session.user.id) {
    redirect("/dashboard/proposals")
  }

  // Check if proposal can be accepted
  if (proposal.status !== "PENDING") {
    redirect(`/dashboard/proposals/${params.id}`)
  }

  // Check if job is still open
  if (proposal.job.status !== "OPEN") {
    redirect(`/dashboard/proposals/${params.id}`)
  }

  return (
    <div className="space-y-6">
      <AnimatedElement>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Accept Proposal</h1>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/proposals/${params.id}`}>Cancel</Link>
          </Button>
        </div>
      </AnimatedElement>

      <AnimatedElement delay={1}>
        <Card>
          <CardHeader>
            <CardTitle>Confirm Proposal Acceptance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <p>
                You are about to accept the proposal from{" "}
                <strong>{proposal.freelancer.name}</strong> for the job{" "}
                <strong>{proposal.job.title}</strong>.
              </p>
              <p>
                By accepting this proposal, you agree to hire the freelancer for the
                specified bid amount. A contract will be created automatically, and
                the job status will be updated to "In Progress".
              </p>
            </div>

            <form action={`/api/proposals/${params.id}`} method="PATCH" className="space-y-4">
              <input type="hidden" name="status" value="ACCEPTED" />
              
              <div className="flex justify-end space-x-2">
                <Button type="submit">Accept Proposal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AnimatedElement>
    </div>
  )
} 