"use client";

import Link from "next/link";
import { LogIn, StickyNote, UserPlus } from "lucide-react";

import CanariaLogo from "@/components/static/CanariaLogo";
import { Button } from "@/components/ui/button";

export default function PublicNavBar() {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <Link href="/">
        <CanariaLogo size="sm" />
      </Link>

      <div className="flex items-center gap-2">
        <Button asChild variant="outline" size="sm" className="gap-1.5">
          <Link href="/notes">
            <StickyNote className="size-4" />
            <span className="hidden sm:inline">Notes</span>
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm" className="gap-1.5">
          <Link href="/login">
            <LogIn className="size-4" />
            <span className="hidden sm:inline">Sign in</span>
          </Link>
        </Button>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/register">
            <UserPlus className="size-4" />
            <span className="hidden sm:inline">Register</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
