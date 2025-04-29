
'use client'; // Add 'use client' directive for state and event handlers

import React, { useState } from 'react'; // Import useState
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast'; // Import useToast

// Placeholder data for message threads and messages
const conversations = [
  { id: 1, username: 'mutual_friend_1', lastMessage: 'Hey! How are you?', unread: 2, avatarInitial: 'M' },
  { id: 2, username: 'another_friend', lastMessage: 'Check out this encrypted message!', unread: 0, avatarInitial: 'A' },
];

// Add an initial state for messages to easily add new ones
const initialMessages = [
    { id: 1, sender: 'mutual_friend_1', text: 'Hey! How are you?', timestamp: '10:30 AM', isOwn: false },
    { id: 2, sender: 'You', text: 'Doing well, thanks! Just testing ThredX.', timestamp: '10:31 AM', isOwn: true },
    { id: 3, sender: 'mutual_friend_1', text: 'Cool! Feels secure.', timestamp: '10:32 AM', isOwn: false },
];

const selectedConversationId = 1; // Simulate selecting the first conversation

export default function MessagesPage() {
  const { toast } = useToast(); // Initialize toast
  const [messageInput, setMessageInput] = useState(''); // State for the message input
  const [messages, setMessages] = useState(initialMessages); // State for messages in the selected chat

  // TODO: Add logic for fetching/selecting conversations, E2EE.

  const selectedConversation = conversations.find(c => c.id === selectedConversationId);

  const handleSendMessage = () => {
    const trimmedMessage = messageInput.trim();
    if (!trimmedMessage) return; // Don't send empty messages

    // Placeholder: Simulate sending the message
    console.log('Sending message:', trimmedMessage);

    // Add the new message to the state (for demo purposes)
    const newMessage = {
        id: messages.length + 1, // Simple ID generation for demo
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

  return (
    <div className="flex h-[calc(100vh-theme(spacing.28))] border border-primary/10 rounded-lg overflow-hidden shadow-lg">
      {/* Conversation List Sidebar */}
      <div className="w-1/3 border-r border-primary/10 flex flex-col">
         <div className="p-4 border-b border-primary/10">
            <h2 className="text-xl font-semibold">Chats</h2>
            {/* Search bar placeholder */}
            <Input placeholder="Search chats..." className="mt-2 bg-secondary/30 border-primary/20 focus:ring-primary/50" />
         </div>
         <div className="flex-1 overflow-y-auto">
            {conversations.map((convo) => (
              <div
                key={convo.id}
                className={`p-4 flex items-center space-x-3 cursor-pointer hover:bg-secondary/20 ${selectedConversationId === convo.id ? 'bg-primary/10' : ''}`}
                // TODO: Add onClick to actually select a conversation
              >
                 <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                  {convo.avatarInitial}
                 </div>
                 <div className="flex-1 min-w-0">
                   <p className="font-semibold truncate">{convo.username}</p>
                   <p className="text-sm text-muted-foreground truncate">{convo.lastMessage}</p>
                 </div>
                 {convo.unread > 0 && (
                   <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5">
                     {convo.unread}
                   </span>
                 )}
              </div>
            ))}
         </div>
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-primary/10 flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-foreground font-semibold">
                 {selectedConversation.avatarInitial}
               </div>
               <div>
                  <h2 className="text-lg font-semibold">{selectedConversation.username}</h2>
                  {/* Status placeholder */}
                  {/* <p className="text-xs text-muted-foreground">Online</p> */}
               </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/10">
              {/* Use the messages state */}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-md ${
                      msg.isOwn
                        ? 'bg-primary text-primary-foreground rounded-br-none'
                        : 'bg-card text-card-foreground rounded-bl-none' // Use card background for received messages
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 text-right ${msg.isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground' }`}>{msg.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-primary/10 bg-background">
              <div className="flex items-center space-x-2">
                 {/* Placeholder for attachments later */}
                 {/* <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5" /></Button> */}
                 <Input
                   placeholder="Type your encrypted message..."
                   className="flex-1 bg-secondary/30 border-primary/20 focus:ring-primary/50"
                   value={messageInput} // Bind value to state
                   onChange={handleInputChange} // Handle input changes
                   onKeyDown={handleKeyDown} // Handle Enter key press
                 />
                 <Button
                   className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
           <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Select a conversation to start chatting.
           </div>
        )}
      </div>
    </div>
  );
}
