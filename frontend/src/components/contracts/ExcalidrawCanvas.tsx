"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface ExcalidrawCanvasProps {
  contractId: string;
  roomId?: string;
}

export function ExcalidrawCanvas({ contractId, roomId }: ExcalidrawCanvasProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate a unique room ID if not provided
  const excalidrawRoomId = roomId || `contract-${contractId}`;

  useEffect(() => {
    // Handle iframe load event
    const handleIframeLoad = () => {
      setIsLoading(false);
    };

    // Handle iframe error
    const handleIframeError = () => {
      setError("Failed to load Excalidraw canvas");
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
    <Card className="w-full h-[600px]">
      <CardHeader>
        <CardTitle>Collaborative Canvas</CardTitle>
      </CardHeader>
      <CardContent className="p-0 relative h-[500px]">
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
          src={`https://excalidraw.com/#room=${excalidrawRoomId}`}
          className="w-full h-full border-0"
          title="Excalidraw Canvas"
          allow="clipboard-read; clipboard-write"
        />
      </CardContent>
    </Card>
  );
} 