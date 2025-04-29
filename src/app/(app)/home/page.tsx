
'use client'; // Add 'use client' directive for state and event handlers

import React, { useState } from 'react'; // Import useState
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, ImagePlus, Send } from 'lucide-react'; // Added ImagePlus, Send
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { Textarea } from '@/components/ui/textarea'; // Import Textarea

// Placeholder for Home Feed functionality
// In a real app, this would fetch posts from mutual followers
const initialPosts = [
  { id: 1, username: 'mutual_friend_1', content: 'Just setting up my ThredX!', timestamp: '2 mins ago', image: 'https://picsum.photos/seed/post1/600/400' },
  { id: 2, username: 'another_friend', content: 'Privacy matters. #ThredX', timestamp: '1 hour ago' },
  { id: 3, username: 'secure_user', content: 'Exploring the encrypted world.', timestamp: '3 hours ago', image: 'https://picsum.photos/seed/post3/600/400' },
];

export default function HomePage() {
  const { toast } = useToast(); // Initialize toast
  const [postContent, setPostContent] = useState(''); // State for the post content
  const [posts, setPosts] = useState(initialPosts); // State for the posts

  // TODO: Add logic to check if user is authenticated. Redirect if not.

  const handlePostSubmit = () => {
     const trimmedContent = postContent.trim();
     if (!trimmedContent) {
        toast({
            variant: "destructive",
            title: "Cannot Post",
            description: "Post content cannot be empty.",
        });
        return;
     };

     // Placeholder: Simulate creating a post
     console.log("Posting content:", trimmedContent);

     // Add the new post to the state (for demo purposes)
     const newPost = {
        id: posts.length + 1 + Math.random(), // Simple ID generation for demo
        username: 'current_user', // Replace with actual username later
        content: trimmedContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // Simple timestamp
        image: undefined, // No image for text posts initially
     };
     // Add to the beginning of the posts array
     setPosts(prevPosts => [newPost, ...prevPosts]);

     // Clear the textarea
     setPostContent('');

     // Show confirmation toast
     toast({
        title: "Post Created (Placeholder)",
        description: `Your post "${trimmedContent.substring(0,30)}..." was created.`,
     });

     // In a real app:
     // 1. Call API to create the post.
     // 2. Update state based on response.
  };

  const handleAddMedia = () => {
      // Placeholder for adding media
      toast({
          title: "Add Media",
          description: "Media upload functionality not yet implemented.",
      });
  };

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

      {/* Post Upload Section */}
      <Card className="mb-6 shadow-md border-primary/10">
         <CardHeader>
            <CardTitle className="text-lg">Create Post</CardTitle>
         </CardHeader>
         <CardContent>
            <Textarea // Use Textarea component
                placeholder="What's on your mind? (Keep it secure!)"
                className="w-full p-2 rounded-md bg-secondary/30 border border-primary/20 focus:ring-primary/50 min-h-[100px] mb-3" // Increased min-height slightly
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
            />
            <div className="flex justify-between items-center">
                 <Button variant="ghost" size="sm" onClick={handleAddMedia} className="text-muted-foreground hover:text-foreground">
                     <ImagePlus className="mr-2 h-4 w-4" /> Add Media
                 </Button>
                <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    size="sm"
                    onClick={handlePostSubmit}
                    disabled={!postContent.trim()} // Disable if no content
                >
                    <Send className="mr-2 h-4 w-4" /> Post
                </Button>
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
            <p className="mb-4 whitespace-pre-wrap">{post.content}</p> {/* Added whitespace-pre-wrap */}
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

