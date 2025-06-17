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

  const purelyAuthPaths = ['/auth/login', '/auth/signup']; // Paths that should NEVER show main header
  const isPurelyAuthPath = purelyAuthPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/auth/onboarding');

  // Logic for pages that are public but might still show a header (like landing page)
  const publicPaths = [
    '/',
    '/auth/login', // Will be excluded by isPurelyAuthPath for header
    '/auth/signup', // Will be excluded by isPurelyAuthPath for header
    // Add other public paths if any, e.g., /auth/forgot-password
  ];
  const isPublicContentPath = publicPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/auth/onboarding');

  // Determine if the main header should be shown
  // Show header if NOT a pure auth path (login, signup, onboarding)
  // This means it will show for '/' and all protected routes.
  const showMainHeader = !isPurelyAuthPath;

  const pageContent = (
    <div className="flex flex-col min-h-screen bg-background">
      {showMainHeader && <HeaderWrapper />}
      <main className="flex-1 px-4 py-3">{children}</main>
    </div>
  );

  return (
    <html lang="en" className="light">
      <body className={`${inter.className} ${lora.variable} ${abhayaLibre.variable}`}>
        <AuthProvider>
          {isPublicContentPath ? ( // This determines if <ProtectedRoute> is used
            pageContent
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
