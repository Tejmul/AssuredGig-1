"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Milestone {
  id: string;
  description: string;
  amount: number;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

interface ProjectProgressProps {
  contractId: string;
}

export function ProjectProgress({ contractId }: ProjectProgressProps) {
  const { data: session } = useSession();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}/progress`);
        if (!response.ok) {
          throw new Error("Failed to fetch progress");
        }
        const data = await response.json();
        setMilestones(data.milestones);
        setProgress(data.progress);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching progress:", err);
        setError("Failed to load project progress");
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [contractId]);

  const handleStatusChange = async (milestoneId: string, checked: boolean) => {
    if (!session?.user) return;
    
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/contracts/${contractId}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          milestoneId,
          status: checked ? "COMPLETED" : "PENDING",
        }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update milestone status");
      }
      
      // Refresh progress data
      const progressResponse = await fetch(`/api/contracts/${contractId}/progress`);
      if (!progressResponse.ok) {
        throw new Error("Failed to fetch updated progress");
      }
      
      const data = await progressResponse.json();
      setMilestones(data.milestones);
      setProgress(data.progress);
    } catch (err) {
      console.error("Error updating milestone:", err);
      setError("Failed to update milestone status");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Project Progress</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-destructive">{error}</p>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Milestones</h3>
              {milestones.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">
                  No milestones defined yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className="flex items-start space-x-4 p-4 border rounded-lg"
                    >
                      <Checkbox
                        id={milestone.id}
                        checked={milestone.status === "COMPLETED"}
                        onCheckedChange={(checked) => 
                          handleStatusChange(milestone.id, checked as boolean)
                        }
                        disabled={isUpdating}
                      />
                      <div className="flex-1">
                        <label
                          htmlFor={milestone.id}
                          className={`text-sm font-medium ${
                            milestone.status === "COMPLETED"
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {milestone.description}
                        </label>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">
                            ${milestone.amount}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(milestone.updatedAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 