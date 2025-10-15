/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import { Container, Typography, Box, TextField, Button } from "@mui/material";
import { useParams } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/browser-client";
import ChatBox from "@/components/ChatBox";

export default function Chat() {
  const { matchId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const supabase = createBrowserClient();

  useEffect(() => {
    // Fetch existing messages
    supabase
      .from("messages")
      .select("*")
      .eq("match_id", matchId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMessages(data || []));

    // Subscribe to new messages
    const channel = supabase
      .channel(`match_${matchId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `match_id=eq.${matchId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("messages").insert({
      match_id: parseInt(matchId as string),
      sender_id: user.id,
      content: newMessage,
    });
    setNewMessage("");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Chat
      </Typography>
      <ChatBox messages={messages} />
      <Box sx={{ display: "flex", mt: 2 }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <Button onClick={sendMessage} variant="contained" sx={{ ml: 1 }}>
          Send
        </Button>
      </Box>
    </Container>
  );
}
