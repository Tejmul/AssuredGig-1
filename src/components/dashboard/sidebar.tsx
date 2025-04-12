import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home, 
  Briefcase, 
  Users, 
  MessageSquare, 
  FileText, 
  Settings, 
  LogOut,
  FileEdit
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/auth"

interface DashboardSidebarProps {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()

  const clientLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/jobs", label: "My Jobs", icon: Briefcase },
    { href: "/dashboard/freelancers", label: "Find Freelancers", icon: Users },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const freelancerLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/dashboard/proposals", label: "My Proposals", icon: FileText },
    { href: "/resume", label: "My Resume", icon: FileEdit },
    { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
    { href: "/dashboard/contracts", label: "Contracts", icon: FileText },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  const links = user.role === "CLIENT" ? clientLinks : freelancerLinks

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">AssuredGig</span>
        </Link>
      </div>

      <div className="px-4 py-2">
        <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
          <Avatar>
            <AvatarImage src="" alt={user.name} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100",
                pathname === link.href && "bg-gray-100 font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{link.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center space-x-3 w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
} 