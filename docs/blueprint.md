# **App Name**: ThredX Lite

## Core Features:

- Seed Auth: Username/Seed Phrase based authentication for sign-up and login.  No email or phone number required.
- E2EE Messaging: End-to-end encrypted messaging between mutual followers using libsodium, crypto-js, or the Web Crypto API.
- Loading Bar: A loading bar at the top of the screen, similar to YouTube or Instagram, to indicate content loading progress.

## Style Guidelines:

- Background color: Dark Navy Blue (#0A0E1A) for a premium feel.
- Accent color: Bright Orange (#F76400) for interactive elements and highlights.
- Mobile-first design with a modern, fluid, touch-friendly interface similar to Instagram.
- Use Framer Motion for smooth and subtle animations throughout the platform.
- Minimal and clean icons for navigation and actions.

## Original User Request:
📑 Development Brief for ThredX Platform
📌 Project Name:
ThredX

🎯 Project Vision:
Build a privacy-first, end-to-end encrypted social platform where users can message and share securely — combining the feel of Instagram and WhatsApp, but without compromising privacy.

🏷️ Tagline:
"Your Privacy, Our Priority."

🌟 Core Requirements:
Privacy Focused:
No email sign-up. Only Username + Seed Phrase based sign-up and login.

End-to-End Encryption:
All messaging, media, and interactions must be encrypted on both ends.

No Public Profiles:
Only mutual-follow users can see each other.
No public browsing or searching without mutual consent.

Data & Battery Efficiency:
Ultra-lightweight backend and frontend to save user data, bandwidth, and battery life.

Platform Compatibility:

Phone (Mobile-first design):
UI and UX similar to Instagram (modern, fluid, touch-friendly).
Smooth, intuitive navigation.

PC Browsers:
Proper optimization for desktop use.
Auto-responsive design for larger screens.

Loading Bar:
Add a simple horizontal loading line at the top or bottom of the screen (similar to YouTube or Instagram progress indicators).

📋 Features to Implement:
Sign Up / Login Page:
Only username and seed phrase (no emails or numbers).

Home Feed:
Posts from mutual followers only.

Messaging (DMs):
End-to-end encrypted chat with only mutual followers.

Profile:
Minimal private profiles visible only to mutual connections.

Post Upload:
Text, Images, and maybe lightweight Videos.

Notification System:
Only from mutual connections.

Search:
Only search users that already follow each other (mutual).

Settings Page:

Download account data.

Logout.

Change seed phrase.

🛠️ Technology Stack:
Frontend:
React + Next.js (latest version)

TailwindCSS for styling.

Framer Motion for smooth animations.

Shadcn/ui or similar for components (recommended).

Backend:
Firebase for initial rapid development (can migrate later).

Firestore DB.

Firebase Storage for media.

Firebase Auth (Customized for username/seed only).

Encryption:
Use libraries like libsodium, crypto-js, or native Web Crypto API.

📥 Assets Provided:
Official Logo:
(Attached as "logo.png" — to be used for favicon, navbar branding, loading screens, splash screens, etc.)

Logo Preview:
(You can insert it in your documentation or loading screen)

![logo](attachment link here when you upload)

Brand Colors:

Background: #0A0E1A (Dark Navy Blue)

Accent: #F76400 (Bright Orange)

Typography:

Simple, clean sans-serif fonts. (Example: Inter, Roboto, or custom lightweight font).

📦 Deliverables:
Fully responsive ThredX platform.

Working E2EE chat system.

Deployment-ready build.

All source code properly documented and commented.

GitHub repository (or private delivery via zip).

Instructions for setting up on hosting.

📜 Important Notes:
Design should feel premium and minimal.

Avoid bloat. Focus on core functionality first.

Prioritize security over fancy features.

Future scalability should be considered (easy to expand features later).

Keep file sizes light for faster mobile loading.

🚀 Let’s Build ThredX:
A Modern, Secure, and Private Social Platform.
  