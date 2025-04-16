'use client';

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

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
      router.push("/login");
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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
            {error && error !== "undefined" ? "Authentication Error" : "Redirecting..."}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <Link
            href="/login"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Back to Login
          </Link>
          <Link
            href="/"
            className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 