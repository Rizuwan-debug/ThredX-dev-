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
import { Loader2 } from "lucide-react";
import Link from 'next/link';

// Placeholder for crypto functions - replace with actual implementation
const generateSeedPhrase = async () => "example seed phrase will be generated here";
const createUser = async (username: string, seedPhrase: string) => {
  console.log("Creating user:", username, seedPhrase);
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, this would involve hashing/salting the seed phrase
  // and storing user data securely, likely returning a session token or user ID.
  return { success: true };
};

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters.").max(20, "Username cannot exceed 20 characters."),
  seedPhrase: z.string().optional(), // Optional for initial display, required on submit if generated
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
      seedPhrase: "",
    },
  });

  const handleGenerateSeed = async () => {
    setIsLoading(true);
    try {
      const seed = await generateSeedPhrase();
      setGeneratedSeedPhrase(seed);
      form.setValue("seedPhrase", seed); // Set value in form state
      toast({
        title: "Seed Phrase Generated",
        description: "Please save your seed phrase securely. You'll need it to log in.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to generate seed phrase. Please try again.",
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
            description: "Please generate and save your seed phrase before signing up.",
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
          description: "Redirecting to login...",
        });
        // In a real app, you'd likely redirect to a protected route (e.g., /home)
        // after setting up the user session/token. For now, redirect to login.
        router.push("/login");
      } else {
        throw new Error("Signup failed");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: "Could not create account. Please try again.",
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
          <CardTitle className="text-3xl font-bold text-primary">TredX</CardTitle> {/* Updated from ThredX Lite */}
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
                <FormLabel>Seed Phrase</FormLabel>
                 <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateSeed}
                    disabled={isLoading || !!generatedSeedPhrase}
                    className="w-full border-primary/50 hover:bg-primary/10"
                  >
                   {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {generatedSeedPhrase ? "Generated" : "Generate Seed Phrase"}
                 </Button>
                 {generatedSeedPhrase && (
                   <div className="mt-2 p-3 bg-muted rounded-md border border-primary/30">
                     <p className="text-sm font-mono break-words text-foreground/80">{generatedSeedPhrase}</p>
                     <p className="text-xs text-destructive mt-2">Save this phrase securely! It's the only way to access your account.</p>
                   </div>
                 )}
                 <FormMessage />
               </FormItem>


              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || !generatedSeedPhrase}>
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
