/* eslint-disable @typescript-eslint/no-explicit-any */
import { redirect } from "next/navigation";
import { Container, Typography, Box, Alert } from "@mui/material";
import { createServerClient } from "@/lib/supabase/server-client";
import { ClientDashboard } from "@/components/dashboard";

export default async function Dashboard() {
  const supabase = await createServerClient(); // Await the async client
  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log({ user });
  if (!user) redirect("/auth/login");

  const { data: userType } = await supabase
    .from("user_types")
    .select("type")
    .eq("user_id", user.id)
    .single();
  console.log({ userType });
  if (!userType) redirect("/auth/login");

  const isPerson = userType.type === "person";
  const table = isPerson ? "profiles_people" : "profiles_businesses";
  const { data: profile } = await supabase
    .from(table)
    .select("is_verified")
    .eq("id", user.id)
    .single();

  const profiles: any = profile?.is_verified
    ? await supabase
        .from(isPerson ? "profiles_businesses" : "profiles_people")
        .select("*")
        .neq("id", user.id)
        .eq("is_verified", true)
    : [];

  return (
    <Container sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Discover {isPerson ? "Businesses" : "People"}
      </Typography>
      {!profile?.is_verified && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your profile is awaiting verification. You can view and edit your
          profile, but swiping is disabled until verified.
        </Alert>
      )}
      <ClientDashboard
        profiles={profiles.data || []}
        userId={user.id}
        isPerson={isPerson}
      />
    </Container>
  );
}
