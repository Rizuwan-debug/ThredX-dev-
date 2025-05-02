
'use client'; // Essential for using hooks like useState, useEffect

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertTriangle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from '@/hooks/use-toast';
import { hasStoredSeedPhrase } from '@/lib/auth'; // Import check
import Link from 'next/link';

// Define the validation schema using Zod (placeholder for recovery method)
const formSchema = z.object({
  // Example: Add fields based on chosen recovery method
  // securityAnswer: z.string().min(1, "Security answer is required"),
  // recoveryEmail: z.string().email("Invalid email address"),
});

export default function RecoverPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if user is already logged in on component mount (client-side only)
   useEffect(() => {
     // Ensure this runs only on the client
     if (typeof window !== 'undefined' && hasStoredSeedPhrase()) {
       console.log('User already logged in. Redirecting to home.');
       router.replace('/home');
     }
   }, [router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // Initialize based on schema
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Recovery attempt with:", values); // Log submitted values

    // --- TODO: Implement Actual Recovery Logic ---
    // This is highly dependent on the chosen recovery mechanism.
    // Examples:
    // 1. Security Questions: Send `values.securityAnswer` to a (non-existent in this P2P model) server for verification.
    // 2. Recovery Email/Phone: Send a reset link/code.
    // 3. Social Recovery: Initiate a process involving trusted contacts.
    // 4. Cloud Backup: Decrypt a backup using a password or other factor.

    // Since this is a placeholder for a P2P/local app, true "recovery"
    // without the original seed is often impossible by design.
    // We'll simulate a failure message.

    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Simulate failure (as there's no real recovery implemented)
     toast({
        variant: "destructive",
        title: "Recovery Not Implemented",
        description: "Account recovery is not available in this version. Securely store your seed phrase.",
     });


    // Example of success (if recovery were possible):
    // try {
    //   const recoveredSeed = await attemptRecovery(values); // Your recovery function
    //   if (recoveredSeed && typeof window !== 'undefined') {
    //      storeSeedPhrase(recoveredSeed); // Store recovered seed client-side
    //      toast({ title: "Recovery Successful", description: "You have been logged in." });
    //      router.push('/home');
    //   } else {
    //      throw new Error("Recovery failed or returned invalid seed.");
    //   }
    // } catch (error) {
    //   console.error("Recovery error:", error);
    //   toast({ variant: "destructive", title: "Recovery Failed", description: "Could not recover account." });
    // } finally {
    //    setIsLoading(false);
    // }

     setIsLoading(false); // End loading after simulated failure
  }

   // Only render form if not logged in
   if (typeof window !== 'undefined' && hasStoredSeedPhrase()) {
     return <div className="flex min-h-screen items-center justify-center"><p>Redirecting...</p></div>;
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
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">Recover Account</CardTitle>
          <CardDescription className="text-sm sm:text-base">Attempt to recover access if you lost your seed phrase.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">

          <Alert variant="warning">
             <AlertTriangle className="h-5 w-5" />
             <AlertTitle className="font-semibold">Important Notice</AlertTitle>
             <AlertDescription>
               Due to the decentralized nature of ThredX, recovering your account without the original 12-word seed phrase is extremely difficult or impossible by design. Always store your seed phrase securely.
             </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* --- Placeholder for Recovery Input Fields --- */}
               {/* Add FormField components here based on the chosen recovery method */}
               {/* Example for email recovery: */}
               {/*
               <FormField
                 control={form.control}
                 name="recoveryEmail"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Recovery Email</FormLabel>
                     <FormControl>
                       <Input placeholder="Enter email associated with backup" {...field} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
               */}

              <p className="text-sm text-muted-foreground text-center">
                  Account recovery features are currently under development or may not be available.
               </p>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Attempting Recovery...' : 'Recover Account'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center p-4 sm:p-6 border-t border-primary/10">
           <p className="text-sm text-muted-foreground">
              Remember your phrase?{' '}
              <Link href="/login" passHref>
                <span className="font-medium text-primary hover:underline cursor-pointer">
                  Log In
                </span>
              </Link>
            </p>
        </CardFooter>
      </Card>
    </div>
  );
}
