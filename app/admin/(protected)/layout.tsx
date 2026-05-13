import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { signOutAdmin } from "../actions";
import { LayoutDashboard, LogOut, Globe } from "lucide-react";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  const { data: isAdmin, error: rpcError } = await supabase.rpc("is_admin");

  if (rpcError) {
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-lg rounded-xl border bg-card p-8 shadow-sm">
          <h1 className="text-xl font-semibold tracking-tight">Configuration error</h1>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            Could not verify admin status ({rpcError.message}). Apply the latest
            database migration that defines{" "}
            <code className="rounded bg-muted px-1 py-0.5 text-xs">is_admin</code>.
          </p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-muted/30 px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-lg space-y-6 rounded-xl border bg-card p-8 shadow-sm">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold tracking-tight">Access denied</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Signed in as{" "}
              <span className="font-medium text-foreground">{user.email}</span>. This
              account is not in the admin allowlist.
            </p>
          </div>
          <form action={signOutAdmin}>
            <Button type="submit" variant="outline" className="gap-2">
              <LogOut className="h-4 w-4" aria-hidden />
              Sign out
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/25">
      <header className="sticky top-0 z-40 border-b bg-background/90 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Link
              href="/admin"
              aria-label="Admin home"
              className="flex shrink-0 items-center gap-2.5 rounded-md text-foreground transition-opacity hover:opacity-90"
            >
              <Image src="/logo.svg" alt="" width={32} height={32} className="shrink-0" />
              <span className="hidden font-semibold tracking-tight sm:inline sm:text-lg">
                Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1 border-l pl-6 text-sm">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Link href="/admin">
                  <LayoutDashboard className="h-4 w-4" aria-hidden />
                  Dashboard
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <Link href="/" target="_blank" rel="noreferrer">
                  <Globe className="h-4 w-4" aria-hidden />
                  Public site
                </Link>
              </Button>
            </nav>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden max-w-[220px] truncate text-sm text-muted-foreground md:inline">
              {user.email}
            </span>
            <form action={signOutAdmin}>
              <Button type="submit" variant="outline" size="sm" className="gap-1.5">
                <LogOut className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {children}
      </main>
    </div>
  );
}
