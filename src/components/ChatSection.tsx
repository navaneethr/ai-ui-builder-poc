"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface ComponentData {
  id: string;
  component: string;
  prompt: string;
  props: any;
  timestamp: number;
}

interface ChatSectionProps {
  componentData?: ComponentData[];
}

export default function ChatSection({ componentData = [] }: ChatSectionProps) {
  console.log("ChatSection received componentData:", componentData);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I can help you analyze the data from your generated components. What would you like to know?",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const componentData = localStorage.getItem("generated-components");
      const response = await fetch("/api/chat-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          componentData: componentData ? JSON.parse(componentData) : [],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.message,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I encountered an error. Please try again.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen bg-slate-50 dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
          Ask AI Assistant about your Dashboard
        </h3>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.role === "user"
                  ? "bg-slate-100 dark:bg-slate-800 ml-8"
                  : "bg-blue-100 dark:bg-blue-900/20"
              }`}
            >
              <p className="text-sm text-slate-900 dark:text-slate-100">
                {message.content}
              </p>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
          ))}
          {isLoading && (
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  Thinking...
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px] max-h-[200px] resize-none pr-12"
            rows={3}
            disabled={isLoading}
          />
          <Button
            size="sm"
            className="absolute bottom-2 right-2 h-8 w-8 p-0"
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? "..." : "→"}
          </Button>
        </div>
      </div>
    </div>
  );
}
