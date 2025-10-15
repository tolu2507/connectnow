/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { createContext, useState, useEffect } from "react";
import { createBrowserClient } from "../supabase/browser-client";

export const AuthContext = createContext<{
  user: any;
  notifications: any[];
  setNotifications: React.Dispatch<React.SetStateAction<any[]>>;
}>({
  user: null,
  notifications: [],
  setNotifications: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const supabase = createBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, notifications, setNotifications }}>
      {children}
    </AuthContext.Provider>
  );
}
