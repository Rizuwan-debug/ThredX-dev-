
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShieldCheck, LockKeyhole } from 'lucide-react'; // Icons

export default function NoRecoveryInfoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background to-secondary/20">
      <Card className="w-full max-w-2xl shadow-2xl border-primary/20">
        <CardHeader className="p-4 sm:p-6 border-b border-primary/10">
          <div className="flex items-center space-x-3">
             <LockKeyhole className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl sm:text-2xl font-bold">Why No Account Recovery?</CardTitle>
          </div>
          <CardDescription className="text-sm sm:text-base pt-1">Understanding ThredX's Security Model</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="space-y-3">
             <p className="text-base sm:text-lg font-semibold text-foreground">Your Privacy, Our Priority.</p>
             <p className="text-sm sm:text-base text-muted-foreground">
               ThredX is designed with a strong emphasis on user privacy and security. Unlike many platforms, we do not collect your email address or phone number. This means we have no traditional way to verify your identity if you forget your credentials.
             </p>
          </div>

           <div className="space-y-3">
             <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                <p className="text-base font-semibold text-foreground">The Power (and Responsibility) of Seed Phrases</p>
             </div>
             <p className="text-sm sm:text-base text-muted-foreground">
                Your 5-word seed phrase is the <strong>only</strong> key to your account. It's generated securely on your device and is never stored on our servers (not even in hashed form for recovery purposes in this model). This approach offers significant advantages:
             </p>
             <ul className="list-disc list-inside space-y-1 pl-2 text-sm sm:text-base text-muted-foreground">
                <li><strong>True End-to-End Encryption:</strong> Without access to your seed phrase (or keys derived from it), even we cannot decrypt your messages.</li>
                <li><strong>Resistance to Server Breaches:</strong> If our servers were ever compromised, attackers would not find user credentials like passwords or seed phrases.</li>
                <li><strong>User Control:</strong> You, and only you, hold the key to your account and data.</li>
             </ul>
           </div>

          <div className="space-y-3">
             <p className="text-base font-semibold text-foreground">The Trade-off: No Recovery</p>
             <p className="text-sm sm:text-base text-muted-foreground">
                The consequence of this high level of security and privacy is that <strong>if you lose your seed phrase, your account becomes permanently inaccessible</strong>. We simply have no mechanism to verify you are the rightful owner without it.
             </p>
             <p className="text-sm sm:text-base text-muted-foreground font-medium">
                We urge you to treat your seed phrase with extreme care. Write it down, store it securely offline in multiple locations if necessary, and never share it.
             </p>
          </div>

          <div className="mt-6 sm:mt-8 text-center">
            <Link href="/signup" passHref>
              <Button variant="outline" className="border-primary/50 hover:bg-primary/10">
                 <ArrowLeft className="mr-2 h-4 w-4" />
                 Back to Sign Up
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
