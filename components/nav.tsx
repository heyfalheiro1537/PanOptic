"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Lightbulb, Database, FolderTree, Sparkles, BookOpen, Store } from "lucide-react"

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/categories", label: "Categories", icon: FolderTree },
  { href: "/insights", label: "Insights", icon: Lightbulb },
  { href: "/data", label: "Data", icon: Database },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/docs", label: "Docs", icon: BookOpen },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-xl text-primary">
              FounderHQ
            </Link>
            <div className="flex gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
