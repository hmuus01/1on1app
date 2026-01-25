"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { logger } from "@/lib/logger";
import type { MessageWithUsers } from "@/types/database";

export function MessageThread({
  threadId,
  otherUserId,
  initialMessages,
}: {
  threadId: string;
  otherUserId: string;
  initialMessages: MessageWithUsers[];
}) {
  const [messages, setMessages] = useState<MessageWithUsers[]>(initialMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setIsLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          thread_id: threadId,
          from_user_id: user.id,
          to_user_id: otherUserId,
          body: newMessage,
        })
        .select()
        .single();

      if (error) throw error;

      setMessages([data, ...messages]);
      setNewMessage("");
    } catch (err) {
      logger.error("Error sending message:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {messages
          .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
          .map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.from_user_id === otherUserId
                  ? "bg-muted"
                  : "bg-primary text-primary-foreground ml-auto max-w-[80%]"
              }`}
            >
              <p className="text-sm">{msg.body}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(msg.created_at).toLocaleString()}
              </p>
            </div>
          ))}
      </div>
      <form onSubmit={handleSend} className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !newMessage.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}

