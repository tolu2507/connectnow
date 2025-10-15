import { Container, Typography, Button, Box } from "@mui/material";
import Link from "next/link";

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h3" gutterBottom>
        Connect People & Businesses
      </Typography>
      <Typography variant="body1" paragraph>
        Swipe to find opportunities or talent!
      </Typography>
      <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
        <Button variant="contained" component={Link} href="/auth/login">
          Login
        </Button>
        <Button variant="outlined" component={Link} href="/auth/signup/person">
          Sign Up as Person
        </Button>
        <Button
          variant="outlined"
          component={Link}
          href="/auth/signup/business">
          Sign Up as Business
        </Button>
      </Box>
    </Container>
  );
}
