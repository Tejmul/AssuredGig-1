import { AnimatedElement } from '@/components/ui/animated-element'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

interface SignUpPageProps {
  searchParams: { role?: string }
}

export default function SignUpPage({ searchParams }: SignUpPageProps) {
  const role = searchParams.role || 'client'

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <AnimatedElement>
        <Card className="w-[400px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Choose your role and enter your details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Link href="/signup?role=client" className="w-full">
                <Button
                  variant={role === 'client' ? 'default' : 'outline'}
                  className="w-full"
                >
                  I want to hire
                </Button>
              </Link>
              <Link href="/signup?role=freelancer" className="w-full">
                <Button
                  variant={role === 'freelancer' ? 'default' : 'outline'}
                  className="w-full"
                >
                  I want to work
                </Button>
              </Link>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" />
            </div>
            <Button className="w-full">Create Account</Button>
          </CardContent>
          <div className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </AnimatedElement>
    </div>
  )
} 