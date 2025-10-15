"use client";
import { createBrowserClient } from "@/lib/supabase/browser-client";
import { Container, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Settings() {
  const router = useRouter();
  const supabase = createBrowserClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>
      <Box>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Container>
  );
}
