"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu, X } from "lucide-react";

export function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              AssuredGig
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/jobs">
              <Button
                variant={isActive("/jobs") ? "default" : "ghost"}
                className="font-medium"
              >
                Jobs
              </Button>
            </Link>
            <Link href="/contracts">
              <Button
                variant={isActive("/contracts") ? "default" : "ghost"}
                className="font-medium"
              >
                Contracts
              </Button>
            </Link>
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || ""} />
                      <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/signin">
                  <Button variant="ghost">Log in</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-2 space-y-1">
            <Link href="/jobs" onClick={closeMenu}>
              <Button
                variant={isActive("/jobs") ? "default" : "ghost"}
                className="w-full justify-start font-medium"
              >
                Jobs
              </Button>
            </Link>
            <Link href="/contracts" onClick={closeMenu}>
              <Button
                variant={isActive("/contracts") ? "default" : "ghost"}
                className="w-full justify-start font-medium"
              >
                Contracts
              </Button>
            </Link>
            {session?.user ? (
              <>
                <Link href="/profile" onClick={closeMenu}>
                  <Button
                    variant={isActive("/profile") ? "default" : "ghost"}
                    className="w-full justify-start font-medium"
                  >
                    Profile
                  </Button>
                </Link>
                <Link href="/settings" onClick={closeMenu}>
                  <Button
                    variant={isActive("/settings") ? "default" : "ghost"}
                    className="w-full justify-start font-medium"
                  >
                    Settings
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start font-medium text-destructive"
                  onClick={() => {
                    closeMenu();
                    signOut();
                  }}
                >
                  Sign out
                </Button>
              </>
            ) : (
              <div className="space-y-2 pt-2">
                <Link href="/auth/signin" onClick={closeMenu}>
                  <Button variant="ghost" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/signup" onClick={closeMenu}>
                  <Button className="w-full">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 