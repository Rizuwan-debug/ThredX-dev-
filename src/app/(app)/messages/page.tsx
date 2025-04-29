
'use client'; // Add 'use client' directive for state and event handlers

import React, { useState } from 'react'; // Import useState
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, PanelLeftOpen, MessageSquare } from 'lucide-react'; // Added PanelLeftOpen for toggle, MessageSquare
import { useToast } from '@/hooks/use-toast'; // Import useToast
import { cn } from '@/lib/utils'; // Import cn for conditional classes

// Placeholder data for message threads and messages
const conversations = [
  { id: 1, username: 'mutual_friend_1', lastMessage: 'Hey! How are you?', unread: 2, avatarInitial: 'M' },
  { id: 2, username: 'another_friend', lastMessage: 'Check out this encrypted message!', unread: 0, avatarInitial: 'A' },
  { id: 3, username: 'long_username_test', lastMessage: 'This is a very long last message to see how it wraps or truncates properly within the sidebar layout.', unread: 1, avatarInitial: 'L' },
  { id: 4, username: 'test_user_4', lastMessage: 'Short message.', unread: 0, avatarInitial: 'T' },
];

// Add an initial state for messages to easily add new ones
const initialMessages = [
    { id: 1, sender: 'mutual_friend_1', text: 'Hey! How are you?', timestamp: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'Doing well, thanks! Just testing ThredX.', timestamp: '10:31 AM', isOwn: true },
    { id: 3, sender: 'mutual_friend_1', text: 'Cool! Feels secure.', timestamp: '10:32 AM', isOwn: false },
    { id: 4, sender: 'You', text: 'Absolutely! End-to-end encryption is key. This message should also wrap nicely if it gets long enough to test the layout.', timestamp: '10:33 AM', isOwn: true },

];

// Keep track of the selected conversation ID
const initialSelectedConversationId = 1; // Simulate selecting the first conversation

