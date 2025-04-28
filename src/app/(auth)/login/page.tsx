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
import { Textarea } from "@/components/ui/textarea"; // Use Textarea for Seed Phrase

// Placeholder for authentication function - replace with actual implementation
const authenticateUser = async (username: string, seedPhrase: string) => {
  console.log("Authenticating user:", username, seedPhrase);
  // Simulate API call & validation
  await new Promise(resolve => setTimeout(resolve, 1000));
  // In a real app, this would involve verifying the username and
  // hashed/salted seed phrase against stored credentials.
  // Return success status and potentially a session token/user data.
  if (username === "testuser" && seedPhrase === "example seed phrase will be generated here") {
      return { success: true, message: "Login successful!" };
  } else {
      return { success: false, message: "Invalid username or seed phrase." };
  }
};

const formSchema = z.object({
  username: z.string().min(1, "Username is required."),
  seedPhrase: z.string().min(10, "Seed phrase is required and seems too short."), // Basic validation
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      seedPhrase: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await authenticateUser(values.username, values.seedPhrase);
      if (result.success) {
        toast({
          title: "Login Successful",
          description: result.message,
        });
        // TODO: Implement session management (e.g., set cookie/token)
        // Redirect to a protected route (e.g., home feed)
        // For now, just show a success message. Replace with actual redirection.
        // router.push("/home"); // Example protected route
      } else {
         toast({
           variant: "destructive",
           title: "Login Failed",
           description: result.message || "Invalid username or seed phrase.",
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
        <CardHeader className="text-center">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-2 text-primary">
             {/* Reusing the same icon as Signup */}
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
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription>Login securely using your username and seed phrase.</CardDescription>
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
                      <Input placeholder="Your username" {...field} className="bg-secondary/30 border-primary/30 focus:ring-primary/50" />
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
                    <FormLabel>Seed Phrase</FormLabel>
                    <FormControl>
                      {/* Using Textarea for potentially long seed phrase */}
                      <Textarea
                        placeholder="Enter your secret seed phrase"
                        {...field}
                        className="bg-secondary/30 border-primary/30 focus:ring-primary/50 min-h-[100px] font-mono"
                        rows={3}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
