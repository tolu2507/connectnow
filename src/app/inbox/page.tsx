/* eslint-disable @typescript-eslint/no-explicit-any */
// app/inbox/page.tsx
import { redirect } from "next/navigation";
import { createServerClient } from "../../lib/supabase/server-client";
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

export default async function Inbox() {
  const supabase = await createServerClient(); // Await the async client
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: userType } = await supabase
    .from("user_types")
    .select("type")
    .eq("user_id", user.id)
    .single();

  const isPerson = userType?.type === "person";
  const matches = await supabase
    .from("matches")
    .select(
      `
      id,
      person_id,
      business_id,
      profiles_people:person_id (full_name, picture_url),
      profiles_businesses:business_id (full_business_name, cac_registration_picture_url)
    `
    )
    .or(`person_id.eq.${user.id},business_id.eq.${user.id}`);

  return (
    <Container sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Your Matches
      </Typography>
      <List>
        {matches?.data?.map((match) => {
          const other: any = isPerson
            ? match.profiles_businesses
            : match.profiles_people;
          return (
            <ListItem
              key={match.id}
              component={Link}
              href={`/inbox/${match.id}`}>
              <ListItemText
                primary={isPerson ? other.full_business_name : other.full_name}
              />
            </ListItem>
          );
        })}
      </List>
    </Container>
  );
}
