"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface CalSchedulerProps {
  username: string;
  eventSlug: string;
  hideEventTypeDetails?: boolean;
  primaryColor?: string;
}

export function CalScheduler({
  username,
  eventSlug,
  hideEventTypeDetails = false,
  primaryColor = "6366F1",
}: CalSchedulerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Handle iframe load event
    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    // Handle iframe error
    const handleIframeError = () => {
      setError("Failed to load Cal.com scheduler");
      setIsLoading(false);
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener("load", handleIframeLoad);
      iframe.addEventListener("error", handleIframeError);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener("load", handleIframeLoad);
        iframe.removeEventListener("error", handleIframeError);
      }
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Schedule a Meeting</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative h-[600px]">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-destructive">{error}</div>
            <Button
              variant="outline"
              className="ml-2"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        )}
        <iframe
          ref={iframeRef}
          src={`https://cal.com/${username}/${eventSlug}?hideEventTypeDetails=${hideEventTypeDetails}&primaryColor=${primaryColor}`}
          className="w-full h-full border-0"
          title="Cal.com Scheduler"
        />
      </CardContent>
    </Card>
  );
} 