"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";
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
  };
  freelancer: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function ContractsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    // Redirect to signin if not authenticated
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    // Only fetch contracts if authenticated
    if (status === "authenticated") {
      const fetchContracts = async () => {
        try {
          const response = await fetch("/api/contracts");
          if (!response.ok) {
            throw new Error("Failed to fetch contracts");
          }
          const data = await response.json();
          setContracts(data);
          setIsLoading(false);
        } catch (err) {
          console.error("Error fetching contracts:", err);
          setError("Failed to load contracts");
          setIsLoading(false);
        }
      };

      fetchContracts();
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || contract.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Contracts</h1>
        {session?.user && (
          <Link href="/contracts/new">
            <Button>Create Contract</Button>
          </Link>
        )}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredContracts.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">No contracts found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <Link href={`/contracts/${contract.id}`} key={contract.id}>
              <Card className="h-full hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="line-clamp-1">{contract.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2 mb-4">{contract.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Budget:</span>
                      <span>${contract.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Deadline:</span>
                      <span>{new Date(contract.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className={`${
                        contract.status === "COMPLETED" ? "text-green-600" :
                        contract.status === "IN_PROGRESS" ? "text-blue-600" :
                        contract.status === "CANCELLED" ? "text-red-600" :
                        "text-amber-600"
                      }`}>
                        {contract.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Client:</span>
                      <span>{contract.client.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Freelancer:</span>
                      <span>{contract.freelancer.name}</span>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Created {formatDistanceToNow(new Date(contract.createdAt), { addSuffix: true })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 