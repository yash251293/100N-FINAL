"use client"; // Required for usePathname and useEffect based logic

import type React from "react";
// Metadata type can remain if needed for static parts
// import type { Metadata } from "next";
import { Inter, Lora, Abhaya_Libre } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/header-wrapper";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // Import ProtectedRoute
import { usePathname } from 'next/navigation'; // Import usePathname
import { Toaster } from 'sonner'; // New import

const inter = Inter({ subsets: ["latin"] });
const lora = Lora({ 
  subsets: ["latin"],
  variable: "--font-lora",
  weight: ["400", "500", "600", "700"]
});
const abhayaLibre = Abhaya_Libre({ 
  subsets: ["latin"],
  variable: "--font-abhaya-libre",
  weight: ["400", "500", "600", "700", "800"]
});

// Note: `export const metadata: Metadata` might need to be handled differently
// if the entire layout becomes client-side due to `usePathname`.
// For now, we'll keep it, but Next.js might have opinions on mixing
// 'use client' with server-side metadata exports at the root layout level.
// This might be better if metadata is moved to specific pages or a template.tsx for this layout.
// For this step, focus is on ProtectedRoute integration.

// export const metadata: Metadata = {
//   title: "100 Networks",
//   description: "Follow employers and find your dream job",
//   generator: 'v0.dev'
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname();

  // Define paths that should NOT be protected by ProtectedRoute
  // (Landing page / is handled by its own (landing)/layout.tsx)
  const publicPaths = [
    '/auth/login',
    '/auth/signup',
    // Add other public paths if any, e.g., /auth/forgot-password
  ];

  // Onboarding paths might be considered semi-protected (user exists but might not be fully "active")
  // For now, let's treat them as needing protection after initial signup redirect.
  // Or, if they are part of the public flow before full login, list them here.
  // For this iteration, onboarding pages will be protected by default if not listed.
  // e.g. if pathname.startsWith('/auth/onboarding') it would be public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/auth/onboarding');


  // The actual page content that needs protection or public access
  const pageContent = (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* HeaderWrapper might also need to be auth-aware or path-aware
          if we don't want to show any header on /auth pages */}
      {!isPublicPath && <HeaderWrapper />}
      {/* Or, if HeaderWrapper is always shown, Header component itself is now auth-aware */}
      {/* Let's try hiding HeaderWrapper on public auth paths for a cleaner look */}
      {/* If HeaderWrapper is always needed, then Header component itself handles its display logic */}

      <main className="flex-1 overflow-auto px-4 py-3">{children}</main>
    </div>
  );

  return (
    <html lang="en" className="light">
      <body className={`${inter.className} ${lora.variable} ${abhayaLibre.variable}`}>
        <AuthProvider>
          {isPublicPath ? (
            pageContent // Render auth pages (login, signup, onboarding) directly
          ) : (
            <ProtectedRoute>
              {pageContent} {/* Wrap other app pages with ProtectedRoute */}
            </ProtectedRoute>
          )}
              <Toaster richColors position="top-right" /> {/* Toaster added here */}
        </AuthProvider>
      </body>
    </html>
  )
}
