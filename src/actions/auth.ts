/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/auth.ts
"use server";
import { createServerClient } from "../lib/supabase/server-client";
import { redirect } from "next/navigation";

export async function signIn({
  email,
  password,
  provider,
}: {
  email?: string;
  password?: string;
  provider?: any;
}) {
  const supabase = await createServerClient(); // Await the async client
  if (provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`,
      },
    });
    if (error) throw error;
    redirect(data.url);
  } else if (email && password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }
}

export async function signUp({
  email,
  password,
  type,
  profile,
}: {
  email: string;
  password: string;
  type: "person" | "business";
  profile: any;
  }) {
  console.log({type})
  const supabase = await createServerClient(); // Await the async client
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL!}/auth/confirm`,
    },
  });
  console.log({data})
  if (error) throw error;

  const userId = data.user?.id;
  console.log(userId)
  if (!userId) throw new Error("No user ID");

  // Upload images
  let picture_url = "";
  if (profile.picture || profile.cac_registration_picture) {
    const file = profile.picture || profile.cac_registration_picture;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(`${userId}/profile.jpg`, file, { upsert: true });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(`${userId}/profile.jpg`);
    console.log({imge:urlData.publicUrl})
    picture_url = urlData.publicUrl;
  }

  // Save profile
  const table = type === "person" ? "profiles_people" : "profiles_businesses";
  const profileData =
    type === "person"
      ? {
          id: userId,
          full_name: profile.full_name,
          dob: profile.dob,
          callup_number: profile.callup_number,
          course_of_study: profile.course_of_study,
          location: profile.location,
          gender: profile.gender,
          picture_url,
          is_verified: false,
        }
      : {
          id: userId,
          full_business_name: profile.full_business_name,
          cac_registration_picture_url: picture_url,
          business_addresses: profile.business_addresses,
          business_location: profile.business_location,
          business_type: profile.business_type,
          is_verified: false,
        };
console.log({profileData})
  await supabase.from(table).insert(profileData);
  await supabase.from("user_types").insert({ user_id: userId, type });

  // Submit verification data
  const verificationData =
    type === "person"
      ? { callup_number: profile.callup_number, picture_url }
      : { cac_registration_picture_url: picture_url };
  console.log(verificationData)
  await supabase.from("pending_verifications").insert({
    id: userId,
    user_type: type,
    verification_data: verificationData,
  });
}
