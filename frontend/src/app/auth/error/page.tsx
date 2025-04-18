'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get("error");
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    // Only log actual errors, not initial undefined state
    if (error && error !== "undefined") {
      console.error("Authentication error:", error);
      console.error("Callback URL:", callbackUrl);
    }

    // If no real error, redirect to login
    if (!error || error === "undefined") {
      router.push("/auth/signin");
    }
  }, [error, callbackUrl, router]);

  const getErrorMessage = (errorType: string | null) => {
    if (!errorType || errorType === "undefined") {
      return "Redirecting to login...";
    }

    switch (errorType) {
      case "CredentialsSignin":
        return "Invalid email or password. Please try again.";
      case "AccessDenied":
        return "Access denied. You don't have permission to access this resource.";
      case "Configuration":
        return "There is a problem with the server configuration. Please try again later.";
      case "Verification":
        return "The verification link may have expired or is invalid. Please try again.";
      case "OAuthSignin":
        return "Error occurred while signing in with your provider. Please try again.";
      case "OAuthCallback":
        return "Error occurred while processing the sign in callback. Please try again.";
      case "OAuthCreateAccount":
        return "Could not create an account using your provider. Please try again.";
      case "EmailCreateAccount":
        return "Could not create an account. Please try again.";
      case "Callback":
        return "Error occurred during the authentication callback. Please try again.";
      default:
        return `An unexpected error occurred (${errorType}). Please try again.`;
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Authentication Error
          </h1>
          <p className="text-sm text-muted-foreground">
            {getErrorMessage(error)}
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {getErrorMessage(error)}
          </AlertDescription>
        </Alert>
        <div className="flex flex-col space-y-2 text-center">
          <Link
            href="/auth/signin"
            className="text-sm text-primary hover:underline"
          >
            Return to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
} 