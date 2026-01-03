import { redirect } from "next/navigation";
import { getUserProfile } from "@/lib/actions/user";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageThread } from "@/components/message-thread";

export default async function MessagesPage() {
  const profile = await getUserProfile();
  
  if (!profile) {
    redirect("/auth/login");
  }

  const supabase = await createClient();
  
  // Fetch message threads (simplified: get unique thread_ids for this user)
  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      from_user:from_user_id (
        id,
        full_name,
        email
      ),
      to_user:to_user_id (
        id,
        full_name,
        email
      )
    `)
    .or(`from_user_id.eq.${profile.id},to_user_id.eq.${profile.id}`)
    .order("created_at", { ascending: false })
    .limit(50);

  // Group messages by thread_id
  const threads = new Map();
  messages?.forEach((msg: any) => {
    const threadId = msg.thread_id;
    if (!threads.has(threadId)) {
      threads.set(threadId, {
        thread_id: threadId,
        messages: [],
        other_user: msg.from_user_id === profile.id ? msg.to_user : msg.from_user,
      });
    }
    threads.get(threadId).messages.push(msg);
  });

  const threadArray = Array.from(threads.values());

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Messages</h1>
        <p className="text-muted-foreground mt-2">
          Your conversations
        </p>
      </div>

      <div className="grid gap-6">
        {threadArray.length > 0 ? (
          threadArray.map((thread: any) => (
            <Card key={thread.thread_id}>
              <CardHeader>
                <CardTitle>
                  {thread.other_user?.full_name || thread.other_user?.email || "User"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MessageThread
                  threadId={thread.thread_id}
                  otherUserId={thread.other_user?.id}
                  initialMessages={thread.messages}
                />
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No messages yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

