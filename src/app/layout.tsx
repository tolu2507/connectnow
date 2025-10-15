// app/layout.tsx
import { CssBaseline } from "@mui/material";
import { AuthProvider } from "../lib/context/AuthContext";
import NavBar from "../components/NavBar";
import "./globals.css";
import ClientThemeProvider from "@/components/ClientThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ClientThemeProvider>
            <CssBaseline />
            <NavBar />
            {children}
          </ClientThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
