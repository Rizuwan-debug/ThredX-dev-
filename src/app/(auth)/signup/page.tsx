
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
import { Loader2, AlertTriangle, Copy } from "lucide-react"; // Added AlertTriangle, Copy
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert components

// Ensure Buffer is available globally for bip39
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}


// Function to generate 5 unique random words securely using BIP39 standard wordlist
const generateSeedPhrase = async (): Promise<string> => {
    try {
        // Generate a 128-bit entropy (enough for 12 words, but we'll pick 5)
        const entropy = await bip39.generateMnemonic(128);
        const words = entropy.split(' ');

        // Select 5 unique words randomly from the generated 12
        const selectedWords = new Set<string>();
        while (selectedWords.size < 5 && words.length > 0) {
            const randomIndex = Math.floor(Math.random() * words.length);
            selectedWords.add(words.splice(randomIndex, 1)[0]); // Remove the word after selection
        }

        if (selectedWords.size !== 5) {
          // Fallback or error handling if somehow we couldn't get 5 unique words
          // This is highly unlikely with 12 words from BIP39 list
          console.error("Could not generate 5 unique words, using simple random selection as fallback");
          const fallbackWords = new Set<string>();
          const wordList = bip39.wordlists.english; // Use the standard list
          while (fallbackWords.size < 5) {
              const randomIndex = Math.floor(Math.random() * wordList.length);
              fallbackWords.add(wordList[randomIndex]);
          }
          return Array.from(fallbackWords).join(' ');
        }

        return Array.from(selectedWords).join(' '); // Return 5 unique words separated by space

    } catch (error) {
        console.error("Error generating BIP39 mnemonic:", error);
        // Provide a fallback or re-throw the error
         throw new Error("Failed to generate secure seed phrase.");
    }
};


// Placeholder for user creation - replace with actual implementation
const createUser = async (username: string, seedPhrase: string /* This is now 5 words */) => {
  console.log("Creating user:", username);
  // WARNING: In a real application:
  // 1. DO NOT log the seed phrase.
  // 2. Use the seed phrase (possibly with a user password as salt/pepper)
  //    to generate cryptographic keys (e.g., using PBKDF2 or Argon2).
  // 3. Store a HASH of a derived key or password, NEVER the seed phrase itself.
  // 4. The seed phrase is for the *user* to keep, not for the server to store plaintext.
  // This function simulates an API call.
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate checking if username exists (replace with actual check)
  if (localStorage.getItem('thredx_username') === username) { // Simple check for demo
      return { success: false, message: 'Username already taken.' };
  }

  // **DEMO ONLY**: Store username and seed phrase in localStorage.
  // **NEVER DO THIS IN PRODUCTION!** Seed phrases should *never* be stored by the application.
  localStorage.setItem('thredx_username', username);
  localStorage.setItem('thredx_seedPhrase', seedPhrase); // VERY INSECURE - FOR DEMO ONLY

  return { success: true, message: 'Account created successfully!' };
};

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(20, "Username cannot exceed 20 characters."),
  // Seed phrase is generated, not input directly by user initially
  seedPhrase: z.string().optional(),
});

type SignupFormValues = z.infer<typeof formSchema>;

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSeedPhrase, setGeneratedSeedPhrase] = useState<string | null>(null);

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      seedPhrase: "", // Initially empty
    },
  });

  const handleGenerateSeed = async () => {
    setIsLoading(true);
    try {
      const seed = await generateSeedPhrase();
      setGeneratedSeedPhrase(seed);
      form.setValue("seedPhrase", seed); // Store generated phrase in form state
      toast({
        title: "Seed Phrase Generated - IMPORTANT!",
        description: "Please copy and save these 5 words securely OFFLINE. You WILL need them to log in.",
        variant: "default",
        duration: 15000, // Increased duration
      });
    } catch (error) {
      console.error("Seed generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Seed",
        description: (error as Error).message || "Failed to generate seed phrase. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySeed = () => {
    if (generatedSeedPhrase) {
      navigator.clipboard.writeText(generatedSeedPhrase)
        .then(() => {
          toast({ title: 'Copied!', description: 'Seed phrase copied to clipboard. Make sure to save it securely offline.' });
        })
        .catch(err => {
          console.error('Failed to copy seed phrase: ', err);
          toast({ variant: 'destructive', title: 'Copy Failed', description: 'Could not copy seed phrase to clipboard.' });
        });
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
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
      // Use the generated seed phrase explicitly for user creation
      const result = await createUser(values.username, generatedSeedPhrase);
      if (result.success) {
        toast({
          title: "Signup Successful",
          description: "Remember to keep your seed phrase safe! Redirecting to login...",
        });
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
          {/* Removed sm:width and sm:height attributes */}
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-primary">
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
                      <Input placeholder="Choose a unique username" {...field} className="bg-secondary/30 border-primary/30 focus:ring-primary/50 h-11 sm:h-10"/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormItem>
                 <FormLabel>Seed Phrase (Keep this SAFE!)</FormLabel>
                 <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSeed}
                    disabled={isLoading || !!generatedSeedPhrase} // Disable if loading or already generated
                    className="w-full border-primary/50 hover:bg-primary/10 h-11 sm:h-10 text-base sm:text-sm"
                  >
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {generatedSeedPhrase ? "Seed Phrase Generated" : "Generate 5-Word Seed"}
                 </Button>

                 {/* Display the generated seed phrase */}
                 {generatedSeedPhrase && (
                    <div className="mt-2 space-y-2">
                       <div className="relative p-3 bg-muted rounded-md border border-primary/30 group">
                          <p className="text-base sm:text-lg font-semibold tracking-wider text-center text-foreground/90 break-words">{generatedSeedPhrase}</p>
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
                       </div>
                        {/* Updated Warning */}
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
                  {/* FormMessage for the seedPhrase field (e.g., if validation was added) */}
                 <FormMessage>{form.formState.errors.seedPhrase?.message}</FormMessage>
               </FormItem>


              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-11 sm:h-10 text-base sm:text-sm"
                disabled={isLoading || !generatedSeedPhrase} // Disable submit until seed is generated
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

