import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth.config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AnimatedElement } from "@/components/ui/animated-element"

interface RejectProposalPageProps {
  params: {
    id: string
  }
}

export default async function RejectProposalPage({ params }: RejectProposalPageProps) {
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

  // Check if proposal can be rejected
  if (proposal.status !== "PENDING") {
    redirect(`/dashboard/proposals/${params.id}`)
  }

  return (
    <div className="space-y-6">
      <AnimatedElement>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Reject Proposal</h1>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/proposals/${params.id}`}>Cancel</Link>
          </Button>
        </div>
      </AnimatedElement>

      <AnimatedElement delay={1}>
        <Card>
          <CardHeader>
            <CardTitle>Confirm Proposal Rejection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <p>
                You are about to reject the proposal from{" "}
                <strong>{proposal.freelancer.name}</strong> for the job{" "}
                <strong>{proposal.job.title}</strong>.
              </p>
              <p>
                Optionally, you can provide feedback to the freelancer about why their
                proposal was not selected. This feedback will be sent to the freelancer.
              </p>
            </div>

            <form action={`/api/proposals/${params.id}`} method="PATCH" className="space-y-4">
              <input type="hidden" name="status" value="REJECTED" />
              
              <div>
                <label htmlFor="feedback" className="block text-sm font-medium mb-1">
                  Feedback (Optional)
                </label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  rows={4}
                  placeholder="Provide feedback to the freelancer about why their proposal was not selected..."
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="submit" variant="destructive">Reject Proposal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AnimatedElement>
    </div>
  )
} 