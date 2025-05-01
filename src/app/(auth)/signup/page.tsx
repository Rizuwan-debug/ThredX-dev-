
"use client";

import { useState, useEffect } from "react"; // Added useEffect
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Buffer } from 'buffer'; // Import Buffer
import * as bip39 from 'bip39'; // Import bip39

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
import { Loader2, AlertTriangle, Copy, RefreshCw } from "lucide-react"; // Added RefreshCw
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert components

// Ensure Buffer is available globally for bip39 on the client
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}


// Function to generate 5 unique random words securely using BIP39 standard wordlist
// This function should only be called client-side.
const generateSeedPhrase = (): string => {
    try {
        // Generate a 128-bit entropy (results in 12 words)
        const mnemonic = bip39.generateMnemonic(128); // Standard BIP39 generation
        const words = mnemonic.split(' ');

        // Select 5 unique words randomly from the generated 12
        const selectedWords = new Set<string>();
        const availableWords = [...words]; // Clone array for manipulation

        while (selectedWords.size < 5 && availableWords.length > 0) {
            const randomIndex = Math.floor(Math.random() * availableWords.length);
            selectedWords.add(availableWords.splice(randomIndex, 1)[0]); // Remove the word after selection
        }

        // This check is highly unlikely to fail with 12 unique words, but good practice
        if (selectedWords.size !== 5) {
          console.error("Could not generate 5 unique words from 12, something is wrong.");
          // Fallback: Just take the first 5 words (less random but ensures 5 words)
           return words.slice(0, 5).join(' ');
        }

        return Array.from(selectedWords).join(' '); // Return 5 unique words separated by space

    } catch (error) {
        console.error("Error generating BIP39 mnemonic:", error);
        // Rethrow or handle more gracefully, maybe show an error to the user
         throw new Error("Failed to generate secure seed phrase. Please try refreshing.");
    }
};


// Placeholder for user creation - Runs client-side due to localStorage access
const createUser = async (username: string, seedPhrase: string): Promise<{ success: boolean; message: string }> => {
  console.log("Creating user (DEMO):", username);
  // WARNING: In a real application:
  // 1. DO NOT log the seed phrase.
  // 2. Use the seed phrase (possibly with a user password as salt/pepper)
  //    to generate cryptographic keys (e.g., using PBKDF2 or Argon2).
  // 3. Store a HASH of a derived key or password, NEVER the seed phrase itself.
  // 4. The seed phrase is for the *user* to keep, not for the server to store plaintext.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

  // Simulate checking if username exists (replace with actual backend check)
  if (localStorage.getItem('thredx_username') === username) { // Simple check for demo
      return { success: false, message: 'Username already taken (Demo check).' };
  }

  // **DEMO ONLY**: Store username and seed phrase in localStorage.
  // **NEVER DO THIS IN PRODUCTION!** Seed phrases should *never* be stored by the application.
  localStorage.setItem('thredx_username', username);
  localStorage.setItem('thredx_seedPhrase', seedPhrase); // VERY INSECURE - FOR DEMO ONLY
  console.log("Demo user data stored in localStorage.");

  return { success: true, message: 'Account created successfully! (Demo Mode)' };
};

