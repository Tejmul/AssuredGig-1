'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Clock,
  DollarSign,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import Link from "next/link"

interface Contract {
  id: string
  title: string
  client: {
    id: string
    name: string
    image?: string
  }
  freelancer: {
    id: string
    name: string
    image?: string
  }
  startDate: Date
  endDate: Date
  status: 'active' | 'completed' | 'on_hold'
  progress: number
  amount: number
  currency: string
}

interface ActiveContractsProps {
  contracts: Contract[]
  userRole: string
}

export default function ActiveContracts({ contracts, userRole }: ActiveContractsProps) {
  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-500'
      case 'completed':
        return 'text-blue-500'
      case 'on_hold':
        return 'text-yellow-500'
      default:
        return 'text-gray-500'
    }
  }

  const getStatusIcon = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'on_hold':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Contracts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {contracts.map((contract) => (
            <div key={contract.id} className="flex items-start space-x-4">
              <Avatar className="h-10 w-10">
                <AvatarImage 
                  src={userRole === 'client' ? contract.freelancer.image : contract.client.image} 
                />
                <AvatarFallback>
                  {(userRole === 'client' ? contract.freelancer.name : contract.client.name)
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium leading-none">
                    {contract.title}
                  </h4>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(contract.status)} bg-opacity-10`}>
                    {getStatusIcon(contract.status)}
                    <span className="ml-1 capitalize">{contract.status.replace('_', ' ')}</span>
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  with {userRole === 'client' ? contract.freelancer.name : contract.client.name}
                </p>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-1 h-4 w-4" />
                    {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-1 h-4 w-4" />
                    {contract.amount} {contract.currency}
                  </div>
                </div>
                <div className="mt-2">
                  <Progress value={contract.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {contract.progress}% completed
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/contracts/${contract.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 