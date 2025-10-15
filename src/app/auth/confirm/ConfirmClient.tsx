// src/app/auth/confirm/ConfirmClient.tsx
"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Typography } from "@mui/material";
import { createBrowserClient } from "@/lib/supabase/browser-client";

export default function ConfirmClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    const handleConfirmation = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");

      if (error) {
        console.error("Authentication error:", error, errorDescription);
        return;
      }

      if (code) {
        // Exchange the code for a session
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          console.error("Error exchanging code:", exchangeError);
          return;
        }
        // Redirect to dashboard after successful confirmation
        router.push("/dashboard");
      } else {
        console.error("No code provided in URL");
        router.push("/auth/login");
      }
    };

    handleConfirmation();
  }, [searchParams, router, supabase]);

  return <Typography>Processing authentication...</Typography>;
}
