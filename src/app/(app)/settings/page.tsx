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
    router.push('/login');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-semibold">Settings</h1>

      <Card className="shadow-md border-primary/10">
        <CardHeader>
          <CardTitle>Account Management</CardTitle>
          <CardDescription>Manage your account settings and data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleDownloadData} variant="outline" className="w-full justify-start border-primary/50 hover:bg-primary/10">
            <Download className="mr-2 h-4 w-4" />
            Download Account Data
          </Button>

          <Button onClick={handleChangeSeedPhrase} variant="outline" className="w-full justify-start border-primary/50 hover:bg-primary/10">
            <KeyRound className="mr-2 h-4 w-4" />
            Change Seed Phrase (Advanced)
          </Button>

          <Button onClick={handleLogout} variant="destructive" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Add more setting sections later (e.g., Notifications, Privacy) */}
       <Card className="shadow-md border-primary/10">
         <CardHeader>
           <CardTitle>Privacy</CardTitle>
           <CardDescription>Control your privacy settings.</CardDescription>
         </CardHeader>
         <CardContent>
            <p className="text-sm text-muted-foreground">More privacy options coming soon.</p>
            {/* Placeholder for future privacy settings */}
         </CardContent>
       </Card>
    </div>
  );
}
