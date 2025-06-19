"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { X, Briefcase, Calendar, Globe, Inbox, LayoutDashboard, MessageSquare, Users, Building2 } from "lucide-react" // Added X
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

const navItems = [
  {
    name: "Explore",
    href: "/explore",
    icon: LayoutDashboard,
  },
  {
    name: "Feed",
    href: "/feed",
    icon: MessageSquare,
  },
  {
    name: "Messages",
    href: "/inbox",
    icon: Inbox,
  },
  {
    name: "Jobs",
    href: "/jobs",
    icon: Briefcase,
  },
  {
    name: "Freelance",
    href: "/jobs/freelance",
    icon: Globe,
  },
  {
    name: "Events",
    href: "/events",
    icon: Calendar,
  },
  {
    name: "Network",
    href: "/people",
    icon: Users,
  },
  {
    name: "Companies",
    href: "/employers",
    icon: Building2,
  },
]

export default function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "flex flex-col border-r bg-background transition-transform transform",
          // Mobile styles: fixed, full height, slide-in
          "fixed inset-y-0 left-0 z-40 w-64 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop styles: sticky, part of layout
          "md:sticky md:top-0 md:flex md:w-64 md:h-screen"
        )}
      >
        <div className="p-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/100N%20logo-hXZbA69LLfyoIxuGBxaKL2lq5TY9q7.png"
              alt="100N"
              className="h-20 w-auto"
            />
          </Link>
          {/* Close button for mobile */}
          {isMobileOpen && (
            <button
              onClick={onClose}
              className="p-2 rounded-md text-slate-600 hover:bg-slate-100 hover:text-primary md:hidden"
              aria-label="Close sidebar"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-3 text-sm font-medium rounded-md",
              pathname === item.href
                ? "bg-muted text-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t mt-auto"> {/* Added mt-auto to push profile link to bottom */}
        <Link
          href="/profile"
          className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-muted transition-colors"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder-user.jpg" alt="User" /> {/* Consider making src dynamic or removing if not used */}
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Your Profile</p>
            <p className="text-xs text-muted-foreground truncate">View and edit profile</p>
          </div>
        </Link>
      </div>
    </div>
    </>
  )
}
