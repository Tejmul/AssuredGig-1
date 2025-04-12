import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AnimatedElement } from "@/components/ui/animated-element"

interface DeleteProposalPageProps {
  params: {
    id: string
  }
}

export default async function DeleteProposalPage({ params }: DeleteProposalPageProps) {
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

  // Check if proposal can be deleted
  if (proposal.status !== "PENDING") {
    redirect(`/dashboard/proposals/${params.id}`)
  }

  return (
    <div className="space-y-6">
      <AnimatedElement>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Delete Proposal</h1>
          <Button variant="outline" asChild>
            <Link href={`/dashboard/proposals/${params.id}`}>Cancel</Link>
          </Button>
        </div>
      </AnimatedElement>

      <AnimatedElement delay={1}>
        <Card>
          <CardHeader>
            <CardTitle>Confirm Proposal Deletion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="prose max-w-none">
              <p>
                You are about to delete your proposal for the job{" "}
                <strong>{proposal.job.title}</strong>.
              </p>
              <p>
                This action cannot be undone. Once deleted, you will need to submit a
                new proposal if you want to apply for this job again.
              </p>
            </div>

            <form action={`/api/proposals/${params.id}`} method="DELETE" className="space-y-4">
              <div className="flex justify-end space-x-2">
                <Button type="submit" variant="destructive">Delete Proposal</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </AnimatedElement>
    </div>
  )
} 