/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Chip,
  Input,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/auth";

export default function BusinessSignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_business_name: "",
    cac_registration_picture: null as File | null,
    business_addresses: [] as string[],
    business_location: "",
    business_type: "",
  });
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp({
        email: form.email,
        password: form.password,
        type: "business",
        profile: {
          full_business_name: form.full_business_name,
          cac_registration_picture: form.cac_registration_picture,
          business_addresses: form.business_addresses,
          business_location: form.business_location,
          business_type: form.business_type,
        },
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Sign-up failed");
    }
  };

  const addAddress = () => {
    if (address && !form.business_addresses.includes(address)) {
      setForm({
        ...form,
        business_addresses: [...form.business_addresses, address],
      });
      setAddress("");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Sign Up as Business
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <TextField
          fullWidth
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Full Business Name"
          value={form.full_business_name}
          onChange={(e) =>
            setForm({ ...form, full_business_name: e.target.value })
          }
          margin="normal"
          required
        />
        <Input
          type="file"
          onChange={(e: any) =>
            setForm({ ...form, cac_registration_picture: e.target.files[0] })
          }
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
          <TextField
            fullWidth
            label="Business Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addAddress()}
          />
          <Button onClick={addAddress}>Add</Button>
        </Box>
        <Box sx={{ mb: 2 }}>
          {form.business_addresses.map((addr, idx) => (
            <Chip
              key={idx}
              label={addr}
              onDelete={() =>
                setForm({
                  ...form,
                  business_addresses: form.business_addresses.filter(
                    (a) => a !== addr
                  ),
                })
              }
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
        <TextField
          fullWidth
          label="Business Location"
          value={form.business_location}
          onChange={(e) =>
            setForm({ ...form, business_location: e.target.value })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Business Type"
          value={form.business_type}
          onChange={(e) => setForm({ ...form, business_type: e.target.value })}
          margin="normal"
        />
        <Button type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
}
