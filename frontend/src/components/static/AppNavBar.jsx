"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import CanariaLogo from "@/components/static/CanariaLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { getUserInitials } from "@/lib/user";

export default function AppNavBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out");
      router.push("/");
    } catch {
      toast.error("Could not sign out");
    }
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Link href="/products" className="hidden md:inline-flex">
          <CanariaLogo size="sm" />
        </Link>
      </div>

      {user && (
        <div className="flex items-center gap-3">
          <span className="max-w-[140px] truncate text-sm font-medium">{user.name}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <Avatar size="sm">
                  <AvatarFallback>{getUserInitials(user.name)}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
    </header>
  );
}
