/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ProfileCard.tsx
"use client";
import TinderCard from "react-tinder-card";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Button,
} from "@mui/material";

type ProfileCardProps = {
  profile: any;
  isPerson: boolean;
  onSwipe: (id: string, direction: "like" | "pass") => void;
};

export default function ProfileCard({
  profile,
  isPerson,
  onSwipe,
}: ProfileCardProps) {
  const handleSwipe = (direction: "left" | "right") => {
    onSwipe(profile.id, direction === "right" ? "like" : "pass");
  };

  return (
    <TinderCard
      onSwipe={handleSwipe}
      preventSwipe={["up", "down"]}
      swipeRequirementType="position"
      swipeThreshold={100}>
      <Card sx={{ maxWidth: 345, m: 2 }}>
        <CardMedia
          component="img"
          height="200"
          image={
            isPerson
              ? profile.picture_url
              : profile.cac_registration_picture_url
          }
          alt={isPerson ? profile.full_name : profile.full_business_name}
        />
        <CardContent>
          <Typography variant="h6">
            {isPerson ? profile.full_name : profile.full_business_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {isPerson
              ? `Studied ${profile.course_of_study} | ${profile.location}`
              : `${profile.business_type} | ${profile.business_location}`}
          </Typography>
        </CardContent>
      </Card>
    </TinderCard>
  );
}
