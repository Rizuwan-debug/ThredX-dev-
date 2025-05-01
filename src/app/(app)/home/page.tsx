
'use client'; // Add 'use client' directive for state and event handlers

import React, { useState, useRef, useCallback } from 'react'; // Import useState, useRef, useCallback
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, ImagePlus, Send, Loader2, X } from 'lucide-react'; // Added Loader2, X
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import Image from 'next/image'; // Import next/image

// Placeholder for Home Feed functionality
// In a real app, this would fetch posts from mutual followers
const initialPosts = [
  { id: 1, username: 'mutual_friend_1', content: 'Just setting up my ThredX!', timestamp: '2 mins ago', image: 'https://picsum.photos/seed/post1/600/400', imageHint: 'abstract background' },
  { id: 2, username: 'another_friend', content: 'Privacy matters. #ThredX', timestamp: '1 hour ago' },
  { id: 3, username: 'secure_user', content: 'Exploring the encrypted world.', timestamp: '3 hours ago', image: 'https://picsum.photos/seed/post3/600/400', imageHint: 'digital security' },
  { id: 4, username: 'tech_enthusiast', content: 'Loving the smooth UI!', timestamp: '4 hours ago'},
  { id: 5, username: 'design_guru', content: 'Clean interface design.', timestamp: '5 hours ago', image: 'https://picsum.photos/seed/post5/600/400', imageHint: 'minimalist design' },
];

const MAX_POST_LENGTH = 280; // Example character limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB example limit

