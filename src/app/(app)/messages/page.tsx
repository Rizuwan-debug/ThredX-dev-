
'use client'; // Add 'use client' directive for state and event handlers

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'; // Import hooks
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, PanelLeftOpen, MessageSquare, Loader2, User, Users } from 'lucide-react'; // Added User, Users
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { cn } from '@/lib/utils'; // Import cn for conditional classes
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton for loading state

// --- Mock Data Structure ---
interface Message {
  id: number | string; // Allow string for optimistic IDs
  sender: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  username: string;
  lastMessage: string;
  unread: number;
  avatarInitial: string;
  isOnline?: boolean; // Added online status indicator
}

// Increased mock data variety and added isOnline status
const conversations: Conversation[] = [
  { id: 1, username: 'mutual_friend_1', lastMessage: 'Hey! How are you?', unread: 2, avatarInitial: 'M', isOnline: true },
  { id: 2, username: 'another_friend', lastMessage: 'Check out this encrypted message!', unread: 0, avatarInitial: 'A', isOnline: false },
  { id: 3, username: 'long_username_test', lastMessage: 'This is a very long last message...', unread: 1, avatarInitial: 'L', isOnline: true },
  { id: 4, username: 'test_user_4', lastMessage: 'Short message.', unread: 0, avatarInitial: 'T', isOnline: false },
  { id: 5, username: 'secure_chat', lastMessage: 'Encrypted talk!', unread: 3, avatarInitial: 'S', isOnline: true },
  { id: 6, username: 'dev_team_group', lastMessage: 'Meeting at 3 PM?', unread: 0, avatarInitial: 'D', isOnline: false }, // Group chat example - online status might not apply or represent members
  { id: 7, username: 'support_bot', lastMessage: 'How can I help you today?', unread: 0, avatarInitial: 'B', isOnline: true }, // Bots can be 'online'
];

// More realistic mock messages, grouped by conversation ID
const allMessages: { [key: number]: Message[] } = {
  1: [
    { id: 1, sender: 'mutual_friend_1', text: 'Hey! How are you?', timestamp: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'Doing well, thanks! Just testing ThredX.', timestamp: '10:31 AM', isOwn: true },
    { id: 3, sender: 'mutual_friend_1', text: 'Cool! Feels secure.', timestamp: '10:32 AM', isOwn: false },
    { id: 4, sender: 'You', text: 'Absolutely! End-to-end encryption is key. This message should also wrap nicely if it gets long enough to test the layout.', timestamp: '10:33 AM', isOwn: true },
  ],
  2: [
    { id: 5, sender: 'another_friend', text: 'Check out this encrypted message!', timestamp: '11:00 AM', isOwn: false },
    { id: 6, sender: 'You', text: 'Looks good!', timestamp: '11:01 AM', isOwn: true },
    { id: 7, sender: 'another_friend', text: 'Did you see the latest update?', timestamp: '11:15 AM', isOwn: false },
  ],
  3: [
    { id: 8, sender: 'long_username_test', text: 'This is a very long last message to see how it wraps or truncates properly within the sidebar layout.', timestamp: '12:00 PM', isOwn: false },
    { id: 9, sender: 'You', text: 'Testing long messages and wrapping behavior. Seems to work.', timestamp: '12:01 PM', isOwn: true },
  ],
  4: [
    { id: 10, sender: 'test_user_4', text: 'Short message.', timestamp: '1:00 PM', isOwn: false },
  ],
   5: [
    { id: 11, sender: 'secure_chat', text: 'Encrypted talk!', timestamp: '2:00 PM', isOwn: false },
    { id: 12, sender: 'You', text: 'Let\'s discuss the plan.', timestamp: '2:01 PM', isOwn: true },
    { id: 13, sender: 'secure_chat', text: 'Okay, sending details securely.', timestamp: '2:02 PM', isOwn: false },
    { id: 14, sender: 'secure_chat', text: '...', timestamp: '2:03 PM', isOwn: false },
    { id: 15, sender: 'You', text: 'Got it.', timestamp: '2:04 PM', isOwn: true },
  ],
  6: [ // Group chat messages
    { id: 16, sender: 'Alice', text: 'Meeting at 3 PM?', timestamp: '2:30 PM', isOwn: false },
    { id: 17, sender: 'Bob', text: '👍 Sounds good.', timestamp: '2:31 PM', isOwn: false },
    { id: 18, sender: 'You', text: 'I can make it.', timestamp: '2:32 PM', isOwn: true },
  ],
  7: [ // Bot messages
    { id: 19, sender: 'support_bot', text: 'How can I help you today?', timestamp: '3:00 PM', isOwn: false },
  ],
};

