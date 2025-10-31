"use client"

import { usePathname } from "next/navigation"
import { Nav } from "@/components/nav"

export function ConditionalNav() {
  const pathname = usePathname()
  
  // Hide nav on login page
  if (pathname === "/") {
    return null
  }
  
  return <Nav />
}

