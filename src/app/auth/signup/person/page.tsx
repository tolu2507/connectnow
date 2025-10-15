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
  MenuItem,
  Input,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { signUp } from "@/actions/auth";

const genders = ["male", "female", "other"];

export default function PersonSignUp() {
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    dob: "",
    callup_number: "",
    course_of_study: "",
    location: "",
    gender: "",
    picture: null as File | null,
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const dobDate = new Date(form.dob);
    const age = new Date().getFullYear() - dobDate.getFullYear();
    if (age < 18) {
      setError("You must be 18 or older to sign up");
      return;
    }
    try {
      await signUp({
        email: form.email,
        password: form.password,
        type: "person",
        profile: {
          full_name: form.full_name,
          dob: form.dob,
          callup_number: form.callup_number,
          course_of_study: form.course_of_study,
          location: form.location,
          gender: form.gender,
          picture: form.picture,
        },
      });
      router.push("/dashboard");
    } catch (err) {
      setError("Sign-up failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Sign Up as Person
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
          label="Full Name"
          value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Date of Birth"
          type="date"
          value={form.dob}
          onChange={(e) => setForm({ ...form, dob: e.target.value })}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          fullWidth
          label="Call-up Number"
          value={form.callup_number}
          onChange={(e) => setForm({ ...form, callup_number: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Course of Study"
          value={form.course_of_study}
          onChange={(e) =>
            setForm({ ...form, course_of_study: e.target.value })
          }
          margin="normal"
        />
        <TextField
          fullWidth
          label="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          margin="normal"
        />
        <TextField
          select
          fullWidth
          label="Gender"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
          margin="normal"
          required>
          {genders.map((gender) => (
            <MenuItem key={gender} value={gender}>
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </MenuItem>
          ))}
        </TextField>
        <Input
          type="file"
          onChange={(e: any) =>
            setForm({ ...form, picture: e.target.files[0] })
          }
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained" fullWidth>
          Sign Up
        </Button>
      </Box>
    </Container>
  );
}
