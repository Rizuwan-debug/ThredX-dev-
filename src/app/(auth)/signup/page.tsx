
"use client";

import { useState } from "react";
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
import { Loader2, AlertTriangle } from "lucide-react"; // Added AlertTriangle
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Added Alert components

// Placeholder for crypto functions - replace with actual implementation
// WARNING: This generates a secure random HEX STRING, not a standard BIP39 word-based seed phrase.
// For a production application, use a dedicated library like 'bip39' to generate
// mnemonic phrases according to the standard.
const generateSeedPhrase = async (): Promise<string> => {
  try {
    // Generate 16 bytes (128 bits) of random entropy
    const entropy = new Uint8Array(16);
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
       window.crypto.getRandomValues(entropy);
    } else {
        // Fallback for environments without window.crypto (e.g., SSR, though this is 'use client')
        // This fallback is NOT cryptographically secure for production.
        console.warn("window.crypto.getRandomValues not available. Using insecure fallback for seed generation.");
        for (let i = 0; i < entropy.length; i++) {
            entropy[i] = Math.floor(Math.random() * 256);
        }
    }


    // Convert bytes to a hex string
    const hexPhrase = Array.from(entropy)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');

    // In a real BIP39 implementation, these bytes would be used
    // with a wordlist and checksum calculation.
    // Returning hex for now as a placeholder for secure random data.
    return hexPhrase;
  } catch (error) {
    console.error("Error generating secure random data:", error);
    // Fallback or throw error - essential for security
    throw new Error("Could not generate secure seed data. Crypto API might not be available or failed.");
  }
};

// Placeholder for user creation - replace with actual implementation
const createUser = async (username: string, seedPhrase: string /* This is currently hex */) => {
  console.log("Creating user:", username);
  // WARNING: In a real application:
  // 1. DO NOT log the seed phrase/hex.
  // 2. Use the *original entropy* (derived from the seed phrase if using BIP39)
  //    to generate cryptographic keys (e.g., using PBKDF2 or Argon2 with the seed as input).
  // 3. Store a HASH of a derived key or password, NEVER the seed phrase/hex itself.
  // 4. The seed phrase is for the *user* to keep, not for the server to store plaintext.
  // This function simulates an API call.
  await new Promise(resolve => setTimeout(resolve, 1000));
  // Simulate checking if username exists (replace with actual check)
  if (username === 'existinguser') {
      return { success: false, message: 'Username already taken.' };
  }
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
      form.setValue("seedPhrase", seed); // Store generated hex in form state (though not directly used for validation here)
      toast({
        title: "Seed Phrase (Hex) Generated",
        description: "Please copy and save this hexadecimal string securely. You WILL need it to log in. Treat it like a password.",
        variant: "default", // Use default or a custom variant if needed
        duration: 9000, // Give more time to read/copy
      });
    } catch (error) {
      console.error("Seed generation failed:", error);
      toast({
        variant: "destructive",
        title: "Error Generating Seed",
        description: (error as Error).message || "Failed to generate secure seed data. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: SignupFormValues) => {
    if (!generatedSeedPhrase) {
        toast({
            variant: "destructive",
            title: "Seed Phrase Required",
            description: "Please generate and save your hexadecimal seed phrase before signing up.",
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
          description: result.message || "Redirecting to login...",
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
        <CardHeader className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-primary">
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
          <CardTitle className="text-3xl font-bold text-primary">ThredX</CardTitle>
          <CardDescription>Create your secure account. Your Privacy, Our Priority.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Choose a unique username" {...field} className="bg-secondary/30 border-primary/30 focus:ring-primary/50"/>
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
                    className="w-full border-primary/50 hover:bg-primary/10"
                  >
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {generatedSeedPhrase ? "Seed Generated (Hex)" : "Generate Secure Seed"}
                 </Button>

                 {/* Display the generated seed phrase */}
                 {generatedSeedPhrase && (
                    <div className="mt-2 space-y-2">
                       <div className="p-3 bg-muted rounded-md border border-primary/30">
                          <p className="text-sm font-mono break-words text-foreground/80">{generatedSeedPhrase}</p>
                       </div>
                        <Alert variant="destructive">
                           <AlertTriangle className="h-4 w-4" />
                           <AlertTitle>Critical Security Warning</AlertTitle>
                           <AlertDescription>
                             <strong>Save this hexadecimal seed phrase securely NOW.</strong> Store it offline, like on paper or a hardware wallet.
                             Anyone with this phrase can access your account. <strong>There is NO recovery if you lose it.</strong> Treat it like your most valuable password.
                           </AlertDescription>
                       </Alert>
                         <Alert variant="default" className="border-yellow-500/50 text-yellow-700 dark:text-yellow-300 dark:border-yellow-400/40">
                            <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <AlertTitle>Developer Note</AlertTitle>
                            <AlertDescription>
                                This is a secure hex string for demo purposes. A production app should use a standard word-based BIP39 mnemonic phrase generated from secure entropy for better usability and compatibility.
                            </AlertDescription>
                        </Alert>
                    </div>
                 )}
                  {/* FormMessage for the seedPhrase field (e.g., if validation was added) */}
                 <FormMessage>{form.formState.errors.seedPhrase?.message}</FormMessage>
               </FormItem>


              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
