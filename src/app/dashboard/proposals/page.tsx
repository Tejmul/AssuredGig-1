import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { AnimatedElement } from "@/components/ui/animated-element"

export default async function ProposalsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id
  const isClient = session.user.role === "CLIENT"

  // Fetch proposals based on user role
  const proposals = await prisma.proposal.findMany({
    where: isClient
      ? { job: { clientId: userId } }
      : { freelancerId: userId },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          budget: true,
          client: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
      freelancer: {
        select: {
          id: true,
          name: true,
          skills: true,
          rate: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <AnimatedElement>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">
            {isClient ? "Received Proposals" : "My Proposals"}
          </h1>
        </div>
      </AnimatedElement>

      <div className="grid gap-6">
        {proposals.map((proposal, index) => (
          <AnimatedElement key={proposal.id} delay={index}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">
                      <Link
                        href={`/dashboard/jobs/${proposal.job.id}`}
                        className="hover:underline"
                      >
                        {proposal.job.title}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {isClient
                        ? `From ${proposal.freelancer.name}`
                        : `For ${proposal.job.client.name}'s job`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
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
                    {proposal.status === "REJECTED" && proposal.feedback && (
                      <Badge variant="outline">
                        With Feedback
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">Bid Amount:</span>{" "}
                      ${proposal.bidAmount}
                    </div>
                    <div>
                      <span className="font-medium">Job Budget:</span>{" "}
                      ${proposal.job.budget}
                    </div>
                    <div>
                      <span className="font-medium">Submitted:</span>{" "}
                      {formatDistanceToNow(new Date(proposal.createdAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <p className="text-sm line-clamp-3">{proposal.coverLetter}</p>
                  </div>

                  {!isClient && proposal.status === "PENDING" && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link href={`/dashboard/proposals/${proposal.id}/edit`}>
                          Edit Proposal
                        </Link>
                      </Button>
                      <Button
                        variant="destructive"
                        asChild
                      >
                        <Link href={`/dashboard/proposals/${proposal.id}/delete`}>
                          Delete Proposal
                        </Link>
                      </Button>
                    </div>
                  )}

                  {isClient && proposal.status === "PENDING" && (
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link href={`/dashboard/proposals/${proposal.id}/reject`}>
                          Reject
                        </Link>
                      </Button>
                      <Button
                        variant="default"
                        asChild
                      >
                        <Link href={`/dashboard/proposals/${proposal.id}/accept`}>
                          Accept
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>
        ))}

        {proposals.length === 0 && (
          <AnimatedElement>
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <p className="text-lg text-muted-foreground">
                    {isClient
                      ? "You haven't received any proposals yet."
                      : "You haven't submitted any proposals yet."}
                  </p>
                  {!isClient && (
                    <Button asChild className="mt-4">
                      <Link href="/dashboard/jobs">Browse Jobs</Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </AnimatedElement>
        )}
      </div>
    </div>
  )
} 