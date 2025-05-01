
import React from 'react';
import Link from 'next/link'; // Import Link

// This layout will wrap authenticated pages like Home Feed, Profile, etc.
// It defines the main structure with a sticky header.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const headerHeight = 'h-14'; // Define header height consistent with the container below

  return (
    <div className="flex flex-col min-h-screen">
      {/* Sticky Header */}
      <header
        className={cn(
            "sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
            headerHeight // Apply height class
        )}
        // Define CSS variable for header height
        style={{ '--header-height': '3.5rem' } as React.CSSProperties} // 3.5rem = h-14
       >
        <div className={`container flex max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8 ${headerHeight}`}> {/* Ensure container respects header height */}
          {/* Logo and Nav Links */}
           <div className="mr-auto flex items-center"> {/* Pushes other items to the right */}
             <Link href="/home" passHref legacyBehavior>
               <a className="flex items-center" aria-label="ThredX Home">
                 {/* Optimized SVG Icon */}
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary h-6 w-6 sm:h-7 sm:w-7" aria-hidden="true">
                    <path d="M21 8L16 3H8L3 8V16L8 21H16L21 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                 <span className="ml-2 font-bold hidden sm:inline">ThredX</span> {/* Hide text on extra small screens */}
               </a>
             </Link>
           </div>
          {/* Placeholder for future right-aligned items */}
          {/*
          <div className="flex items-center space-x-2">
             <Button variant="ghost" size="icon"><User className="h-5 w-5" /></Button>
          </div>
          */}
        </div>
      </header>
      {/* Main Content Area */}
      {/* Use padding-top to account for the sticky header height */}
      <main className="flex-1 container py-4 px-4 sm:px-6 lg:px-8 md:py-6">
        {children}
      </main>
      {/* Optional Footer (Uncomment if needed) */}
      {/*
      <footer className="py-4 text-center text-sm text-muted-foreground border-t border-primary/10 mt-auto">
        © {new Date().getFullYear()} ThredX
      </footer>
      */}
    </div>
  );
}

// Helper utility (ensure this exists in your project, e.g., in src/lib/utils.ts)
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
