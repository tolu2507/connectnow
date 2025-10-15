/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createBrowserClient } from "@/lib/supabase/browser-client";
import { Box, Typography } from "@mui/material";
// import { createBrowserClient } from "../lib/supabase/browser-client";
import { useEffect, useState } from "react";

export default function ChatBox({ messages }: { messages: any[] }) {
  const [senderNames, setSenderNames] = useState<{ [key: string]: string }>({});
  const supabase = createBrowserClient();

  useEffect(() => {
    const fetchSenderNames = async () => {
      const names: { [key: string]: string } = {};
      for (const msg of messages) {
        if (!names[msg.sender_id]) {
          const { data: person } = await supabase
            .from("profiles_people")
            .select("name")
            .eq("id", msg.sender_id)
            .single();
          const { data: business } = await supabase
            .from("profiles_businesses")
            .select("company_name")
            .eq("id", msg.sender_id)
            .single();
          names[msg.sender_id] =
            person?.name || business?.company_name || "Unknown";
        }
      }
      setSenderNames(names);
    };
    fetchSenderNames();
  }, [messages]);

  return (
    <Box
      sx={{
        maxHeight: 400,
        overflowY: "auto",
        mb: 2,
        p: 2,
        border: "1px solid #ddd",
      }}>
      {messages.map((msg) => (
        <Box key={msg.id} sx={{ mb: 1 }}>
          <Typography variant="subtitle2">
            {senderNames[msg.sender_id]}:
          </Typography>
          <Typography>{msg.content}</Typography>
        </Box>
      ))}
    </Box>
  );
}
