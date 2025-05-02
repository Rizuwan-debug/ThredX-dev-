
'use client'; // Essential for using hooks like useState, useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, User } from 'lucide-react'; // Added User icon
import { Textarea } from '@/components/ui/textarea'; // Import Textarea

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Keep Input for username
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { verifySeedPhraseLocally, hasStoredSeedPhrase, validateSeedPhrase, getUsername, storeUsername } from '@/lib/auth'; // Import necessary auth functions
import Link from 'next/link';

// Define the validation schema using Zod
const formSchema = z.object({
  username: z.string().min(1, "Username is required."), // Simple validation for login
  seedPhrase: z.string()
    .trim()
    .refine(phrase => phrase.split(/\s+/).filter(word => word.length > 0).length === 5, { // Check for 5 words
      message: "Seed phrase must contain exactly 5 words.",
    })
    .refine(phrase => validateSeedPhrase(phrase), { // Add validation using our updated function
        message: "Invalid seed phrase format.",
    }),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rememberedUsername, setRememberedUsername] = useState<string>('');

   // Check if user is already logged in on component mount (client-side only)
   useEffect(() => {
     // Ensure this runs only on the client
     if (typeof window !== 'undefined') {
        if (hasStoredSeedPhrase()) {
             console.log('User already logged in (has seed phrase). Redirecting to home.');
             router.replace('/home'); // Use replace to avoid adding login to history
         } else {
             // Attempt to retrieve stored username
             const storedUsername = getUsername();
             if (storedUsername) {
                 setRememberedUsername(storedUsername);
                 // Pre-fill the form field
                 form.setValue('username', storedUsername);
             }
         }
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [router]); // Dependency array includes router


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '', // Initialize username field
      seedPhrase: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Attempting login for user:", values.username, "with phrase:", values.seedPhrase.substring(0, 10) + "..."); // Log submitted data carefully

    try {
        // Perform verification (ensure this runs client-side)
        if (typeof window !== 'undefined') {
            // 1. Verify the seed phrase itself
            const isSeedValid = verifySeedPhraseLocally(values.seedPhrase);

            if (isSeedValid) {
                 // 2. Check if the entered username matches the stored one (if any)
                 // In this simple model, we just store/verify the seed. Association with username is implicit.
                 // If multiple users used the same browser, this wouldn't distinguish them without more complex key derivation.
                 // For now, successful seed verification means login.

                 console.log('Seed phrase verified locally.');

                 // Store/update the username used for login
                 storeUsername(values.username);

                 toast({
                   title: "Login Successful",
                   description: `Welcome back, ${values.username}!`,
                 });
                 router.push('/home'); // Redirect on successful login
             } else {
                 console.log('Local seed phrase verification failed.');
                 toast({
                   variant: "destructive",
                   title: "Login Failed",
                   description: "Incorrect username or seed phrase. Please try again.",
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
              viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="mx-auto mb-2 text-primary h-10 w-10 sm:h-12 sm:w-12" // Use Tailwind for size
              aria-hidden="true"
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
          <CardDescription className="text-sm sm:text-base">Enter your username and 5-word recovery phrase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Username Input */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <User className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="Enter your username"
                          className="pl-8" // Add padding for icon
                          {...field}
                          aria-required="true"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seed Phrase Input */}
              <FormField
                control={form.control}
                name="seedPhrase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Secret Recovery Phrase (5 words)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        {/* Use Textarea for potentially multi-line input during paste */}
                        <Textarea
                          placeholder="Enter your 5 words separated by spaces..."
                          className={`resize-none pr-10 font-mono ${showSeedPhrase ? '' : 'blur-sm'}`} // Use blur for hiding
                          rows={3} // Adjust rows as needed
                          {...field}
                           aria-required="true"
                        />
                        {/* Show/Hide button */}
                        <Button
                           type="button"
                           variant="ghost"
                           size="icon"
                           className="absolute right-1 top-1 h-7 w-7" // Adjusted position slightly
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
              <Link href="/no-recovery-info" passHref>
                 <span className="font-medium text-primary hover:underline cursor-pointer" >
                   Why no recovery?
                 </span>
               </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