export default function HomePage() {
  const { toast } = useToast(); // Initialize toast
  const [postContent, setPostContent] = useState(''); // State for the post content
  const [posts, setPosts] = useState(initialPosts); // State for the posts
  const [isPosting, setIsPosting] = useState(false); // State for posting loader
  const [imagePreview, setImagePreview] = useState<string | null>(null); // State for image preview URL
  const [imageFile, setImageFile] = useState<File | null>(null); // State for the selected image file
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref for file input

  // TODO: Add logic to check if user is authenticated. Redirect if not.

  const handlePostSubmit = useCallback(async () => {
     const trimmedContent = postContent.trim();
     if (!trimmedContent && !imageFile) {
        toast({
            variant: "destructive",
            title: "Cannot Post",
            description: "Post content or image is required.",
        });
        return;
     };
     if (trimmedContent.length > MAX_POST_LENGTH) {
        toast({
            variant: "destructive",
            title: "Post Too Long",
            description: `Posts cannot exceed ${MAX_POST_LENGTH} characters.`,
        });
        return;
     }

     setIsPosting(true);

     // Placeholder: Simulate creating a post (with potential image upload)
     console.log("Posting content:", trimmedContent, "Image:", imageFile?.name);
     await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

     // In a real app:
     // 1. If imageFile exists, upload it to secure storage (get URL).
     // 2. Call API to create the post with content and image URL (if any).
     // 3. Handle potential API errors.

     // Add the new post to the state (for demo purposes)
     const newPost = {
        id: Date.now(), // Use timestamp for unique ID in demo
        username: 'current_user', // Replace with actual username later
        content: trimmedContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // Simple timestamp
        image: imagePreview || undefined, // Use preview URL for demo
        imageHint: imageFile ? 'user uploaded' : undefined, // Add hint if applicable
     };
     // Add to the beginning of the posts array
     setPosts(prevPosts => [newPost, ...prevPosts]);

     // Clear the textarea and image preview
     setPostContent('');
     setImagePreview(null);
     setImageFile(null);
     if (fileInputRef.current) {
         fileInputRef.current.value = ''; // Reset file input
     }


     setIsPosting(false);

     // Show confirmation toast
     toast({
        title: "Post Created (Placeholder)",
        description: `Your post was created successfully.`,
     });

  }, [postContent, imageFile, imagePreview, toast]);

  const handleAddMediaClick = () => {
      fileInputRef.current?.click(); // Trigger file input click
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          if (file.size > MAX_FILE_SIZE) {
            toast({
                variant: "destructive",
                title: "File Too Large",
                description: `Image size cannot exceed ${MAX_FILE_SIZE / 1024 / 1024} MB.`,
            });
            return;
          }
          if (!file.type.startsWith('image/')) {
              toast({
                  variant: "destructive",
                  title: "Invalid File Type",
                  description: "Please select an image file (e.g., JPG, PNG, GIF).",
              });
              return;
          }
          setImageFile(file);
          // Create a preview URL
          const reader = new FileReader();
          reader.onloadend = () => {
              setImagePreview(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

   const handleRemoveImage = () => {
       setImagePreview(null);
       setImageFile(null);
       if (fileInputRef.current) {
           fileInputRef.current.value = ''; // Reset file input
       }
   };

   const charsLeft = MAX_POST_LENGTH - postContent.length;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10"> {/* Add padding bottom */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-semibold" id="main-heading">Home Feed</h1>
        <nav aria-label="User actions">
          <div className="flex space-x-2">
            <Link href="/messages" passHref legacyBehavior>
              <Button asChild variant="outline" size="icon" aria-label="Messages" className="h-9 w-9 sm:h-10 sm:w-10">
                <a><MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" /></a>
              </Button>
            </Link>
            <Link href="/settings" passHref legacyBehavior>
               <Button asChild variant="outline" size="icon" aria-label="Settings" className="h-9 w-9 sm:h-10 sm:w-10">
                 <a><Settings className="h-4 w-4 sm:h-5 sm:w-5" /></a>
               </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Post Upload Section */}
      <Card className="mb-6 shadow-md border-primary/10">
         <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg">Create Post</CardTitle>
         </CardHeader>
         <CardContent className="p-4 sm:p-6 pt-0">
            <form onSubmit={(e) => { e.preventDefault(); handlePostSubmit(); }}>
              <div className="mb-3">
                <Textarea
                    placeholder="What's on your mind? (Keep it secure!)"
                    className="w-full p-2 rounded-md bg-secondary/30 border border-primary/20 focus:ring-primary/50 min-h-[100px]" // Consistent height
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    maxLength={MAX_POST_LENGTH}
                    aria-label="New post content"
                    aria-describedby="char-count"
                />
                <p id="char-count" className={`text-xs text-right mt-1 ${charsLeft < 0 ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {charsLeft} characters remaining
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                  <div className="mb-3 relative group">
                      <Image
                          src={imagePreview}
                          alt="Selected image preview"
                          width={500} // Provide appropriate width/height or use fill
                          height={300}
                          className="rounded-lg object-cover w-full max-h-60 border border-primary/20"
                      />
                      <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity"
                          onClick={handleRemoveImage}
                          aria-label="Remove image"
                      >
                          <X className="h-4 w-4" />
                      </Button>
                  </div>
              )}

              {/* Hidden File Input */}
              <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*" // Accept only image files
                  className="hidden"
                  aria-hidden="true" // Hide from screen readers as it's triggered by button
              />

              <div className="flex justify-between items-center">
                  <Button
                     type="button" // Prevent form submission
                     variant="ghost"
                     size="sm"
                     onClick={handleAddMediaClick}
                     className="text-muted-foreground hover:text-foreground p-2"
                     aria-label="Add media to post"
                  >
                      <ImagePlus className="mr-1 sm:mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Add Media</span>
                  </Button>
                  <Button
                      type="submit" // Change to submit
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2"
                      size="sm"
                      onClick={handlePostSubmit}
                      disabled={(!postContent.trim() && !imageFile) || isPosting || postContent.length > MAX_POST_LENGTH} // Disable logic
                  >
                      {isPosting ? (
                          <Loader2 className="mr-1 sm:mr-2 h-4 w-4 animate-spin" />
                      ) : (
                          <Send className="mr-1 sm:mr-2 h-4 w-4" />
                      )}
                       Post
                  </Button>
              </div>
            </form>
         </CardContent>
      </Card>

      {/* Feed Section */}
      <section aria-labelledby="main-heading">
        {posts.map((post, index) => (
          <Card key={post.id} className="mb-4 shadow-md border-primary/10 overflow-hidden"> {/* Use mb-4 for spacing */}
            <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                 {/* Placeholder Avatar */}
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base flex-shrink-0" aria-hidden="true">
                  {post.username.substring(0, 1).toUpperCase()}
                 </div>
                 <div>
                   <p className="font-semibold text-sm sm:text-base text-foreground">{post.username}</p>
                   <p className="text-xs text-muted-foreground">{post.timestamp}</p>
                 </div>
              </div>
              {/* More options icon placeholder - Add functionality later */}
              {/* <Button variant="ghost" size="icon" aria-label={`More options for post by ${post.username}`}><MoreHorizontal className="h-4 w-4" /></Button> */}
            </CardHeader>
            <CardContent className="p-3 sm:p-4 pt-0">
              <p className="mb-3 sm:mb-4 whitespace-pre-wrap text-sm sm:text-base">{post.content}</p>
              {post.image && (
                 <div className="relative w-full aspect-w-4 aspect-h-3 sm:aspect-w-16 sm:aspect-h-9 overflow-hidden rounded-lg border border-primary/10"> {/* Aspect ratio helper */}
                     <Image
                         src={post.image}
                         alt={`Image for post by ${post.username}`}
                         fill // Use fill to make image cover the container
                         sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 600px" // Optimized sizes
                         style={{ objectFit: 'cover' }} // Ensure image covers the area
                         className="rounded-lg"
                         priority={index < 3} // Prioritize loading the first few images
                         data-ai-hint={post.imageHint || 'social media image'} // Add AI hint
                      />
                  </div>
              )}
            </CardContent>
             {/* Placeholder for like/comment actions */}
             {/* <CardFooter className="p-4 pt-2 flex justify-start space-x-4">
               <Button variant="ghost" size="sm" aria-label="Like post"><Heart className="h-4 w-4 mr-1" /> Like</Button>
               <Button variant="ghost" size="sm" aria-label="Comment on post"><MessageCircle className="h-4 w-4 mr-1" /> Comment</Button>
             </CardFooter> */}
          </Card>
        ))}

         {posts.length === 0 && !isPosting && ( // Only show if not currently posting
          <div className="text-center py-10 text-muted-foreground">
            <p>Your feed is empty.</p>
            <p>Follow some users or create your first post!</p>
             {/* Add a button to find friends later */}
          </div>
         )}
      </section>
    </div>
  );
}
