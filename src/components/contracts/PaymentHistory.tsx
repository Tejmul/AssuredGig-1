"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}

interface PaymentHistoryProps {
  contractId: string;
}

export function PaymentHistory({ contractId }: PaymentHistoryProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}/payments`);
        if (!response.ok) throw new Error("Failed to fetch payments");
        const data = await response.json();
        setPayments(data);
      } catch (error) {
        console.error("Error fetching payments:", error);
        toast.error("Failed to load payment history");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [contractId]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (payments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No payments found</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">
                  {payment.amount} {payment.currency.toUpperCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(payment.createdAt), "PPP")}
                </p>
              </div>
              <Badge
                variant={
                  payment.status === "completed"
                    ? "success"
                    : payment.status === "pending"
                    ? "warning"
                    : "destructive"
                }
              >
                {payment.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 