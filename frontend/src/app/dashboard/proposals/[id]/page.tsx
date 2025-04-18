import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth.config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"
import { AnimatedElement } from "@/components/ui/animated-element"

interface ProposalPageProps {
  params: {
    id: string
  }
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id
  const isClient = session.user.role === "CLIENT"

  const proposal = await prisma.proposal.findUnique({
    where: { id: params.id },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          description: true,
          budget: true,
          deadline: true,
          skills: true,
          client: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      freelancer: {
        select: {
          id: true,
          name: true,
          email: true,
          skills: true,
          rate: true,
          portfolio: true,
        },
      },
    },
  })

  if (!proposal) {
    notFound()
  }

  // Check if user has access to this proposal
  if (
    (isClient && proposal.job.client.id !== userId) ||
    (!isClient && proposal.freelancer.id !== userId)
  ) {
    redirect("/dashboard/proposals")
  }

  return (
    <div className="space-y-6">
      <AnimatedElement>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Proposal Details</h1>
          <Button variant="outline" asChild>
            <Link href="/dashboard/proposals">Back to Proposals</Link>
          </Button>
        </div>
      </AnimatedElement>

      <div className="grid gap-6 md:grid-cols-2">
        <AnimatedElement delay={1}>
          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Title</h3>
                <p>{proposal.job.title}</p>
              </div>
              <div>
                <h3 className="font-medium">Description</h3>
                <p className="text-sm">{proposal.job.description}</p>
              </div>
              <div>
                <h3 className="font-medium">Budget</h3>
                <p>${proposal.job.budget}</p>
              </div>
              <div className="mt-6">
                <h3 className="font-medium">Required Skills</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {Array.isArray(proposal.job.skills) && (proposal.job.skills as string[]).map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium">Posted by</h3>
                <p>{proposal.job.client.name}</p>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>

        <AnimatedElement delay={2}>
          <Card>
            <CardHeader>
              <CardTitle>Proposal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Status</h3>
                <Badge
                  variant={
                    proposal.status === "ACCEPTED"
                      ? "success"
                      : proposal.status === "REJECTED"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {proposal.status}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">Bid Amount</h3>
                <p>${proposal.bidAmount}</p>
              </div>
              <div>
                <h3 className="font-medium">Cover Letter</h3>
                <p className="text-sm whitespace-pre-wrap">{proposal.coverLetter}</p>
              </div>
              {proposal.status === "REJECTED" && proposal.feedback && (
                <div>
                  <h3 className="font-medium">Feedback</h3>
                  <p className="text-sm whitespace-pre-wrap">{proposal.feedback}</p>
                </div>
              )}
              <div>
                <h3 className="font-medium">Submitted</h3>
                <p>
                  {formatDistanceToNow(new Date(proposal.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </AnimatedElement>

        <AnimatedElement delay={3} className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {isClient ? "Freelancer Information" : "Client Information"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">Name</h3>
                <p>{isClient ? proposal.freelancer.name : proposal.job.client.name}</p>
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p>{isClient ? proposal.freelancer.email : proposal.job.client.email}</p>
              </div>
              {isClient && (
                <>
                  <div>
                    <h3 className="font-medium">Hourly Rate</h3>
                    <p>${proposal.freelancer.rate}/hour</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Skills</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {Array.isArray(proposal.freelancer.skills) && (proposal.freelancer.skills as string[]).map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {proposal.freelancer.portfolio && (
                    <div>
                      <h3 className="font-medium">Portfolio</h3>
                      <p className="text-sm">{typeof proposal.freelancer.portfolio === 'string' ? proposal.freelancer.portfolio : ''}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </AnimatedElement>
      </div>

      {proposal.status === "PENDING" && (
        <AnimatedElement delay={4}>
          <div className="flex justify-end space-x-2">
            {!isClient && (
              <>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/proposals/${proposal.id}/edit`}>
                    Edit Proposal
                  </Link>
                </Button>
                <Button variant="destructive" asChild>
                  <Link href={`/dashboard/proposals/${proposal.id}/delete`}>
                    Delete Proposal
                  </Link>
                </Button>
              </>
            )}
            {isClient && (
              <>
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/proposals/${proposal.id}/reject`}>
                    Reject Proposal
                  </Link>
                </Button>
                <Button variant="default" asChild>
                  <Link href={`/dashboard/proposals/${proposal.id}/accept`}>
                    Accept Proposal
                  </Link>
                </Button>
              </>
            )}
          </div>
        </AnimatedElement>
      )}
    </div>
  )
} 