"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export function GoogleSignInButton() {
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
      const origin = siteUrl || window.location.origin;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback?next=/admin`,
        },
      });
      if (error) {
        console.error(error);
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      onClick={signIn}
      disabled={loading}
      size="lg"
      className="h-12 w-full gap-2 text-base font-medium shadow-sm"
      variant="default"
    >
      {loading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          Redirecting…
        </>
      ) : (
        <>Continue with Google</>
      )}
    </Button>
  );
}
