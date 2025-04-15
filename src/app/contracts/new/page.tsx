"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function NewContractPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [deadline, setDeadline] = useState("");
  const [freelancerId, setFreelancerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [freelancers, setFreelancers] = useState<Array<{ id: string; name: string }>>([]);
  const [isLoadingFreelancers, setIsLoadingFreelancers] = useState(true);

  // Fetch freelancers on component mount
  useState(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await fetch("/api/users?role=FREELANCER");
        if (!response.ok) {
          throw new Error("Failed to fetch freelancers");
        }
        const data = await response.json();
        setFreelancers(data);
        setIsLoadingFreelancers(false);
      } catch (err) {
        console.error("Error fetching freelancers:", err);
        toast.error("Failed to load freelancers");
        setIsLoadingFreelancers(false);
      }
    };

    fetchFreelancers();
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session?.user) return;
    
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/contracts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          budget: parseFloat(budget),
          deadline: new Date(deadline).toISOString(),
          freelancerId,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create contract");
      }
      
      const contract = await response.json();
      
      // Show success message
      toast.success("Contract created successfully");
      
      // Redirect to the new contract
      router.push(`/contracts/${contract.id}`);
    } catch (err) {
      console.error("Error creating contract:", err);
      toast.error(err instanceof Error ? err.message : "Failed to create contract");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create New Contract</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter contract title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the contract details..."
                required
                rows={5}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="freelancer">Freelancer</Label>
              {isLoadingFreelancers ? (
                <div className="flex items-center justify-center py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                </div>
              ) : (
                <Select value={freelancerId} onValueChange={setFreelancerId}>
                  <SelectTrigger id="freelancer">
                    <SelectValue placeholder="Select a freelancer" />
                  </SelectTrigger>
                  <SelectContent>
                    {freelancers.map((freelancer) => (
                      <SelectItem key={freelancer.id} value={freelancer.id}>
                        {freelancer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Contract"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 