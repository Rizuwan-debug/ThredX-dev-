
import type { Metadata, Viewport } from "next"; // Import Viewport
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { NavigationEvents } from "@/components/navigation-events";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "ThredX",
  description: "Your Privacy, Our Priority. Secure, decentralized communication.", // Enhanced description
  manifest: "/manifest.json", // Example for PWA
  icons: { // Example for better icons
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

// Add viewport settings for responsiveness
export const viewport: Viewport = {
  themeColor: '#1a237e', // Match dark background - Example color
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevent zooming to maintain layout control
  userScalable: false, // Consider if zooming is truly needed
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning> {/* Apply dark theme globally via class */}
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased", // Removed dark class here, it's on <html>
          inter.variable
        )}
      >
        {/* Suspense is crucial for NavigationEvents as it's a Client Component */}
        <Suspense fallback={null}>
          <NavigationEvents />
        </Suspense>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
