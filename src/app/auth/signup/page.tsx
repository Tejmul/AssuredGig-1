"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

// Form validation schema
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
})

type ValidationErrors = {
  [key: string]: string[]
}

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})
  const [step, setStep] = useState<"role" | "details">("role")
  const [selectedRole, setSelectedRole] = useState<"client" | "freelancer" | null>(null)
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  async function validateForm(formData: FormData) {
    try {
      const data = {
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        password: formData.get("password") as string,
      }

      signupSchema.parse(data)
      setValidationErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: ValidationErrors = {}
        error.errors.forEach((err) => {
          const field = err.path[0] as string
          errors[field] = errors[field] || []
          errors[field].push(err.message)
        })
        setValidationErrors(errors)
      }
      return false
    }
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(event.currentTarget)

    // Validate form data
    const isValid = await validateForm(formData)
    if (!isValid) {
      setIsLoading(false)
      return
    }

    if (!selectedRole) {
      setError("Please select a role")
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
          name: formData.get("name"),
          role: selectedRole.toUpperCase(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      // Clear sensitive form data
      event.currentTarget.reset()

      // Redirect to signin page after successful registration
      router.push("/auth/signin?registered=true")
    } catch (error) {
      setError(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  function handleRoleSelect(role: "client" | "freelancer") {
    setSelectedRole(role)
    setStep("details")
    setError("")
    setValidationErrors({})
  }

  const getFieldError = (fieldName: string) => {
    return validationErrors[fieldName]?.[0]
  }

  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Image
            src="/logo.png"
            alt="AssuredGig Logo"
            width={40}
            height={40}
            className="mr-2"
            priority
          />
          AssuredGig
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              {selectedRole === "client"
                ? "Find the perfect freelancer for your project. Post a job and get started today."
                : selectedRole === "freelancer"
                ? "Discover exciting opportunities and connect with clients worldwide. Start your freelancing journey today."
                : "Join our thriving community of freelancers and clients. Whether you're looking to hire top talent or showcase your skills, AssuredGig makes it simple and secure."}
            </p>
            <footer className="text-sm">The AssuredGig Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              {step === "role" ? "Choose how you want to get started" : "Enter your details to get started"}
            </p>
          </div>

          {step === "role" ? (
            <div className="grid gap-4">
              <Button
                variant="default"
                className="relative h-auto px-8 py-6"
                onClick={() => handleRoleSelect("client")}
                type="button"
              >
                <div className="text-left">
                  <h3 className="font-semibold">I want to hire</h3>
                  <p className="text-sm text-muted-foreground">
                    Post jobs and find talented freelancers
                  </p>
                </div>
                <Icons.briefcase className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                className="relative h-auto px-8 py-6"
                onClick={() => handleRoleSelect("freelancer")}
                type="button"
              >
                <div className="text-left">
                  <h3 className="font-semibold">I want to work</h3>
                  <p className="text-sm text-muted-foreground">
                    Find work and connect with clients
                  </p>
                </div>
                <Icons.code className="absolute right-4 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              <form onSubmit={onSubmit} noValidate>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Doe"
                      type="text"
                      autoCapitalize="words"
                      autoComplete="name"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                      aria-describedby={getFieldError("name") ? "name-error" : undefined}
                      className={cn(getFieldError("name") && "border-red-500")}
                    />
                    {getFieldError("name") && (
                      <p className="text-sm text-red-500" id="name-error">
                        {getFieldError("name")}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      required
                      aria-describedby={getFieldError("email") ? "email-error" : undefined}
                      className={cn(getFieldError("email") && "border-red-500")}
                    />
                    {getFieldError("email") && (
                      <p className="text-sm text-red-500" id="email-error">
                        {getFieldError("email")}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      required
                      aria-describedby={getFieldError("password") ? "password-error" : undefined}
                      className={cn(getFieldError("password") && "border-red-500")}
                    />
                    {getFieldError("password") && (
                      <p className="text-sm text-red-500" id="password-error">
                        {getFieldError("password")}
                      </p>
                    )}
                  </div>
                  {error && (
                    <div className="text-sm text-red-500" role="alert">
                      {error}
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setStep("role")
                        setSelectedRole(null)
                        setError("")
                        setValidationErrors({})
                      }}
                      disabled={isLoading}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <p className="px-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="hover:text-brand underline underline-offset-4"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
} 