// Username validation
const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(20, "Username cannot exceed 20 characters."),
  // Seed phrase is handled separately, not part of direct form input validation here
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSeedPhrase, setGeneratedSeedPhrase] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false); // Track client-side mount

  useEffect(() => {
    // Set isClient to true once the component mounts on the client
    setIsClient(true);
    // Optionally, pre-generate seed phrase on mount if desired
    // handleGenerateSeed();
  }, []);


  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const handleGenerateSeed = () => {
    if (!isClient) return; // Ensure this runs only client-side

    setIsLoading(true); // Indicate loading state
    setGeneratedSeedPhrase(null); // Clear previous seed first
    try {
      const seed = generateSeedPhrase(); // Generate new seed
      setGeneratedSeedPhrase(seed);
      toast({
        title: "Seed Phrase Generated - IMPORTANT!",
        description: "Copy and save these 5 words securely OFFLINE. This is the ONLY way to log in.",
        variant: "default",
        duration: 15000, // Long duration for user to read
      });
    } catch (error) {
      console.error("Seed generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Seed",
        description: (error as Error).message || "Failed to generate seed phrase. Please try again.",
      });
    } finally {
      setIsLoading(false); // Finish loading state
    }
  };

  const handleCopySeed = () => {
    if (generatedSeedPhrase && navigator.clipboard) {
      navigator.clipboard.writeText(generatedSeedPhrase)
        .then(() => {
          toast({ title: 'Copied!', description: 'Seed phrase copied. Save it securely offline now!' });
        })
        .catch(err => {
          console.error('Failed to copy seed phrase: ', err);
          toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy seed phrase. Please copy manually.' });
        });
    } else if (!navigator.clipboard) {
         toast({ variant: 'warning', title: 'Copy Unavailable', description: 'Clipboard API not available. Please copy manually.' });
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    if (!isClient) return; // Prevent submission during SSR

    if (!generatedSeedPhrase) {
        toast({
            variant: "destructive",
            title: "Seed Phrase Required",
            description: "Please generate and save your 5-word seed phrase before signing up.",
        });
        return;
    }

    setIsLoading(true);
    try {
      // Call client-side createUser function
      const result = await createUser(values.username, generatedSeedPhrase);
      if (result.success) {
        toast({
          title: "Signup Successful",
          description: "Remember to keep your seed phrase safe! Redirecting to login...",
        });
        // Clear sensitive demo data from state after signup (optional)
        // setGeneratedSeedPhrase(null);
        router.push("/login");
      } else {
         toast({
            variant: "destructive",
            title: "Signup Failed",
            description: result.message || "Could not create account. Please try again.",
         });
      }
    } catch (error) {
       console.error("Signup submission error:", error);
       toast({
        variant: "destructive",
        title: "Signup Error",
        description: "An unexpected error occurred during signup. Please try again.",
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
          {/* SVG Icon */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-primary h-10 w-10 sm:h-12 sm:w-12" aria-hidden="true">
             <path d="M21 8L16 3H8L3 8V16L8 21H16L21 16V8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2"/>
             {/* Decorative paths simplified */}
             <path d="M12 3V6 M12 18V21 M21 8H18 M6 8H3 M18 16H21 M3 16H6 M16 3L18 5 M8 3L6 5 M16 21L18 19 M8 21L6 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-primary">ThredX</CardTitle>
          <CardDescription className="text-sm sm:text-base">Create your secure account. Your Privacy, Our Priority.</CardDescription>
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
                      <Input placeholder="Choose a unique username" {...field} className="bg-secondary/30 border-primary/30 focus:ring-primary/50 h-11 sm:h-10" aria-required="true" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormItem>
                 <FormLabel>Your Unique 5-Word Seed Phrase</FormLabel>
                 <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <div className="relative flex-grow w-full p-3 bg-muted rounded-md border border-primary/30 group min-h-[60px] flex items-center justify-center">
                        {isLoading && !generatedSeedPhrase ? (
                             <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        ) : generatedSeedPhrase ? (
                             <p className="text-base sm:text-lg font-semibold tracking-wider text-center text-foreground/90 break-words" aria-live="polite">
                                {generatedSeedPhrase}
                             </p>
                        ) : (
                            <span className="text-sm text-muted-foreground">Click "Generate"</span>
                        )}
                        {generatedSeedPhrase && (
                             <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 h-7 w-7 opacity-50 group-hover:opacity-100 transition-opacity"
                                onClick={handleCopySeed}
                                aria-label="Copy seed phrase"
                             >
                                <Copy className="h-4 w-4" />
                             </Button>
                        )}
                    </div>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleGenerateSeed}
                        disabled={!isClient || isLoading} // Disable if not client or loading
                        className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 h-11 sm:h-10 text-base sm:text-sm flex-shrink-0 px-3"
                        aria-label={generatedSeedPhrase ? "Regenerate seed phrase" : "Generate seed phrase"}
                    >
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span className="ml-2">{generatedSeedPhrase ? "Regenerate" : "Generate"}</span>
                    </Button>
                 </div>

                 {/* Display the warning only after generation */}
                 {generatedSeedPhrase && (
                    <div className="mt-3 space-y-2">
                        <Alert variant="destructive" className="p-3 sm:p-4">
                           <AlertTriangle className="h-4 w-4" />
                           <AlertTitle className="text-sm sm:text-base font-bold">EXTREMELY IMPORTANT</AlertTitle>
                           <AlertDescription className="text-xs sm:text-sm">
                             <strong>Save this 5-word seed phrase securely OFFLINE immediately.</strong> This is the ONLY way to access your account.
                             <br />
                             <strong>If you lose this phrase, YOUR ACCOUNT CANNOT BE RECOVERED.</strong> We do not store it and cannot help you regain access.
                             <br />
                             Treat it like your most valuable physical key. Do not share it with anyone.
                           </AlertDescription>
                       </Alert>
                    </div>
                 )}
                 {/* FormMessage can be used if needed, but seed isn't directly validated here */}
                 {/* <FormMessage /> */}
               </FormItem>


              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-10 text-base sm:text-sm"
                // Disable submit until seed is generated and not loading, and client-side
                disabled={!isClient || isLoading || !generatedSeedPhrase}
               >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Login
            </Link>
          </p>
           {/* Link to information about why there's no recovery */}
           <p className="mt-4 text-center text-xs text-muted-foreground">
             Why no account recovery?{' '}
             <Link href="/no-recovery-info" className="underline hover:text-primary">
               Learn more
             </Link>
           </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
