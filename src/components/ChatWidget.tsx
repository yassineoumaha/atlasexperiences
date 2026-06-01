"use client";

import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  sender_name: string;
  sender_role: "traveler" | "operator";
  body: string;
  created_at: string;
  read: boolean;
}

interface ChatWidgetProps {
  bookingId: string;
  currentUserId: string;
  currentUserName: string;
  currentUserRole: "traveler" | "operator";
  otherPartyName: string;
}

export default function ChatWidget({
  bookingId,
  currentUserId,
  currentUserName,
  currentUserRole,
  otherPartyName,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Load messages and subscribe to realtime
  useEffect(() => {
    if (!bookingId) return;

    // Fetch existing messages
    supabase
      .from("messages")
      .select("*")
      .eq("booking_id", bookingId)
      .order("created_at", { ascending: true })
      .then(({ data }: any) => {
        setMessages(data ?? []);
        const unreadCount = (data ?? []).filter(
          (m: Message) => !m.read && m.sender_id !== currentUserId
        ).length;
        setUnread(unreadCount);
      });

    // Subscribe to new messages via Supabase Realtime
    const channel = supabase
      .channel(`chat:${bookingId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `booking_id=eq.${bookingId}`,
        },
        (payload: any) => {
          const newMsg = payload.new as Message;
          setMessages((prev) => [...prev, newMsg]);
          if (newMsg.sender_id !== currentUserId) {
            if (!open) setUnread((n) => n + 1);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [bookingId, currentUserId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open]);

  // Mark messages as read when opening
  useEffect(() => {
    if (open && unread > 0) {
      (supabase as unknown as any)
        .from("messages")
        .update({ read: true })
        .eq("booking_id", bookingId)
        .neq("sender_id", currentUserId)
        .eq("read", false);
      setUnread(0);
    }
  }, [open]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    await (supabase as unknown as any).from("messages").insert({
      booking_id:  bookingId,
      sender_id:   currentUserId,
      sender_name: currentUserName,
      sender_role: currentUserRole,
      body:        input.trim(),
    });
    setInput("");
    setSending(false);
  }

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-100 flex flex-col overflow-hidden"
          style={{ height: "460px" }}>

          {/* Header */}
          <div className="bg-stone-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div>
              <div className="font-bold text-sm">Chat with {otherPartyName}</div>
              <div className="text-white/50 text-xs">Real-time Â· Secure</div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-stone-50">
            {messages.length === 0 && (
              <div className="text-center text-stone-400 text-sm pt-8">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>No messages yet.</p>
                <p className="text-xs mt-1">Send a message to {otherPartyName}.</p>
              </div>
            )}
            {messages.map((msg) => {
              const isMe = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] ${isMe ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                    {!isMe && (
                      <span className="text-xs text-stone-400 px-1">{msg.sender_name}</span>
                    )}
                    <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isMe
                        ? "bg-amber-500 text-white rounded-br-sm"
                        : "bg-white border border-stone-100 text-stone-800 rounded-bl-sm shadow-sm"
                    }`}>
                      {msg.body}
                    </div>
                    <span className="text-xs text-stone-300 px-1">{formatTime(msg.created_at)}</span>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-stone-100 flex gap-2 shrink-0 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 bg-stone-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className="w-9 h-9 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
