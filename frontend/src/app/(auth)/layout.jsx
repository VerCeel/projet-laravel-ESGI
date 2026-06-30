import Link from "next/link";

import CanariaLogo from "@/components/static/CanariaLogo";

export default function AuthShellLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b px-4 py-4 md:px-6">
        <Link href="/">
          <CanariaLogo />
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>
    </div>
  );
}
