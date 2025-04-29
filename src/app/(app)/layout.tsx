import React from 'react';

// This layout will wrap authenticated pages like Home Feed, Profile, etc.
// You can add common elements like a navbar or sidebar here later.
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Placeholder for Header/Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4 sm:px-6 lg:px-8"> {/* Adjusted padding */}
          {/* Add Logo and Nav Links here */}
           <div className="mr-4 flex items-center"> {/* Removed hidden md:flex */}
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
                <path d="M21 8L16 3H8L3 8V16L8 21H16L21 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
             <span className="ml-2 font-bold hidden sm:inline">ThredX</span> {/* Hide text on extra small screens */}
           </div>
          {/* Add other nav items like profile, settings icons later */}
        </div>
      </header>
      <main className="flex-1 container py-4 px-4 sm:px-6 lg:px-8 md:py-6"> {/* Adjusted padding */}
        {children}
      </main>
      {/* Placeholder for Footer */}
      {/* <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ThredX
      </footer> */}
    </div>
  );
}
