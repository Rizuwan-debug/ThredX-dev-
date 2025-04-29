
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, KeyRound, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const { toast } = useToast();
  const router = useRouter();

  const handleDownloadData = () => {
    // Placeholder: Implement data download logic
    toast({ title: 'Download Started', description: 'Your account data download will begin shortly.' });
    // In a real app, this would trigger a backend process to compile user data.
  };

  const handleChangeSeedPhrase = () => {
    // Placeholder: Implement seed phrase change flow (requires careful security considerations)
    toast({ title: 'Security Alert', description: 'Changing your seed phrase is a sensitive operation. Proceed with caution.', variant: 'destructive' });
    // This would likely involve verifying the old seed phrase and generating/confirming a new one.
    // It's complex and needs robust security.
  };

  const handleLogout = () => {
    // Placeholder: Implement logout logic
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    // Clear session/token, redirect to login page.
    // Clear demo login state
    localStorage.removeItem('thredx_currentUser');
    localStorage.removeItem('thredx_username'); // Clear potentially stored insecure demo data
    localStorage.removeItem('thredx_seedPhrase'); // Clear potentially stored insecure demo data

    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
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

          <Button onClick={handleChangeSeedPhrase} variant="outline" className="w-full justify-start border-primary/50 hover:bg-primary/10 h-11 sm:h-10 text-base sm:text-sm">
            <KeyRound className="mr-2 h-4 w-4" />
            Change Seed Phrase (Advanced)
          </Button>

          <Button onClick={handleLogout} variant="destructive" className="w-full justify-start h-11 sm:h-10 text-base sm:text-sm">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Add more setting sections later (e.g., Notifications, Privacy) */}
       <Card className="shadow-md border-primary/10">
         <CardHeader className="p-4 sm:p-6">
           <CardTitle className="text-xl sm:text-2xl">Privacy</CardTitle>
           <CardDescription className="text-sm sm:text-base">Control your privacy settings.</CardDescription>
         </CardHeader>
         <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-sm text-muted-foreground">More privacy options coming soon.</p>
            {/* Placeholder for future privacy settings */}
         </CardContent>
       </Card>
    </div>
  );
}
