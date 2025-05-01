
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, KeyRound, LogOut, ShieldAlert } from 'lucide-react'; // Added ShieldAlert
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleDownloadData = () => {
    // Placeholder: Implement data download logic
    toast({ title: 'Download Requested', description: 'Generating your account data. This might take a moment.' });
    // In a real app, this would trigger a backend process to compile user data and provide a download link/file.
    // Simulate download completion
    setTimeout(() => {
        toast({ title: 'Download Ready (Placeholder)', description: 'Your data export file is ready.' });
    }, 3000);
  };

  const handleChangeSeedPhrase = () => {
    // Placeholder: Implement seed phrase change flow (requires careful security considerations)
    // This is HIGHLY sensitive and potentially dangerous if not implemented securely.
    // It should involve:
    // 1. Verifying the OLD seed phrase.
    // 2. Generating a NEW seed phrase.
    // 3. Requiring the user to CONFIRM the new phrase.
    // 4. Re-encrypting any locally stored data (if applicable) with keys derived from the new phrase.
    // 5. Updating any server-side hash derived from the seed/password (if used for auth).
    // For this demo, we just show a warning.
    toast({
        title: 'Security Critical Action',
        description: 'Changing your seed phrase is complex and risky. Feature not implemented in this demo.',
        variant: 'destructive',
        duration: 5000,
    });
  };

  const handleLogout = () => {
    // Placeholder: Implement logout logic
    // Clear demo login state from localStorage
    localStorage.removeItem('thredx_currentUser');
    localStorage.removeItem('thredx_username');
    localStorage.removeItem('thredx_seedPhrase');

    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });

    // Redirect to login page after a short delay to allow toast to be seen
    setTimeout(() => {
        router.push('/login');
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 pb-10"> {/* Add padding bottom */}
      <h1 className="text-2xl sm:text-3xl font-semibold">Settings</h1>

      <Card className="shadow-md border-primary/10">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl">Account Management</CardTitle>
          <CardDescription className="text-sm sm:text-base">Manage your account settings and data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6 pt-0">
          <Button onClick={handleDownloadData} variant="outline" className="w-full justify-start border-primary/50 hover:bg-primary/10 h-11 sm:h-10 text-base sm:text-sm">
            <Download className="mr-2 h-4 w-4" />
            Download Account Data
          </Button>

          {/* Alert Dialog for Seed Phrase Change Warning */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="w-full justify-start border-amber-500/50 hover:bg-amber-500/10 text-amber-700 dark:text-amber-400 h-11 sm:h-10 text-base sm:text-sm">
                <KeyRound className="mr-2 h-4 w-4" />
                Change Seed Phrase (Advanced)
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center">
                    <ShieldAlert className="mr-2 h-5 w-5 text-destructive" /> Security Warning
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Changing your seed phrase is a highly sensitive operation. If done incorrectly, or if you lose the new seed phrase, you could permanently lose access to your account. This feature is not fully implemented in this demo due to its complexity and security implications. Proceed with extreme caution in a real application.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                {/* In a real app, this might proceed to the actual flow */}
                <AlertDialogAction onClick={handleChangeSeedPhrase} className="bg-amber-600 hover:bg-amber-700">
                  Acknowledge Risk (Demo)
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>


          {/* Alert Dialog for Logout Confirmation */}
           <AlertDialog>
             <AlertDialogTrigger asChild>
               <Button variant="destructive" className="w-full justify-start h-11 sm:h-10 text-base sm:text-sm">
                 <LogOut className="mr-2 h-4 w-4" />
                 Logout
               </Button>
             </AlertDialogTrigger>
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                 <AlertDialogDescription>
                   Are you sure you want to log out? You will need your username and seed phrase to log back in.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                 <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">
                    Logout
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>

        </CardContent>
      </Card>

      {/* Privacy Section - Kept simple */}
       <Card className="shadow-md border-primary/10">
         <CardHeader className="p-4 sm:p-6">
           <CardTitle className="text-xl sm:text-2xl">Privacy</CardTitle>
           <CardDescription className="text-sm sm:text-base">Review privacy information.</CardDescription>
         </CardHeader>
         <CardContent className="p-4 sm:p-6 pt-0 space-y-2">
            <p className="text-sm text-muted-foreground">ThredX prioritizes your privacy. We do not store recovery information.</p>
            <Button variant="link" className="p-0 h-auto text-sm text-primary" asChild>
                <a href="/no-recovery-info" target="_blank" rel="noopener noreferrer">Learn more about our security model</a>
            </Button>
         </CardContent>
       </Card>

        {/* Placeholder for Future Settings */}
        {/*
        <Card className="shadow-md border-primary/10 opacity-50">
         <CardHeader className="p-4 sm:p-6">
           <CardTitle className="text-xl sm:text-2xl">Notifications</CardTitle>
           <CardDescription className="text-sm sm:text-base">Manage notification settings (Coming Soon).</CardDescription>
         </CardHeader>
         <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm text-muted-foreground">Notification options will appear here.</p>
         </CardContent>
       </Card>
        */}
    </div>
  );
}
