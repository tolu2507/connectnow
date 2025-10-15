// src/app/auth/confirm/page.tsx
import { Suspense } from "react";
import { Container, Typography, CircularProgress } from "@mui/material";
import ConfirmClient from "./ConfirmClient";

export default function ConfirmPage() {
  return (
    <Container sx={{ textAlign: "center", mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Confirming Your Account
      </Typography>
      <Suspense fallback={<CircularProgress />}>
        <ConfirmClient />
      </Suspense>
    </Container>
  );
}
