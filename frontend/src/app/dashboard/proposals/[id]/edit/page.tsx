import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth.config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AnimatedElement } from "@/components/ui/animated-element"

interface EditProposalPageProps {
  params: {
    id: string
  }
}

export default async function EditProposalPage({ params }: EditProposalPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "FREELANCER") {
    redirect("/dashboard/proposals")
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          budget: true,
        },
      },
    },
  })

  if (!proposal) {
    notFound()
  }

  // Check if user owns this proposal
  if (proposal.freelancerId !== session.user.id) {
    redirect("/dashboard/proposals")
  }

  // Check if proposal can be edited
  if (proposal.status !== "PENDING") {
    redirect(`/dashboard/proposals/${params.id}`)
  }

  return (
    <div className="space-y-6">
      <AnimatedElement>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Edit Proposal</h1>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/proposals/${params.id}`}>Cancel</Link>
          </Button>
        </div>
      </AnimatedElement>

      <AnimatedElement delay={1}>
        <Card>
          <CardHeader>
            <CardTitle>Proposal for {proposal.job.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={`/api/proposals/${params.id}`} method="PATCH" className="space-y-4">
              <div>
                <label htmlFor="bidAmount" className="block text-sm font-medium mb-1">
                  Bid Amount ($)
                </label>
                <Input
                  type="number"
                  id="bidAmount"
                  name="bidAmount"
                  defaultValue={proposal.bidAmount}
                  min={1}
                  max={proposal.job.budget}
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Job budget: ${proposal.job.budget}
                </p>
              </div>

              <div>
                <label htmlFor="coverLetter" className="block text-sm font-medium mb-1">
                  Cover Letter
                </label>
                <Textarea
                  id="coverLetter"
                  name="coverLetter"
                  defaultValue={proposal.coverLetter}
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="submit">Update Proposal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AnimatedElement>
    </div>
  )
} 