export default function MessagesPage() {
  const { toast } = useToast(); // Initialize toast
  const [messageInput, setMessageInput] = useState(''); // State for the message input
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(initialSelectedConversationId); // State for selected chat
  const [messages, setMessages] = useState(initialMessages); // State for messages in the selected chat
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State to control sidebar visibility on smaller screens

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage || !selectedConversation) return; // Don't send empty messages or if no chat is selected

    // Placeholder: Simulate sending the message
    console.log(`Sending message "${trimmedMessage}" to ${selectedConversation.username}`);

    // Add the new message to the state (for demo purposes)
    const newMessage = {
        id: messages.length + 1 + Math.random(), // Simple ID generation for demo
        sender: 'You',
        text: trimmedMessage,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);


    // Clear the input field
    setMessageInput('');

    // Show a confirmation toast
    toast({
      title: 'Message Sent (Placeholder)',
      description: `Your message "${trimmedMessage.substring(0, 20)}..." was "sent".`,
    });

    // In a real app:
    // 1. Call an API to send the message (with encryption).
    // 2. Update message state based on API response or optimistic update.
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // Send message on Enter key press, but not Shift+Enter
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent default newline insertion
      handleSendMessage();
    }
  };

  const selectConversation = (id: number) => {
      setSelectedConversationId(id);
      // Simulate fetching messages for this conversation
      // In a real app, fetch messages from backend/local storage
      const fetchedMessages = initialMessages.filter(m => m.sender !== 'another_friend'); // Example filter
      setMessages(id === 1 ? initialMessages : fetchedMessages); // Load appropriate messages
      if (window.innerWidth < 768) { // Close sidebar on mobile after selection
          setIsSidebarOpen(false);
      }
  }

  return (
    // Adjusted height calculation for potentially smaller header/footer, and remove default border/shadow, apply to children
    <div className="flex h-[calc(100vh-var(--header-height,4rem)-3rem)] md:h-[calc(100vh-var(--header-height,4rem)-4rem)]">
      {/* Conversation List Sidebar */}
      {/* Use cn for conditional display and absolute positioning on mobile */}
      <div className={cn(
          "absolute top-0 left-0 z-10 h-full md:static md:z-auto md:block w-full sm:w-3/4 md:w-1/3 flex flex-col border-r border-primary/10 bg-background shadow-lg md:shadow-none transition-transform duration-300 ease-in-out",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full", // Slide in/out
          "md:translate-x-0" // Always visible on medium+ screens
      )}>
         <div className="p-3 sm:p-4 border-b border-primary/10 flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-semibold">Chats</h2>
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
                <PanelLeftOpen className="h-5 w-5" /> {/* Icon to close sidebar */}
            </Button>
            {/* Search bar placeholder */}
            {/* <Input placeholder="Search chats..." className="mt-2 bg-secondary/30 border-primary/20 focus:ring-primary/50" /> */}
         </div>
         <div className="flex-1 overflow-y-auto">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={cn(
                    `p-3 sm:p-4 flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-secondary/20`,
                    selectedConversationId === convo.id ? 'bg-primary/10' : ''
                )}
                onClick={() => selectConversation(convo.id)} // Set selected conversation
                role="button" // Make it accessible
                tabIndex={0} // Make it focusable
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && selectConversation(convo.id)}
              >
                 <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base flex-shrink-0">
                  {convo.avatarInitial}
                 </div>
                 <div className="flex-1 min-w-0"> {/* Ensure text truncates */}
                   <p className="font-semibold truncate text-sm sm:text-base">{convo.username}</p>
                   <p className="text-xs sm:text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                 </div>
                 {convo.unread > 0 && (
                   <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-1.5 py-0.5 sm:px-2 sm:py-0.5 ml-auto flex-shrink-0">
                     {convo.unread}
                   </span>
                 )}
              </div>
            ))}
         </div>
      </div>

      {/* Chat Area */}
      {/* Use cn for conditional width */}
      <div className={cn(
          "flex-1 flex flex-col bg-background border border-primary/10 rounded-lg shadow-lg md:ml-0 overflow-hidden",
          isSidebarOpen && "md:w-2/3", // Take remaining width when sidebar is open on md+
          !isSidebarOpen && "w-full" // Take full width when sidebar is closed
      )}>
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-3 sm:p-4 border-b border-primary/10 flex items-center space-x-2 sm:space-x-3">
              {/* Button to open sidebar on small screens */}
              <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={() => setIsSidebarOpen(true)}>
                 <MessageSquare className="h-5 w-5" /> {/* Or use Menu icon */}
              </Button>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold text-sm sm:text-base flex-shrink-0">
                 {selectedConversation.avatarInitial}
               </div>
               <div>
                  <h2 className="text-base sm:text-lg font-semibold">{selectedConversation.username}</h2>
                  {/* Status placeholder */}
                  {/* <p className="text-xs text-muted-foreground">Online</p> */}
               </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 bg-secondary/10">
              {/* Use the messages state */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-[70%] p-2 sm:p-3 rounded-lg shadow-md break-words ${ // Added break-words
                      msg.isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card text-card-foreground rounded-bl-none' // Use card background for received messages
                    }`}
                  >
                    <p className="text-sm sm:text-base">{msg.text}</p>
                    <p className={`text-xs mt-1 text-right ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground' }`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-3 sm:p-4 border-t border-primary/10 bg-background">
              <div className="flex items-center space-x-2">
                 {/* Placeholder for attachments later */}
                 {/* <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button> */}
                 <Input
                   placeholder="Type your encrypted message..."
                   className="flex-1 bg-secondary/30 border-primary/20 focus:ring-primary/50 h-10 text-sm sm:text-base"
                   value={messageInput} // Bind value to state
                   onChange={handleInputChange} // Handle input changes
                   onKeyDown={handleKeyDown} // Handle Enter key press
                 />
                 <Button
                   className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-10 flex-shrink-0" // Ensure fixed size
                   size="icon"
                   aria-label="Send"
                   onClick={handleSendMessage} // Handle button click
                   disabled={!messageInput.trim()} // Disable if input is empty
                 >
                   <Send className="h-5 w-5" />
                 </Button>
              </div>
            </div>
          </>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground p-4">
                <Button variant="ghost" size="icon" className="md:hidden mb-4" onClick={() => setIsSidebarOpen(true)}>
                   <MessageSquare className="h-6 w-6" />
                </Button>
                Select a conversation{ window.innerWidth < 768 ? ' ' : ' on the left ' }to start chatting.
           </div>
        )}
      </div>
    </div>
  );
}
