import { Link, Outlet } from "react-router-dom";
import { Feather } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b px-4 py-4 md:px-6">
        <Link
          to="/"
          className="group inline-flex items-center gap-2 text-sm font-semibold md:text-base"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary ring-1 ring-primary/20 transition group-hover:bg-primary/20">
            <Feather className="size-4" />
          </span>
          Budgie
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <Outlet />
      </main>
    </div>
  );
}
