"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Container, Typography, CircularProgress } from "@mui/material";
import { createBrowserClient } from "@/lib/supabase/browser-client";

export default function Confirm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const confirmEmail = async () => {
      const supabase = createBrowserClient();
      const token = searchParams.get("token_hash");
      const type = searchParams.get("type");

      if (token && type === "signup") {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "signup",
        });
        if (!error) {
          router.push("/dashboard");
        } else {
          router.push("/auth/login?error=Verification failed");
        }
      }
    };
    confirmEmail();
  }, [searchParams, router]);

  return (
    <Container sx={{ textAlign: "center", mt: 8 }}>
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        Verifying your email...
      </Typography>
    </Container>
  );
}
