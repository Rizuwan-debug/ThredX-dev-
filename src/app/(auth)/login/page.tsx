
'use client'; // Essential for using hooks like useState, useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Changed import from Textarea to Input
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { verifySeedPhraseLocally, hasStoredSeedPhrase, validateSeedPhrase, storeSeedPhrase } from '@/lib/auth'; // Import necessary auth functions
import Link from 'next/link';
import { Textarea } from '@/components/ui/textarea'; // Keep Textarea import if needed elsewhere, but use Input for seed

// Define the validation schema using Zod
const formSchema = z.object({
  seedPhrase: z.string()
    .trim()
    .refine(phrase => phrase.split(' ').filter(word => word.length > 0).length === 12, {
      message: "Seed phrase must contain exactly 12 words.",
    })
    .refine(phrase => validateSeedPhrase(phrase), { // Add validation using bip39
        message: "Invalid seed phrase format or checksum.",
    }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

   // Check if user is already logged in on component mount (client-side only)
   useEffect(() => {
     // Ensure this runs only on the client
     if (typeof window !== 'undefined' && hasStoredSeedPhrase()) {
       console.log('User already logged in (has seed phrase). Redirecting to home.');
       router.replace('/home'); // Use replace to avoid adding login to history
     }
   }, [router]); // Dependency array includes router


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      seedPhrase: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Attempting login with:", values.seedPhrase.substring(0, 10) + "..."); // Log submitted phrase carefully

    try {
        // Perform verification (ensure this runs client-side)
        if (typeof window !== 'undefined') {
            const isValid = verifySeedPhraseLocally(values.seedPhrase); // Use local verification

            if (isValid) {
                 console.log('Seed phrase verified locally.'); // Keep for debug

                 // Re-store the seed phrase to ensure it's the active one?
                 // Or just rely on the fact that it matched the stored one.
                 // Storing again might be redundant if `verifySeedPhraseLocally` reads from storage.
                 // Let's assume verification implies it's the correct one for the session.
                 // If we needed to ensure it *is* in localStorage (e.g., if verify was against a derived key),
                 // we might store it here: storeSeedPhrase(values.seedPhrase);

                 toast({
                   title: "Login Successful",
                   description: "Welcome back!",
                 });
                 router.push('/home'); // Redirect on successful login
             } else {
                 console.log('Local seed phrase verification failed.'); // Keep for debug
                 toast({
                   variant: "destructive",
                   title: "Login Failed",
                   description: "Incorrect seed phrase. Please try again.",
                 });
             }
        } else {
            throw new Error("Cannot verify seed phrase on the server.");
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
  }

  // Only render form if not logged in (checked via useEffect)
   // You might want a loading state here while useEffect runs
   if (typeof window !== 'undefined' && hasStoredSeedPhrase()) {
     return <div className="flex min-h-screen items-center justify-center"><p>Redirecting...</p></div>; // Or a spinner
   }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center p-4 sm:p-6">
           {/* Re-using the SVG Icon */}
           <svg
              width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-2 text-primary h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true"
           >
               <path d="M21 8L16 3H8L3 8V16L8 21H16L21 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
               <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
               <path d="M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M21 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M6 8H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M18 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M3 16H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M16 3L18 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M8 3L6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M16 21L18 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
               <path d="M8 21L6 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription className="text-sm sm:text-base">Enter your 12-word recovery phrase to log in.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="seedPhrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Secret Recovery Phrase</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {/* Use Textarea for multi-line input */}
                        <Textarea
                          placeholder="Enter your 12 words separated by spaces..."
                          className="resize-none pr-10 font-mono" // Add font-mono
                          rows={3} // Adjust rows as needed
                          {...field}
                          // Use type="text" or omit for Textarea, apply show/hide logic if truly needed, but it's less common for textareas
                          // type={showSeedPhrase ? "text" : "password"} // This doesn't work well with Textarea; remove if causing issues.
                           aria-required="true" // Mark as required for accessibility
                        />
                        {/* Show/Hide button - Consider if needed for Textarea */}
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" // Adjust positioning for Textarea
                           onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                           aria-label={showSeedPhrase ? "Hide seed phrase" : "Show seed phrase"}
                         >
                           {showSeedPhrase ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                         </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Verifying...' : 'Log In'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2 p-4 sm:p-6 border-t border-primary/10">
            <p className="text-sm text-muted-foreground">
               Don't have an account?{' '}
               <Link href="/signup" passHref>
                 <span className="font-medium text-primary hover:underline cursor-pointer">
                   Sign Up
                 </span>
               </Link>
             </p>
            <p className="text-sm text-muted-foreground">
              Forgot your phrase?{' '}
              <Link href="/recover" passHref>
                 <span className="font-medium text-primary hover:underline cursor-pointer">
                   Recover Account
                 </span>
               </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
