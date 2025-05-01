
'use client'; // Add 'use client' directive for state and event handlers

import React, { useState, useRef, useCallback, useEffect } from 'react'; // Import useState, useRef, useCallback, useEffect
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Settings, ImagePlus, Send, Loader2, X } from 'lucide-react'; // Added Loader2, X
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { Textarea } from '@/components/ui/textarea'; // Import Textarea
import Image from 'next/image'; // Import next/image
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton

// Placeholder for Home Feed functionality
interface Post {
    id: number;
    username: string;
    content: string;
    timestamp: string;
    image?: string;
    imageHint?: string;
}

// In a real app, this would fetch posts from mutual followers
// Simulate initial loading state
const initialPosts: Post[] = [];

const MAX_POST_LENGTH = 280; // Example character limit
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB example limit

export default function HomePage() {
  const { toast } = useToast();
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoadingFeed, setIsLoadingFeed] = useState(true); // State for initial feed loading
  const [isPosting, setIsPosting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simulate fetching initial feed data
  useEffect(() => {
      const fetchFeed = async () => {
          setIsLoadingFeed(true);
          await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
          // Demo data
          const fetchedPosts = [
            { id: 1, username: 'mutual_friend_1', content: 'Just setting up my ThredX!', timestamp: '2 mins ago', image: 'https://picsum.photos/seed/post1/600/400', imageHint: 'abstract background' },
            { id: 2, username: 'another_friend', content: 'Privacy matters. #ThredX', timestamp: '1 hour ago' },
            { id: 3, username: 'secure_user', content: 'Exploring the encrypted world.', timestamp: '3 hours ago', image: 'https://picsum.photos/seed/post3/600/400', imageHint: 'digital security' },
            { id: 4, username: 'tech_enthusiast', content: 'Loving the smooth UI!', timestamp: '4 hours ago'},
            { id: 5, username: 'design_guru', content: 'Clean interface design.', timestamp: '5 hours ago', image: 'https://picsum.photos/seed/post5/600/400', imageHint: 'minimalist design' },
          ];
          setPosts(fetchedPosts);
          setIsLoadingFeed(false);
      };
      fetchFeed();
  }, []);


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

     // Placeholder: Simulate creating a post
     console.log("Posting content:", trimmedContent, "Image:", imageFile?.name);
     await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

     // In a real app:
     // 1. If imageFile exists, upload it to secure storage (get URL).
     // 2. Call API to create the post with content and image URL (if any).
     // 3. Handle potential API errors.

     // Add the new post to the state (for demo purposes)
     const newPost: Post = {
        id: Date.now(), // Use timestamp for unique ID in demo
        username: 'current_user', // Replace with actual username later
        content: trimmedContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }), // Simple timestamp
        image: imagePreview || undefined, // Use preview URL for demo
        imageHint: imageFile ? 'user uploaded' : undefined, // Add hint if applicable
     };
     // Add to the beginning of the posts array
     setPosts(prevPosts => [newPost, ...prevPosts]);

     // Clear the form
     setPostContent('');
     setImagePreview(null);
     setImageFile(null);
     if (fileInputRef.current) {
         fileInputRef.current.value = ''; // Reset file input visually
     }

     setIsPosting(false);

     toast({
        title: "Post Created (Demo)",
        description: `Your post has been added to the feed.`,
     });

  }, [postContent, imageFile, imagePreview, toast]); // Dependencies

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
       // Reset file input value to allow selecting the same file again
       event.target.value = '';
  };

   const handleRemoveImage = () => {
       setImagePreview(null);
       setImageFile(null);
       if (fileInputRef.current) {
           fileInputRef.current.value = ''; // Reset file input visually
       }
   };

   const charsLeft = MAX_POST_LENGTH - postContent.length;
   const isPostButtonDisabled = (!postContent.trim() && !imageFile) || isPosting || postContent.length > MAX_POST_LENGTH;

   // Skeleton Loader for Posts
   const PostSkeleton = () => (
     <Card className="mb-4 shadow-md border-primary/10 overflow-hidden">
       <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
         <div className="flex items-center space-x-2 sm:space-x-3">
           <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
           <div className="space-y-1">
             <Skeleton className="h-4 w-24" />
             <Skeleton className="h-3 w-16" />
           </div>
         </div>
       </CardHeader>
       <CardContent className="p-3 sm:p-4 pt-0 space-y-2">
         <Skeleton className="h-4 w-full" />
         <Skeleton className="h-4 w-5/6" />
         <Skeleton className="aspect-video w-full rounded-lg" /> {/* Image placeholder */}
       </CardContent>
     </Card>
   );


  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-10"> {/* Add padding bottom */}
      <div className="flex justify-between items-center mb-6 px-1 sm:px-0">
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
            {/* Use form tag for better semantics and potential future enhancements */}
            <form onSubmit={(e) => { e.preventDefault(); handlePostSubmit(); }}>
              <div className="mb-3">
                <Textarea
                    placeholder="What's on your mind? (Keep it secure!)"
                    className="w-full p-2 rounded-md bg-secondary/30 border border-primary/20 focus:ring-primary/50 min-h-[100px] resize-none" // Added resize-none
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    maxLength={MAX_POST_LENGTH}
                    aria-label="New post content"
                    aria-describedby="char-count"
                />
                <p id="char-count" className={`text-xs text-right mt-1 ${charsLeft < 0 ? 'text-destructive' : 'text-muted-foreground'}`} aria-live="polite">
                    {charsLeft} characters remaining
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                  <div className="mb-3 relative group aspect-video max-h-60 w-full"> {/* Added aspect ratio */}
                      <Image
                          src={imagePreview}
                          alt="Selected image preview"
                          fill // Use fill and parent aspect ratio
                          sizes="(max-width: 768px) 100vw, 600px" // Responsive sizes
                          className="rounded-lg object-cover border border-primary/20"
                      />
                      <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-7 w-7 opacity-70 group-hover:opacity-100 transition-opacity z-10"
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
                  aria-hidden="true"
              />

              <div className="flex justify-between items-center mt-3">
                  <Button
                     type="button" // Ensure it doesn't submit form
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
                      type="submit" // Submit button
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-1.5 sm:px-4 sm:py-2"
                      size="sm"
                      // Removed onClick here, handled by form onSubmit
                      disabled={isPostButtonDisabled}
                      aria-disabled={isPostButtonDisabled}
                  >
                      {isPosting ? (
                          <Loader2 className="mr-1 sm:mr-2 h-4 w-4 animate-spin" aria-label="Posting..." />
                      ) : (
                          <Send className="mr-1 sm:mr-2 h-4 w-4" aria-hidden="true" />
                      )}
                       Post
                  </Button>
              </div>
            </form>
         </CardContent>
      </Card>

      {/* Feed Section */}
      <section aria-labelledby="main-heading">
        {isLoadingFeed ? (
            // Show skeleton loaders while feed is loading
            <>
             <PostSkeleton />
             <PostSkeleton />
             <PostSkeleton />
            </>
        ) : posts.length > 0 ? (
            // Display posts once loaded
            posts.map((post, index) => (
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
                  {/* Use min-h to prevent collapse if content is short */}
                  <p className="mb-3 sm:mb-4 whitespace-pre-wrap text-sm sm:text-base min-h-[20px]">{post.content}</p>
                  {post.image && (
                     <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-primary/10"> {/* Aspect ratio */}
                         <Image
                             src={post.image}
                             alt={`Image for post by ${post.username}`}
                             fill // Use fill to make image cover the container
                             sizes="(max-width: 640px) 90vw, (max-width: 768px) 80vw, 600px" // Optimized sizes
                             style={{ objectFit: 'cover' }} // Ensure image covers the area
                             className="rounded-lg"
                             priority={index < 3} // Prioritize loading the first few images
                             data-ai-hint={post.imageHint || 'social media image'} // Add AI hint
                             // Handle potential loading errors
                             onError={(e) => (e.currentTarget.style.display = 'none')} // Hide if image fails
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
            ))
        ) : (
            // Show empty feed message if no posts and not loading
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
