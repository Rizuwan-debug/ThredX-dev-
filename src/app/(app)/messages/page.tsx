
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
  id: number;
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
}

// Increased mock data variety
const conversations: Conversation[] = [
  { id: 1, username: 'mutual_friend_1', lastMessage: 'Hey! How are you?', unread: 2, avatarInitial: 'M' },
  { id: 2, username: 'another_friend', lastMessage: 'Check out this encrypted message!', unread: 0, avatarInitial: 'A' },
  { id: 3, username: 'long_username_test', lastMessage: 'This is a very long last message...', unread: 1, avatarInitial: 'L' },
  { id: 4, username: 'test_user_4', lastMessage: 'Short message.', unread: 0, avatarInitial: 'T' },
  { id: 5, username: 'secure_chat', lastMessage: 'Encrypted talk!', unread: 3, avatarInitial: 'S' },
  { id: 6, username: 'dev_team_group', lastMessage: 'Meeting at 3 PM?', unread: 0, avatarInitial: 'D' }, // Group chat example
  { id: 7, username: 'support_bot', lastMessage: 'How can I help you today?', unread: 0, avatarInitial: 'B' },
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
  const [messages, setMessages] = useState<Message[]>(selectedConversationId ? (allMessages[selectedConversationId] || []) : []);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(selectedConversationId !== null); // Initially true if a convo is selected
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatAreaRef = useRef<HTMLDivElement>(null); // Ref for chat area scrolling

  // Derived state for selected conversation details
  const selectedConversation = useMemo(() =>
      conversations.find(c => c.id === selectedConversationId),
      [selectedConversationId]
  );

  // Function to scroll chat area to bottom
  const scrollToBottom = useCallback(() => {
    // Use timeout to ensure DOM update is complete before scrolling
    setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, 0);
  }, []);

  // Effect to load initial messages and handle initial loading state
  useEffect(() => {
      if (selectedConversationId) {
          setLoadingMessages(true);
          // Simulate initial load delay
          const timer = setTimeout(() => {
              setMessages(allMessages[selectedConversationId] || []);
              setLoadingMessages(false);
              scrollToBottom();
          }, 500); // Adjust initial delay as needed
          return () => clearTimeout(timer);
      } else {
          setLoadingMessages(false); // No chat selected, not loading
      }
  }, [selectedConversationId, scrollToBottom]); // Only run when ID changes initially


  const handleSendMessage = useCallback(() => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !selectedConversation || loadingMessages) return;

    // Optimistic update
    const newMessage: Message = {
        id: Date.now(),
        sender: 'You',
        text: trimmedMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Update mock data store (for demo persistence)
    if (!allMessages[selectedConversation.id]) {
        allMessages[selectedConversation.id] = [];
    }
    allMessages[selectedConversation.id].push(newMessage);

    setMessageInput('');
    scrollToBottom();

    // Placeholder: Simulate backend confirmation (no visual change needed on success for optimistic update)
    console.log(`Sending message "${trimmedMessage}" to ${selectedConversation.username}`);
    // toast({ title: 'Message Sent', duration: 2000 }); // Optional: short confirmation

    // In a real app:
    // 1. Call API to send the message.
    // 2. On API error, revert optimistic update or show error state on the message.

  }, [messageInput, selectedConversation, loadingMessages, toast, scrollToBottom]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const selectConversation = useCallback((id: number) => {
      if (id === selectedConversationId || loadingMessages) return; // Prevent switching if already selected or loading

      setLoadingMessages(true);
      setSelectedConversationId(id);
      setMessageInput(''); // Clear input
      setMessages([]); // Clear current messages immediately for loading state

      // Simulate fetching messages with delay
      setTimeout(() => {
          const fetchedMessages = allMessages[id] || [];
          setMessages(fetchedMessages);
          setLoadingMessages(false);
          scrollToBottom(); // Scroll after new messages are loaded
      }, 400); // Simulate network delay


      if (window.innerWidth < 768) { // Close sidebar on mobile after selection
          setIsSidebarOpen(false);
      }
  }, [selectedConversationId, loadingMessages, scrollToBottom]);

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
    <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-secondary/10">
        <div className="flex justify-start"> <Skeleton className="h-16 w-3/5 rounded-lg" /> </div>
        <div className="flex justify-end"> <Skeleton className="h-12 w-1/2 rounded-lg" /> </div>
        <div className="flex justify-start"> <Skeleton className="h-10 w-2/5 rounded-lg" /> </div>
        <div className="flex justify-end"> <Skeleton className="h-16 w-3/4 rounded-lg" /> </div>
        <div className="flex justify-start"> <Skeleton className="h-8 w-1/3 rounded-lg" /> </div>
    </div>
   );

  return (
    <div className="flex h-[calc(100vh-var(--header-height,4rem)-3rem)] md:h-[calc(100vh-var(--header-height,4rem)-4rem)] overflow-hidden border border-primary/10 rounded-lg shadow-lg">
      {/* Conversation List Sidebar */}
      <aside
        className={cn(
          "absolute top-0 left-0 z-20 h-full w-full transform transition-transform duration-300 ease-in-out md:static md:z-auto md:block md:w-1/3 md:transform-none flex flex-col border-r border-primary/10 bg-background shadow-xl md:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0"
        )}
        aria-label="Conversations List"
      >
         <div className="p-3 sm:p-4 border-b border-primary/10 flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg sm:text-xl font-semibold" id="chat-list-heading">Chats</h2>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)} aria-label="Close conversations list">
                <PanelLeftOpen className="h-5 w-5" />
            </Button>
         </div>
         <div className="flex-1 overflow-y-auto" role="navigation" aria-labelledby="chat-list-heading">
             {/* Add a loading state for conversation list if needed */}
             {conversations.map((convo) => (
               <div
                 key={convo.id}
                 className={cn(
                     `p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-secondary/30 transition-colors duration-150 border-b border-primary/5 last:border-b-0`, // Subtle border between items
                     selectedConversationId === convo.id ? 'bg-primary/10' : '',
                     loadingMessages ? 'opacity-50 cursor-wait' : '' // Indicate loading
                 )}
                 onClick={() => selectConversation(convo.id)}
                 role="button"
                 tabIndex={0}
                 onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && selectConversation(convo.id)}
                 aria-current={selectedConversationId === convo.id ? "page" : undefined}
               >
                  {/* Avatar with conditional icon for group/bot */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base flex-shrink-0 relative" aria-hidden="true">
                   {convo.avatarInitial}
                   {convo.username.includes('group') && <Users className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" />}
                   {convo.username.includes('bot') && <svg className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2zM8 11a4 4 0 1 0 8 0H8zm8 0a4 4 0 0 0-8 0v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3zM5 18a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1z"/></svg>}
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

      {/* Chat Area */}
      <main
        className={cn(
          "flex-1 flex flex-col bg-background overflow-hidden transition-opacity duration-300",
          loadingMessages ? 'opacity-75' : 'opacity-100' // Fade slightly during load
        )}
        aria-live="polite" // Announce changes in content, like new messages
      >
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <header className="p-3 sm:p-4 border-b border-primary/10 flex items-center space-x-2 sm:space-x-3 flex-shrink-0 bg-background z-10">
              {/* Button to open sidebar on small screens */}
              <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsSidebarOpen(true)} aria-label="Open conversations list">
                 <MessageSquare className="h-5 w-5" />
              </Button>
               <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base flex-shrink-0 relative" aria-hidden="true">
                 {selectedConversation.avatarInitial}
                 {selectedConversation.username.includes('group') && <Users className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" />}
                 {selectedConversation.username.includes('bot') && <svg className="absolute bottom-0 right-0 h-3 w-3 text-background/70 bg-foreground/50 rounded-full p-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-4 0V4a2 2 0 0 1 2-2zM8 11a4 4 0 1 0 8 0H8zm8 0a4 4 0 0 0-8 0v3a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-3zM5 18a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-1z"/></svg>}
               </div>
               <div>
                  <h2 className="text-base sm:text-lg font-semibold">{selectedConversation.username}</h2>
                  {/* Status placeholder */}
                  {/* <p className="text-xs text-muted-foreground">Online</p> */}
               </div>
            </header>

            {/* Message Area */}
             {loadingMessages ? (
                 <MessageAreaSkeleton />
             ) : (
                <div ref={chatAreaRef} className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-secondary/10">
                  {messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">No messages yet. Start the conversation!</div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg shadow-md break-words ${
                            msg.isOwn
                              ? 'bg-primary text-primary-foreground rounded-br-none'
                              : 'bg-card text-card-foreground rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm sm:text-base">{msg.text}</p>
                          <p className={`text-xs mt-1 text-right ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground' }`}>{msg.timestamp}</p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messageEndRef} /> {/* Scroll target */}
                </div>
             )}


            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-primary/10 bg-background flex-shrink-0">
              <div className="flex items-center space-x-2">
                 {/* Placeholder for attachments later */}
                 {/* <Button variant="ghost" size="icon" aria-label="Attach file"><Paperclip className="h-5 w-5" /></Button> */}
                 <Input
                   type="text" // Ensure correct type
                   placeholder="Type your encrypted message..."
                   className="flex-1 bg-secondary/30 border-primary/20 focus:ring-primary/50 h-10 text-sm sm:text-base"
                   value={messageInput}
                   onChange={handleInputChange}
                   onKeyDown={handleKeyDown}
                   disabled={loadingMessages}
                   aria-label="Message input"
                   aria-autocomplete="off" // Assuming no autocomplete is desired here
                 />
                 <Button
                   className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 flex-shrink-0"
                   size="icon"
                   aria-label="Send message"
                   onClick={handleSendMessage}
                   disabled={!messageInput.trim() || loadingMessages}
                 >
                   {loadingMessages ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                 </Button>
              </div>
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
