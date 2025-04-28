import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings } from 'lucide-react';
import Link from 'next/link';

// Placeholder for Home Feed functionality
// In a real app, this would fetch posts from mutual followers
const posts = [
  { id: 1, username: 'mutual_friend_1', content: 'Just setting up my TredX!', timestamp: '2 mins ago', image: 'https://picsum.photos/seed/post1/600/400' }, // Updated ThredX
  { id: 2, username: 'another_friend', content: 'Privacy matters. #TredX', timestamp: '1 hour ago' }, // Updated ThredX
  { id: 3, username: 'secure_user', content: 'Exploring the encrypted world.', timestamp: '3 hours ago', image: 'https://picsum.photos/seed/post3/600/400' },
];

export default function HomePage() {
  // TODO: Add logic to check if user is authenticated. Redirect if not.

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Home Feed</h1>
        <div className="flex space-x-2">
          <Link href="/messages" passHref>
             <Button variant="outline" size="icon" aria-label="Messages">
               <MessageSquare className="h-5 w-5" />
             </Button>
          </Link>
          <Link href="/settings" passHref>
             <Button variant="outline" size="icon" aria-label="Settings">
               <Settings className="h-5 w-5" />
             </Button>
          </Link>
        </div>
      </div>

      {/* Placeholder Post Upload Section */}
      <Card className="mb-6 shadow-md border-primary/10">
         <CardHeader>
            <CardTitle className="text-lg">Create Post</CardTitle>
         </CardHeader>
         <CardContent>
            <textarea
                placeholder="What's on your mind? (Keep it secure!)"
                className="w-full p-2 rounded-md bg-secondary/30 border border-primary/20 focus:ring-primary/50 min-h-[80px] mb-2"
            />
            <div className="flex justify-end space-x-2">
                {/* Add buttons for Image/Video upload later */}
                <Button variant="ghost" size="sm">Add Media</Button>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground" size="sm">Post</Button>
            </div>
         </CardContent>
      </Card>


      {posts.map((post) => (
        <Card key={post.id} className="shadow-md border-primary/10 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4">
            <div className="flex items-center space-x-3">
               {/* Placeholder Avatar */}
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                {post.username.substring(0, 1).toUpperCase()}
               </div>
               <div>
                 <p className="font-semibold text-foreground">{post.username}</p>
                 <p className="text-xs text-muted-foreground">{post.timestamp}</p>
               </div>
            </div>
            {/* More options icon placeholder */}
            {/* <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button> */}
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <p className="mb-4">{post.content}</p>
            {post.image && (
               <img src={post.image} alt="Post image" className="rounded-lg w-full object-cover aspect-video border border-primary/10"/>
            )}
          </CardContent>
           {/* Placeholder for like/comment actions */}
           {/* <CardFooter className="p-4 pt-2 flex justify-start space-x-4">
             <Button variant="ghost" size="sm"><Heart className="h-4 w-4 mr-1" /> Like</Button>
             <Button variant="ghost" size="sm"><MessageCircle className="h-4 w-4 mr-1" /> Comment</Button>
           </CardFooter> */}
        </Card>
      ))}

       {posts.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          <p>Your feed is empty.</p>
          <p>Follow some users to see their posts here.</p>
           {/* Add a button to find friends later */}
        </div>
       )}
    </div>
  );
}
