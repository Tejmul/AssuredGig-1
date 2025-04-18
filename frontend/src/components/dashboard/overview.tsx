'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Briefcase, 
  Users, 
  FileText, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownRight,
  DollarSign,
  Clock,
  CheckCircle,
  Star
} from "lucide-react"
import Link from "next/link"

interface OverviewProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
  stats: {
    jobsCount: number
    proposalsCount: number
    contractsCount: number
    messagesCount: number
    earnings?: number
    completedJobs?: number
    rating?: number
  }
}

export default function DashboardOverview({ user, stats }: OverviewProps) {
  const isClient = user.role === "CLIENT"

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Jobs/Applications Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isClient ? "Posted Jobs" : "Job Applications"}
          </CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.jobsCount}</div>
          <p className="text-xs text-muted-foreground">
            {isClient ? "Total jobs posted" : "Total applications sent"}
          </p>
        </CardContent>
      </Card>

      {/* Proposals Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            {isClient ? "Received Proposals" : "Sent Proposals"}
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.proposalsCount}</div>
          <p className="text-xs text-muted-foreground">
            {isClient ? "Total proposals received" : "Total proposals sent"}
          </p>
        </CardContent>
      </Card>

      {/* Active Contracts Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.contractsCount}</div>
          <p className="text-xs text-muted-foreground">
            Ongoing projects
          </p>
        </CardContent>
      </Card>

      {/* Messages Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.messagesCount}</div>
          <p className="text-xs text-muted-foreground">
            Unread messages
          </p>
        </CardContent>
      </Card>

      {/* Additional stats for freelancers */}
      {!isClient && (
        <>
          {/* Earnings Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.earnings?.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          {/* Completed Jobs Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedJobs}</div>
              <p className="text-xs text-muted-foreground">
                Successfully completed projects
              </p>
            </CardContent>
          </Card>

          {/* Rating Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.rating?.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">
                Average client rating
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
} 