
"use client";

import { useState, useEffect } from "react"; // Import useEffect
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import Link from 'next/link';
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for Seed Phrase

// Placeholder for authentication function - replace with actual implementation
// This function now runs entirely client-side due to localStorage access.
const authenticateUser = async (username: string, seedPhraseWords: string): Promise<{ success: boolean; message: string }> => {
  console.log("Attempting to authenticate user (DEMO):", username);
  // WARNING: In a real application:
  // 1. DO NOT log the username or seed phrase.
  // 2. This function should take the seed phrase (or ideally, a password derived from it),
  //    derive the necessary cryptographic keys (e.g., using PBKDF2/Argon2),
  //    fetch the stored *hash* for the user from a secure backend, and compare the derived key hash with the stored hash.
  // 3. NEVER compare the raw seed phrase directly. Never store the raw seed phrase on the server.
  // 4. Implement secure session management (e.g., JWT, secure cookies).
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate slight delay

  // Validate input format client-side
  const words = seedPhraseWords.trim().split(/\s+/); // Split by whitespace
  const isValidFormat = words.length === 5 && words.every(word => word.length > 0);

  if (!isValidFormat) {
    return { success: false, message: "Seed phrase must be exactly 5 non-empty words separated by spaces." };
  }

  // Retrieve stored data from localStorage (Client-side only)
  // This is inherently insecure for production but used for the demo.
  const storedUsername = localStorage.getItem('thredx_username');
  const storedSeedPhrase = localStorage.getItem('thredx_seedPhrase'); // Storing raw seed phrase is BAD PRACTICE!

  // **VERY INSECURE DEMO LOGIN LOGIC:**
  // Directly compare stored values.
  if (!storedUsername || !storedSeedPhrase) {
    return { success: false, message: "No signup data found in browser storage (Demo). Please sign up first." };
  }

  if (username === storedUsername && seedPhraseWords === storedSeedPhrase) {
      console.log("Demo authentication successful for:", username);
      localStorage.setItem('thredx_currentUser', username); // Persist demo login state
      return { success: true, message: "Login successful! (Demo Mode)" };
  } else {
      console.log("Demo authentication failed for:", username);
      let message = "Invalid username or seed phrase.";
       if (username !== storedUsername) {
           message = "Username does not match signup data (Demo)."
       } else if (seedPhraseWords !== storedSeedPhrase) {
           message = "Seed phrase does not match signup data (Demo)."
       }
      return { success: false, message: message };
  }
};

// Validate as 5 space-separated words
const formSchema = z.object({
  username: z.string().min(1, "Username is required."),
  seedPhrase: z.string()
    .min(1, "Seed phrase is required.")
    .refine(value => {
        const words = value.trim().split(/\s+/);
        return words.length === 5 && words.every(word => word.length > 0);
    }, "Seed phrase must be exactly 5 non-empty words separated by spaces."),
});


type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false); // State to track client-side mounting

  useEffect(() => {
    // Set isClient to true once the component mounts on the client
    setIsClient(true);
  }, []);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      seedPhrase: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    if (!isClient) return; // Prevent submission during SSR or before hydration

    setIsLoading(true);
    try {
      // Call the client-side authentication function
      const result = await authenticateUser(values.username, values.seedPhrase);
      if (result.success) {
        toast({
          title: "Login Successful",
          description: result.message,
        });
        // TODO: Implement REAL session management (e.g., set cookie/token via backend API call)
        router.push("/home"); // Redirect to home page
      } else {
         toast({
           variant: "destructive",
           title: "Login Failed",
           description: result.message, // Use the specific error message
         });
      }
    } catch (error) {
        console.error("Login error:", error);
        toast({
            variant: "destructive",
            title: "Login Error",
            description: "An unexpected error occurred. Please try again.",
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/20"
    >
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center p-4 sm:p-6">
          {/* SVG Icon - Removed responsive size attributes, rely on className */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-primary h-10 w-10 sm:h-12 sm:w-12">
             <path d="M21 8L16 3H8L3 8V16L8 21H16L21 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
             {/* Decorative paths */}
             <path d="M12 3V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M12 18V21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M21 8H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M6 8H3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M18 16H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M3 16H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M16 3L18 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M8 3L6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M16 21L18 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
             <path d="M8 21L6 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription className="text-sm sm:text-base">Login securely using your username and 5-word seed phrase.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 sm:space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Your username" {...field} className="bg-secondary/30 border-primary/30 focus:ring-primary/50 h-11 sm:h-10" aria-required="true" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="seedPhrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>5-Word Seed Phrase</FormLabel>
                    <FormControl>
                      {/* Using Textarea for potentially easier pasting */}
                      <Textarea
                        placeholder="Enter your 5 secret words separated by spaces"
                        {...field}
                        className="bg-secondary/30 border-primary/30 focus:ring-primary/50 min-h-[100px] tracking-wider text-base sm:text-sm resize-none" // Added resize-none
                        rows={3}
                        autoCapitalize="none"
                        autoCorrect="off"
                        spellCheck="false"
                        aria-required="true"
                      />
                    </FormControl>
                     <FormMessage />
                     <p className="text-xs text-muted-foreground mt-1">Enter the 5 words you saved during signup, separated by spaces.</p>
                  </FormItem>
                )}
              />

              <Button
                 type="submit"
                 className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-10 text-base sm:text-sm"
                 // Disable button during SSR/hydration or while loading
                 disabled={!isClient || isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
              </Button>
            </form>
          </Form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Sign Up
            </Link>
          </p>
           {/* Link back to info page reinforces the no-recovery model */}
           <p className="mt-4 text-center text-xs text-muted-foreground">
              <strong>Note:</strong> Account recovery is not possible if you lose your seed phrase.
              <Link href="/no-recovery-info" className="underline hover:text-primary ml-1">
                Learn why.
              </Link>
           </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
