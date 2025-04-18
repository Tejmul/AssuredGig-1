"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectProgress } from "@/components/contracts/ProjectProgress";
import { AddMilestone } from "@/components/contracts/AddMilestone";
import { Chat } from "@/components/contracts/Chat";
import { ExcalidrawCanvas } from "@/components/contracts/ExcalidrawCanvas";
import { CalScheduler } from "@/components/contracts/CalScheduler";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Contract {
  id: string;
  title: string;
  description: string;
  budget: number;
  deadline: string;
  status: string;
  client: {
    id: string;
    name: string;
    image?: string;
  };
  freelancer: {
    id: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function ContractPage() {
  const { data: session } = useSession();
  const params = useParams();
  const contractId = params.contractId as string;
  
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchContract = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch contract");
        }
        const data = await response.json();
        setContract(data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching contract:", err);
        setError("Failed to load contract details");
        setIsLoading(false);
      }
    };

    fetchContract();
  }, [contractId]);

  const handleMilestoneAdded = () => {
    // Force refresh of the ProjectProgress component
    setRefreshKey(prev => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-4">{error || "Contract not found"}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{contract.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="text-muted-foreground whitespace-pre-line">{contract.description}</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Details</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Budget:</span> ${contract.budget}</p>
                  <p><span className="font-medium">Deadline:</span> {new Date(contract.deadline).toLocaleDateString()}</p>
                  <p><span className="font-medium">Status:</span> {contract.status}</p>
                  <p><span className="font-medium">Created:</span> {formatDistanceToNow(new Date(contract.createdAt), { addSuffix: true })}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Participants</h3>
                <div className="space-y-2">
                  <p><span className="font-medium">Client:</span> {contract.client.name}</p>
                  <p><span className="font-medium">Freelancer:</span> {contract.freelancer.name}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="canvas">Canvas</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="progress" className="space-y-6">
          <ProjectProgress key={refreshKey} contractId={contractId} />
          <AddMilestone contractId={contractId} onMilestoneAdded={handleMilestoneAdded} />
        </TabsContent>
        
        <TabsContent value="chat">
          <Chat contractId={contractId} />
        </TabsContent>
        
        <TabsContent value="canvas">
          <ExcalidrawCanvas contractId={contractId} />
        </TabsContent>
        
        <TabsContent value="meetings">
          <CalScheduler 
            username={process.env.NEXT_PUBLIC_CAL_USERNAME || ""} 
            eventSlug={process.env.NEXT_PUBLIC_CAL_EVENT_SLUG || ""} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
} 