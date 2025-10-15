"use client";
import { AuthContext } from "@/lib/context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import Link from "next/link";
import { useContext } from "react";

export default function NavBar() {
  const { user, notifications } = useContext(AuthContext);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Connect Now
        </Typography>
        {/* {user && ( */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button color="inherit" component={Link} href="/dashboard">
              Dashboard
            </Button>
            <Button color="inherit" component={Link} href="/inbox">
              Inbox {notifications.length > 0 && `(${notifications.length})`}
            </Button>
            <Button color="inherit" component={Link} href="/profile">
              Profile
            </Button>
            <Button color="inherit" component={Link} href="/settings">
              Settings
            </Button>
          </Box>
        {/* )} */}
      </Toolbar>
    </AppBar>
  );
}