// Keep track of the selected conversation ID
const initialSelectedConversationId = conversations.length > 0 ? conversations[0].id : null; // Select first convo if exists


export default function MessagesPage() {
  const { toast } = useToast();
  const [messageInput, setMessageInput] = useState('');
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(initialSelectedConversationId);
  const [messages, setMessages] = useState<Message[]>([]); // Initialize empty
  const [loadingMessages, setLoadingMessages] = useState<boolean>(true); // Start true for initial load simulation
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null); // Ref for chat area scrolling
  const optimisticIdCounter = useRef(0); // Use ref for counter to avoid re-renders

  // Derived state for selected conversation details
  const selectedConversation = useMemo(() =>
      conversations.find(c => c.id === selectedConversationId),
      [selectedConversationId]
  );

  // Function to scroll chat area to bottom
  const scrollToBottom = useCallback((behavior: ScrollBehavior = 'auto') => {
    // Use timeout to ensure DOM update is complete before scrolling
    setTimeout(() => {
        if (messageEndRef.current) {
             messageEndRef.current.scrollIntoView({ behavior: behavior, block: 'end' });
        } else if (chatAreaRef.current) {
             chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
        }
    }, 50); // Short delay
  }, []);

  // Effect to load messages when conversation changes
  useEffect(() => {
      let isMounted = true;
      if (selectedConversationId) {
          setLoadingMessages(true);
          // Avoid clearing messages immediately to prevent flash
          // setMessages([]);

          // Simulate fetching messages with delay
          const timer = setTimeout(() => {
              if (!isMounted) return; // Prevent state update if unmounted
              const fetchedMessages = allMessages[selectedConversationId] || [];
              setMessages(fetchedMessages);
              setLoadingMessages(false);
              scrollToBottom('auto'); // Scroll quickly on load
          }, 300); // Simulate network delay

          return () => {
              isMounted = false;
              clearTimeout(timer);
          }
      } else {
          setMessages([]); // Clear if no conversation is selected
          setLoadingMessages(false);
      }
  }, [selectedConversationId, scrollToBottom]); // Dependency on ID and scroll function


  const handleSendMessage = useCallback(() => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !selectedConversation || loadingMessages) return;

    // Basic E2EE simulation placeholder (replace with actual crypto)
    const encryptMessage = (text: string) => `ENC(${text})`; // Simple placeholder
    const encryptedText = encryptMessage(trimmedMessage);

    // Generate a unique optimistic ID using the ref
    const optimisticId = `optimistic-${optimisticIdCounter.current++}`;

    // Optimistic update
    const newMessage: Message = {
        id: optimisticId, // Use unique optimistic ID
        sender: 'You',
        text: trimmedMessage, // Display original text optimistically
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
    };

    // Add the new message to the current state
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Simulate adding to mock data store (with encrypted text)
    // This should happen *after* a successful backend call in a real app
    // For demo, we add it here but would ideally replace the optimistic message later
    const messageForStorage = {
      ...newMessage,
      // Use a more unique ID for demo storage; replace optimistic ID after backend confirmation
      id: `server-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: encryptedText
    };
     if (!allMessages[selectedConversation.id]) {
        allMessages[selectedConversation.id] = [];
     }
    // In a real app, you'd replace the optimistic message with the server-confirmed one
    // For demo, just push the "stored" version (conceptually)
    allMessages[selectedConversation.id].push(messageForStorage);


    setMessageInput('');
    // Scroll smoothly after adding the new message
    scrollToBottom('smooth');


    // Placeholder: Simulate backend confirmation
    console.log(`Sending encrypted message "${encryptedText}" to ${selectedConversation.username}`);
    // In a real app:
    // 1. Use actual encryption library (libsodium, Web Crypto API) here.
    // 2. Call API to send the encrypted message.
    // 3. On API success, update the optimistic message with the real ID and confirmed state:
    //    setMessages(prev => prev.map(msg => msg.id === optimisticId ? { ...msg, id: messageForStorage.id /* realIdFromBackend */ } : msg));
    // 4. On API error, revert optimistic update or show error state on the message:
    //    setMessages(prev => prev.filter(msg => msg.id !== optimisticId));
    //    toast({ variant: 'destructive', title: 'Failed to send' });

  }, [messageInput, selectedConversation, loadingMessages, toast, scrollToBottom]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if Enter key is pressed and Shift key is not
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent adding a newline in the input field
      handleSendMessage(); // Call the send message handler
    }
  };

   const selectConversation = useCallback((id: number) => {
      if (id === selectedConversationId) return; // Prevent re-selecting the same chat

      setSelectedConversationId(id);
      setMessageInput(''); // Clear input
      // Message loading is handled by the useEffect hook based on selectedConversationId change

      // Close sidebar on mobile after selection for better UX
      if (window.innerWidth < 768) {
          setIsSidebarOpen(false);
      }
  }, [selectedConversationId]);

  // Skeleton loader for conversations list
  const ConversationListSkeleton = () => (
    <div className="p-3 sm:p-4 space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

   // Skeleton loader for messages area
   const MessageAreaSkeleton = () => (
    // Added more padding and spacing
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-secondary/10 flex flex-col justify-end">
        {/* Simulate messages loading from bottom up */}
        <div className="flex justify-start mt-auto"> <Skeleton className="h-8 w-1/3 rounded-lg" /> </div>
        <div className="flex justify-end"> <Skeleton className="h-16 w-3/4 rounded-lg" /> </div>
        <div className="flex justify-start"> <Skeleton className="h-10 w-2/5 rounded-lg" /> </div>
        <div className="flex justify-end"> <Skeleton className="h-12 w-1/2 rounded-lg" /> </div>
        <div className="flex justify-start"> <Skeleton className="h-16 w-3/5 rounded-lg" /> </div>
    </div>
   );

  // Use flex-1 for the container to take available height instead of calc()
  // Added h-full and overflow-hidden to the outermost div
  return (
    <div className="flex flex-1 h-full overflow-hidden border border-primary/10 rounded-lg shadow-lg">
      {/* Conversation List Sidebar */}
      <aside
        className={cn(
          "absolute top-0 left-0 z-20 h-full w-full transform transition-transform duration-300 ease-in-out md:static md:z-auto md:block md:w-[300px] lg:w-[340px] md:flex-shrink-0 flex flex-col border-r border-primary/10 bg-background shadow-xl md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
        aria-label="Conversations List"
      >
         <div className="p-4 sm:p-6 border-b border-primary/10 flex items-center justify-between flex-shrink-0"> {/* Increased padding */}
            <h2 className="text-lg sm:text-xl font-semibold" id="chat-list-heading">Chats</h2>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close conversations list">
                <PanelLeftOpen className="h-5 w-5" />
            </Button>
         </div>
         {/* Increased padding in conversation items */}
         <div className="flex-1 overflow-y-auto" role="navigation" aria-labelledby="chat-list-heading">
             {conversations.map((convo) => (
               <div
                 key={convo.id} // Use stable ID from data
                 className={cn(
                     `p-4 sm:p-5 flex items-center space-x-3 sm:space-x-4 cursor-pointer hover:bg-secondary/30 transition-colors duration-150 border-b border-primary/5 last:border-b-0 relative`, // Increased padding and spacing
                     selectedConversationId === convo.id ? 'bg-primary/10' : '',
                 )}
                 onClick={() => selectConversation(convo.id)}
                 role="button"
                 tabIndex={0} // Make it focusable
                 onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') selectConversation(convo.id); }}
                 aria-current={selectedConversationId === convo.id ? "page" : undefined}
                 aria-label={`Chat with ${convo.username}`} // Accessibility label
               >
                  {/* Avatar Container */}
                  <div className="relative flex-shrink-0">
                     <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base" aria-hidden="true"> {/* Slightly larger avatar */}
                         {convo.avatarInitial}
                     </div>
                     {/* Activation Mark (Online Status) */}
                     {convo.isOnline && (
                         <span
                             className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-sky-400 ring-2 ring-background" // Larger indicator
                             aria-label="Online"
                             title="Online"
                          />
                      )}
                     {/* Group/Bot Icons */}
                     {convo.username.includes('group') && <Users className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" aria-label="Group chat" />}
                     {convo.username.includes('bot') && <svg className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" viewBox="0 0 24 24" fill="currentColor" aria-label="Bot"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2zM8 11a4 4 0 1 0 8 0H8zm8 0a4 4 0 0 0-8 0v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3zM5 18a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1z"/></svg>}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate text-sm sm:text-base">{convo.username}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                  </div>
                  {convo.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 ml-auto flex-shrink-0" aria-label={`${convo.unread} unread messages`}>
                      {convo.unread}
                    </span>
                  )}
               </div>
             ))}
         </div>
      </aside>

      {/* Chat Area - Changed layout to ensure input is always visible */}
      <main
        className={cn(
          "flex-1 flex flex-col bg-background overflow-hidden transition-opacity duration-300",
           // Control opacity during loading
           loadingMessages ? "opacity-50" : "opacity-100"
        )}
        aria-live="polite" // Announce changes in content, like new messages
        aria-busy={loadingMessages} // Indicate loading state
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <header className="p-4 sm:p-6 border-b border-primary/10 flex items-center space-x-3 sm:space-x-4 flex-shrink-0 bg-background z-10"> {/* Increased padding and spacing */}
              {/* Button to open sidebar on small screens */}
              <Button variant="ghost" size="icon" className="md:hidden mr-1 sm:mr-2" onClick={() => setIsSidebarOpen(true)} aria-label="Open conversations list">
                 <MessageSquare className="h-5 w-5" />
              </Button>
              {/* Avatar in Header */}
               <div className="relative flex-shrink-0">
                   <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base" aria-hidden="true"> {/* Slightly larger avatar */}
                     {selectedConversation.avatarInitial}
                   </div>
                    {/* Activation Mark in Header */}
                    {selectedConversation.isOnline && (
                         <span
                             className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-sky-400 ring-2 ring-background" // Larger indicator
                             aria-label="Online"
                             title="Online"
                          />
                      )}
                    {/* Group/Bot Icons */}
                    {selectedConversation.username.includes('group') && <Users className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" aria-label="Group chat" />}
                    {selectedConversation.username.includes('bot') && <svg className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" viewBox="0 0 24 24" fill="currentColor" aria-label="Bot"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2zM8 11a4 4 0 1 0 8 0H8zm8 0a4 4 0 0 0-8 0v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3zM5 18a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1z"/></svg>}
               </div>
               <div>
                  <h2 className="text-base sm:text-lg font-semibold">{selectedConversation.username}</h2>
                   {/* Status Text */}
                   {selectedConversation.isOnline ? (
                        <p className="text-xs text-sky-400">Online</p>
                   ) : (
                        <p className="text-xs text-muted-foreground">Offline</p>
                   )}
               </div>
            </header>

            {/* Message Area Wrapper - uses flex-1 to take remaining vertical space */}
            <div className="flex-1 overflow-hidden flex flex-col h-0"> {/* Set height to 0 to allow flex-1 to work correctly */}
                {loadingMessages ? (
                    <MessageAreaSkeleton />
                ) : (
                  // Scrollable Message List - takes available space within the wrapper
                  <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-secondary/10">
                    {messages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-10">No messages yet. Start the conversation!</div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          // Ensure msg.id is unique, especially with optimistic updates
                          key={msg.id}
                          className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={cn(
                              "max-w-[75%] sm:max-w-[65%] p-3 sm:p-4 rounded-lg shadow-sm break-words", // Slightly reduced max-width, increased padding
                              msg.isOwn
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-card text-card-foreground rounded-bl-none'
                            )}
                          >
                            {/* Placeholder: Decrypt message before display */}
                            <p className="text-sm sm:text-base">{msg.text.startsWith('ENC(') ? msg.text.substring(4, msg.text.length - 1) : msg.text}</p>
                            <p className={`text-xs mt-1.5 text-right ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground' }`}>{msg.timestamp}</p> {/* Increased top margin */}
                          </div>
                        </div>
                      ))
                    )}
                    {/* Explicit scroll target */}
                    <div ref={messageEndRef} style={{ height: '1px' }} />
                  </div>
                )}
            </div>

            {/* Message Input - Stays at the bottom, doesn't get pushed off screen */}
            <div className="p-4 sm:p-6 border-t border-primary/10 bg-background flex-shrink-0"> {/* Increased padding */}
              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex items-center space-x-3"> {/* Increased spacing */}
                 <Input
                   type="text"
                   placeholder="Type your encrypted message..."
                   className="flex-1 bg-secondary/30 border-primary/20 focus:ring-primary/50 h-11 text-sm sm:text-base" // Increased height
                   value={messageInput}
                   onChange={handleInputChange}
                   onKeyDown={handleKeyDown} // Use onKeyDown for Enter key
                   disabled={loadingMessages || !selectedConversation}
                   aria-label="Message input"
                   autoComplete="off"
                 />
                 <Button
                   type="submit" // Use submit type for form
                   className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-11 flex-shrink-0" // Increased height/width
                   size="icon"
                   aria-label="Send message"
                   disabled={!messageInput.trim() || loadingMessages || !selectedConversation}
                 >
                   {loadingMessages ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                 </Button>
              </form>
            </div>
          </>
        ) : (
           // State when no conversation is selected
           <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                {/* Button to open sidebar on small screens */}
                <Button variant="ghost" size="icon" className="md:hidden mb-4" onClick={() => setIsSidebarOpen(true)} aria-label="Open conversations list">
                   <MessageSquare className="h-6 w-6" />
                </Button>
                <Users className="h-12 w-12 mb-4 text-primary/50" /> {/* Placeholder icon */}
                <p>Select a conversation to start chatting.</p>
                <p className="text-xs mt-1">Your messages are end-to-end encrypted.</p>
           </div>
        )}
      </main>
    </div>
  );
}

