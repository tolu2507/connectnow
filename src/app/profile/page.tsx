/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Alert,
  Input,
  MenuItem,
  Chip,
} from "@mui/material";
import { createBrowserClient } from "../../lib/supabase/browser-client";
import { useRouter } from "next/navigation";

const genders = ["male", "female", "other"];

export default function Profile() {
  const [userType, setUserType] = useState<string | null>(null);
  const [form, setForm] = useState<any>({});
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const router = useRouter();
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }
      const { data: typeData } = await supabase
        .from("user_types")
        .select("type")
        .eq("user_id", user.id)
        .single();
      if (!typeData) return;

      setUserType(typeData.type);
      const table =
        typeData.type === "person" ? "profiles_people" : "profiles_businesses";
      const { data } = await supabase
        .from(table)
        .select("*")
        .eq("id", user.id)
        .single();
      setForm(
        data || (typeData.type === "person" ? {} : { business_addresses: [] })
      );
      setIsVerified(data?.is_verified || false);
    };
    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const table =
      userType === "person" ? "profiles_people" : "profiles_businesses";
    let picture_url = form.picture_url || form.cac_registration_picture_url;
    if (form.picture || form.cac_registration_picture) {
      const file = form.picture || form.cac_registration_picture;
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`${user.id}/profile.jpg`, file, { upsert: true });
      if (error) {
        setError("Image upload failed");
        return;
      }
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(`${user.id}/profile.jpg`);
      picture_url = urlData.publicUrl;
    }

    const profileData =
      userType === "person"
        ? {
            id: user.id,
            full_name: form.full_name,
            dob: form.dob,
            callup_number: form.callup_number,
            course_of_study: form.course_of_study,
            location: form.location,
            gender: form.gender,
            picture_url,
            is_verified: form.is_verified,
          }
        : {
            id: user.id,
            full_business_name: form.full_business_name,
            cac_registration_picture_url: picture_url,
            business_addresses: form.business_addresses,
            business_location: form.business_location,
            business_type: form.business_type,
            is_verified: form.is_verified,
          };

    await supabase.from(table).upsert(profileData);
    router.push("/dashboard");
  };

  const addAddress = () => {
    if (address && !form.business_addresses?.includes(address)) {
      setForm({
        ...form,
        business_addresses: [...(form.business_addresses || []), address],
      });
      setAddress("");
    }
  };

  if (!userType) return null;

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h5" gutterBottom>
        Edit {userType === "person" ? "Profile" : "Business Profile"}
      </Typography>
      {isVerified ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          Your profile is verified!
        </Alert>
      ) : (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your profile is awaiting verification.
        </Alert>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {userType === "person" ? (
          <>
            <TextField
              fullWidth
              label="Full Name"
              value={form.full_name || ""}
              onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={form.dob || ""}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Call-up Number"
              value={form.callup_number || ""}
              onChange={(e) =>
                setForm({ ...form, callup_number: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Course of Study"
              value={form.course_of_study || ""}
              onChange={(e) =>
                setForm({ ...form, course_of_study: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Location"
              value={form.location || ""}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              margin="normal"
            />
            <TextField
              select
              fullWidth
              label="Gender"
              value={form.gender || ""}
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
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label="Full Business Name"
              value={form.full_business_name || ""}
              onChange={(e) =>
                setForm({ ...form, full_business_name: e.target.value })
              }
              margin="normal"
              required
            />
            <Input
              type="file"
              onChange={(e: any) =>
                setForm({
                  ...form,
                  cac_registration_picture: e.target.files[0],
                })
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
              {form.business_addresses?.map((addr: string, idx: number) => (
                <Chip
                  key={idx}
                  label={addr}
                  onDelete={() =>
                    setForm({
                      ...form,
                      business_addresses: form.business_addresses.filter(
                        (a: string) => a !== addr
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
              value={form.business_location || ""}
              onChange={(e) =>
                setForm({ ...form, business_location: e.target.value })
              }
              margin="normal"
            />
            <TextField
              fullWidth
              label="Business Type"
              value={form.business_type || ""}
              onChange={(e) =>
                setForm({ ...form, business_type: e.target.value })
              }
              margin="normal"
            />
          </>
        )}
        <Button type="submit" variant="contained" fullWidth>
          Save Profile
        </Button>
      </Box>
    </Container>
  );
}
