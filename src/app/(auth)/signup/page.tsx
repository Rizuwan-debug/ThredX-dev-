
'use client'; // Essential for using hooks like useState, useEffect

import React, { useState, useEffect, useCallback } from 'react'; // Import useEffect and useCallback
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, Copy, Check, RefreshCw, AlertTriangle, User } from 'lucide-react'; // Added User icon

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'; // Ensure FormDescription is imported if used, it wasn't in the prev version causing error
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert components
import { useToast } from '@/hooks/use-toast';
import { generateSeedPhrase, validateSeedPhrase, storeSeedPhrase, hasStoredSeedPhrase, storeUsername } from '@/lib/auth'; // Import auth functions, including storeUsername
import Link from 'next/link';

// Define the validation schema using Zod
const formSchema = z.object({
  username: z.string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be no more than 20 characters.")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores."),
  // Seed phrase handled separately, not part of form validation itself
});

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [seedPhrase, setSeedPhrase] = useState<string>('');
  const [showSeedPhrase, setShowSeedPhrase] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [hasConfirmedSeed, setHasConfirmedSeed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for final confirmation

  // Check if user is already logged in (has seed phrase) on component mount (client-side only)
   useEffect(() => {
     if (typeof window !== 'undefined' && hasStoredSeedPhrase()) {
       console.log('User already has a seed phrase stored. Redirecting to home.');
       router.replace('/home'); // Use replace to avoid adding signup to history
     } else {
       // Generate seed phrase only if none exists (client-side)
       handleGenerateSeedPhrase();
     }
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [router]); // Add router as a dependency


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  // Function to generate a new seed phrase (client-side safe)
  const handleGenerateSeedPhrase = useCallback(() => {
    // Ensure this runs client-side where window.crypto is available
    if (typeof window !== 'undefined') {
      const newSeed = generateSeedPhrase();
      setSeedPhrase(newSeed);
      setShowSeedPhrase(false); // Hide new phrase initially
      setIsCopied(false);
      setHasConfirmedSeed(false); // Reset confirmation on regeneration
      console.log('Generated new seed phrase.'); // Keep for debug
    } else {
      console.warn("Attempted to generate seed phrase on the server.");
    }
  }, []); // No dependencies needed

  const handleCopySeedPhrase = () => {
    if (typeof window !== 'undefined' && seedPhrase) { // Check window existence
      navigator.clipboard.writeText(seedPhrase)
        .then(() => {
          setIsCopied(true);
          toast({
            title: "Copied!",
            description: "Seed phrase copied to clipboard.",
          });
          // Reset icon after a short delay
          setTimeout(() => setIsCopied(false), 2000);
        })
        .catch(err => {
          console.error('Failed to copy seed phrase: ', err);
          toast({
            variant: "destructive",
            title: "Copy Failed",
            description: "Could not copy seed phrase. Please copy it manually.",
          });
        });
    }
  };

   const handleConfirmAndContinue = async (values: z.infer<typeof formSchema>) => {
     if (!hasConfirmedSeed) {
       toast({
         variant: "destructive",
         title: "Confirmation Required",
         description: "Please confirm you have saved your seed phrase securely.",
       });
       return;
     }
     if (!seedPhrase || !validateSeedPhrase(seedPhrase)) {
       toast({
         variant: "destructive",
         title: "Invalid Seed Phrase",
         description: "Cannot continue with an invalid seed phrase. Please regenerate.",
       });
       return;
     }

     setIsLoading(true); // Start loading

     // Simulate async operation if needed, then store and redirect
     try {
       // Store the username and seed phrase (ensure this only runs client-side)
        if (typeof window !== 'undefined') {
           storeUsername(values.username); // Store username
           storeSeedPhrase(seedPhrase);
           console.log('Username and seed phrase confirmed and stored.'); // Keep for debugging

           toast({
             title: "Account Created!",
             description: `Welcome to ThredX, ${values.username}.`,
           });
           router.push('/home'); // Redirect to home page after successful storage
         } else {
            throw new Error("Cannot store user data on the server.");
         }
     } catch (error) {
       console.error("Error storing user data or redirecting:", error);
       toast({
         variant: "destructive",
         title: "Signup Error",
         description: "Could not save your account. Please try again.",
       });
       setIsLoading(false); // Stop loading on error
     }
     // No finally block needed to set isLoading to false, as redirection occurs on success
   };

  // Prevent rendering form content on the server if seed phrase depends on client-side generation
  // Or alternatively, ensure generateSeedPhrase can run safely on server (might need crypto polyfill)
  // For now, we rely on useEffect to generate it client-side.

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/20">
        <CardHeader className="text-center p-4 sm:p-6">
          {/* Updated SVG Icon using Tailwind classes */}
          <svg
             viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
             className="mx-auto mb-2 text-primary h-10 w-10 sm:h-12 sm:w-12" // Use Tailwind for size
             aria-hidden="true"
          >
              <path d="M21 8L16 3H8L3 8V16L8 21H16L21 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Central circle representing core/node */}
               <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
              {/* Radiating lines representing connections/threads */}
              <path d="M12 3V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 18V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M21 8H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 8H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M18 16H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M3 16H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              {/* Diagonal lines for complexity */}
              <path d="M16 3L18 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 3L6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M16 21L18 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M8 21L6 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
           </svg>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">ThredX</CardTitle>
          <CardDescription className="text-sm sm:text-base">Create your secure account. Your Privacy, Our Priority.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-4 sm:p-6">
          <Form {...form}>
            {/* Pass onSubmit to the form */}
            <form onSubmit={form.handleSubmit(handleConfirmAndContinue)} className="space-y-4">

             {/* Username Input */}
             <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base">Choose a Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                         <User className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          placeholder="e.g., secure_user_123"
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

             {/* Seed Phrase Display Area */}
             <FormItem>
               <FormLabel className="text-base font-semibold">Your Secret Recovery Phrase</FormLabel>
                <Alert variant="warning" className="border-yellow-500/50 dark:border-yellow-400/40">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    <AlertTitle className="font-semibold text-yellow-700 dark:text-yellow-300">Save this phrase securely!</AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                       This is the ONLY way to recover your account. Keep it offline and safe. Never share it.
                    </AlertDescription>
                 </Alert>
               <FormControl>
                 <div className="relative rounded-md border border-input bg-secondary/30 p-3 font-mono text-sm sm:text-base break-words min-h-[100px] flex items-center justify-center">
                    {seedPhrase ? (
                       showSeedPhrase ? (
                         <span>{seedPhrase}</span>
                       ) : (
                         <span className="italic text-muted-foreground">Click the eye icon to reveal</span>
                       )
                    ) : (
                       <span className="italic text-muted-foreground">Generating...</span>
                    )}
                 </div>
               </FormControl>
                <div className="flex items-center justify-between mt-2 space-x-2">
                   <Button
                       type="button"
                       variant="ghost"
                       size="icon"
                       onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                       disabled={!seedPhrase}
                       aria-label={showSeedPhrase ? "Hide seed phrase" : "Show seed phrase"}
                     >
                       {showSeedPhrase ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                     </Button>
                     <div className="flex space-x-2">
                         <Button
                             type="button"
                             variant="outline"
                             size="sm"
                             onClick={handleGenerateSeedPhrase}
                             className="gap-1.5"
                             aria-label="Regenerate seed phrase"
                         >
                              <RefreshCw className="h-4 w-4" /> Regenerate
                          </Button>
                         <Button
                             type="button"
                             variant="outline"
                             size="sm"
                             onClick={handleCopySeedPhrase}
                             disabled={!seedPhrase}
                             className="gap-1.5"
                             aria-label="Copy seed phrase"
                         >
                           {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                           {isCopied ? 'Copied' : 'Copy'}
                         </Button>
                     </div>
                  </div>
               <FormMessage /> {/* For potential future errors */}
             </FormItem>

             {/* Confirmation Checkbox */}
             <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3 sm:p-4 shadow-sm bg-secondary/10">
                  <FormControl>
                      {/* Basic HTML checkbox for simplicity */}
                      <input
                         type="checkbox"
                         id="confirm-save"
                         checked={hasConfirmedSeed}
                         onChange={(e) => setHasConfirmedSeed(e.target.checked)}
                         className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary" // Basic styling
                         aria-required="true"
                      />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="confirm-save" className="font-medium cursor-pointer"> {/* Add cursor-pointer */}
                      I have saved my Secret Recovery Phrase securely.
                    </FormLabel>
                    {/* Use FormDescription here if needed */}
                    {/* <FormDescription>
                      Understand that losing this phrase means losing access to your account forever.
                    </FormDescription> */}
                     <p className="text-sm text-muted-foreground"> {/* Using simple <p> tag for description */}
                       Understand that losing this phrase means losing access to your account forever.
                     </p>
                  </div>
                </FormItem>

             <Button
                type="submit" // Change type to submit
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={!hasConfirmedSeed || !seedPhrase || isLoading} // Disable if not confirmed, no phrase, or loading
              >
                 {isLoading ? 'Setting up...' : 'Confirm & Create Account'}
               </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center p-4 sm:p-6 border-t border-primary/10">
           <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
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
