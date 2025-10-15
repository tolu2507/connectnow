/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useContext } from "react";
import { Box, Typography } from "@mui/material";
import { AuthContext } from "@/lib/context/AuthContext";
import { createBrowserClient } from "@/lib/supabase/browser-client";
import ProfileCard from "./ProfileCard";

export function ClientDashboard({
  profiles,
  userId,
  isPerson,
}: {
  profiles: any[];
  userId: string;
  isPerson: boolean;
}) {
  const [currentProfiles, setCurrentProfiles] = useState(profiles);
  const { setNotifications } = useContext(AuthContext);

  const handleSwipe = async (profileId: string, direction: "like" | "pass") => {
    const supabase = createBrowserClient();
    await supabase
      .from("swipes")
      .insert({ swiper_id: userId, target_id: profileId, direction });
    setCurrentProfiles(currentProfiles.filter((p) => p.id !== profileId));

    // Subscribe to matches
    supabase
      .channel("matches")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `person_id=eq.${userId}`,
        },
        (payload:any) => {
          setNotifications((prev: any[]) => [
            ...prev,
            { type: "match", message: "New match created!" },
          ]);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "matches",
          filter: `business_id=eq.${userId}`,
        },
        (payload:any) => {
          setNotifications((prev: any[]) => [
            ...prev,
            { type: "match", message: "New match created!" },
          ]);
        }
      )
      .subscribe();
  };

  return (
    <Box>
      {currentProfiles.map((profile) => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          isPerson={!isPerson}
          onSwipe={handleSwipe}
        />
      ))}
      {currentProfiles.length === 0 && (
        <Typography>No more profiles to show.</Typography>
      )}
    </Box>
  );
}
