import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth.config"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Briefcase, 
  Users, 
  FileText, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight 
} from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  const userId = session.user.id
  const isClient = session.user.role === "CLIENT"

  // Fetch user-specific data
  const [
    jobsCount,
    proposalsCount,
    contractsCount,
    messagesCount,
    recentJobs,
    recentProposals,
    recentContracts
  ] = await Promise.all([
    // Count jobs (posted or applied)
    prisma.job.count({
      where: isClient 
        ? { clientId: userId } 
        : { proposals: { some: { freelancerId: userId } } }
    }),
    // Count proposals (sent or received)
    prisma.proposal.count({
      where: isClient 
        ? { job: { clientId: userId } } 
        : { freelancerId: userId }
    }),
    // Count contracts
    prisma.contract.count({
      where: isClient 
        ? { clientId: userId } 
        : { freelancerId: userId }
    }),
    // Count unread messages
    prisma.message.count({
      where: {
        contract: {
          OR: [
            { clientId: userId },
            { freelancerId: userId }
          ]
        },
        senderId: { not: userId }
      }
    }),
    // Recent jobs
    isClient 
      ? prisma.job.findMany({
          where: { clientId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            proposals: true
          }
        })
      : prisma.job.findMany({
          where: { proposals: { some: { freelancerId: userId } } },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            proposals: {
              where: { freelancerId: userId }
            }
          }
        }),
    // Recent proposals
    isClient
      ? prisma.proposal.findMany({
          where: { job: { clientId: userId } },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            freelancer: true,
            job: true
          }
        })
      : prisma.proposal.findMany({
          where: { freelancerId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: {
            job: true
          }
        }),
    // Recent contracts
    prisma.contract.findMany({
      where: isClient 
        ? { clientId: userId } 
        : { freelancerId: userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        job: true,
        freelancer: isClient ? true : false,
        client: isClient ? false : true
      }
    })
  ])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {isClient ? (
          <Button asChild>
            <Link href="/jobs/create">Post a Job</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard/jobs">Find Jobs</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isClient ? "Posted Jobs" : "Applied Jobs"}
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobsCount}</div>
            <p className="text-xs text-muted-foreground">
              {isClient ? "Total jobs posted" : "Total jobs applied"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {isClient ? "Received Proposals" : "Sent Proposals"}
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalsCount}</div>
            <p className="text-xs text-muted-foreground">
              {isClient ? "Total proposals received" : "Total proposals sent"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contractsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total active contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{messagesCount}</div>
            <p className="text-xs text-muted-foreground">
              Messages requiring attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent {isClient ? "Jobs" : "Applications"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {isClient 
                        ? `${job.proposals.length} proposals` 
                        : job.proposals[0]?.status || "Pending"}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/jobs/${job.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Contracts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContracts.map((contract) => (
                <div key={contract.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{contract.job.title}</p>
                    <p className="text-sm text-muted-foreground">
                      with {isClient ? contract.freelancer.name : contract.client.name}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/contracts/${contract.id}`}>
                      View
                    </Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 