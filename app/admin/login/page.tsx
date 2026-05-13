import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleSignInButton } from "./GoogleSignInButton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

type Props = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function AdminLoginPage({ searchParams }: Props) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (isAdmin) redirect("/admin");
  }

  const err = searchParams.error;
  const errorMessage =
    err === "auth"
      ? "Could not complete sign-in. Try again."
      : typeof err === "string"
        ? err
        : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-muted/50 via-background to-muted/30 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex w-full max-w-md flex-col gap-8">
        <Link
          href="/"
          aria-label="Career Pages home"
          className="flex items-center justify-center gap-3 text-foreground transition-opacity hover:opacity-90"
        >
          <Image src="/logo.svg" alt="" width={40} height={40} priority />
          <span className="text-xl font-bold tracking-tight">Career Pages</span>
        </Link>

        <Card className="border shadow-lg">
          <CardHeader className="space-y-1 pb-2 pt-8 text-center sm:px-8">
            <CardTitle className="text-2xl font-semibold tracking-tight">
              Admin sign in
            </CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Use your Google account. Only allowlisted emails can access the
              dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 px-6 pb-8 pt-2 sm:px-8">
            {errorMessage ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Sign-in failed</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-col gap-3">
              <GoogleSignInButton />
            </div>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
                Back to home
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
