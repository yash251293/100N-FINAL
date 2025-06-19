"use client";

import React, { useState } from 'react';
import Sidebar from './sidebar'; // Assuming sidebar.tsx is in the same directory
import { Menu, X } from 'lucide-react'; // For toggle buttons

interface LayoutWithSidebarProps {
  children: React.ReactNode;
  // Add other props if this layout needs to vary, e.g., which header to show
}

export default function LayoutWithSidebar({ children }: LayoutWithSidebarProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => setIsMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <div className="flex h-screen bg-background"> {/* Ensure parent flex container and bg */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden"> {/* Changed overflow-y-auto to overflow-hidden, main content will scroll */}
        {/* Optional: Header specific to this layout */}
        {/* For now, a simple mobile toggle bar. This might integrate with a global Header later. */}
        <div className="p-3 border-b md:hidden flex items-center justify-between bg-background sticky top-0 z-10"> {/* Sticky mobile header for toggle */}
          {/* Placeholder for a logo or page title if needed on mobile header */}
          <span className="text-lg font-semibold">App Name</span>
          <button onClick={toggleMobileSidebar} className="p-2 rounded-md text-slate-600 hover:bg-slate-100">
            {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <main className="p-4 md:p-6 flex-grow overflow-y-auto"> {/* Main content scrolls */}
          {children}
        </main>
      </div>
    </div>
  );
}
