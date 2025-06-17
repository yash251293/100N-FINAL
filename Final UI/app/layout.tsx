"use client"; // Required for usePathname and useEffect based logic

import type React from "react";
// import type { Metadata } from "next"; // Kept for reference
import { Inter, Lora, Abhaya_Libre } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/header-wrapper";
import { AuthProvider } from "@/context/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { usePathname } from 'next/navigation';
import { Toaster } from 'sonner';

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

// export const metadata: Metadata = {
//   title: "100 Networks",
//   description: "Follow employers and find your dream job",
// };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  const publicPaths = [ // Paths that should NOT be wrapped by ProtectedRoute
    '/',
    '/auth/login',
    '/auth/signup',
  ];
  // isPublicPath will be true for '/', '/auth/login', '/auth/signup', and '/auth/onboarding/*'
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path)) || pathname.startsWith('/auth/onboarding');

  // Base page structure
  const pageLayout = (showNav: boolean) => (
    <div className="flex flex-col min-h-screen bg-background">
      {showNav && <HeaderWrapper />} {/* Header is shown based on this flag */}
      <main className="flex-1 px-4 py-3">{children}</main>
    </div>
  );

  return (
    <html lang="en" className="light">
      {/* Ensure body takes full height and allows flex column layout */}
      <body className={`${inter.className} ${lora.variable} ${abhayaLibre.variable} flex flex-col min-h-screen`}>
        <AuthProvider>
          {isPublicPath ? (
            // Render public content (landing, login, signup, onboarding) WITHOUT header
            pageLayout(false)
          ) : (
            // For protected content, wrap with ProtectedRoute
            // ProtectedRoute will then render its children, which includes the header
            <ProtectedRoute>
              {pageLayout(true)}
            </ProtectedRoute>
          )}
          <Toaster richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
