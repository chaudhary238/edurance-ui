import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Sidebar } from "@/components/sidebar";
import { Layout } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MessageSquare, AlertCircle, Loader2 } from "lucide-react";

// This should match the Conversation schema from the backend
interface Conversation {
    id: string;
    title: string;
    updated_at: string;
    workflow: string;
}

export default function RecentChatsPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                setIsLoading(true);
                const response = await fetch("/api/chat/conversations");
                if (!response.ok) {
                    throw new Error("Failed to fetch recent chats.");
                }
                const data = await response.json();
                setConversations(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, []);

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center h-full">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-red-500">
                    <AlertCircle className="h-12 w-12 mb-4" />
                    <h2 className="text-xl font-semibold">An Error Occurred</h2>
                    <p>{error}</p>
                </div>
            );
        }

        if (conversations.length === 0) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-center">
                     <MessageSquare className="h-12 w-12 text-neutral-400 mb-4" />
                    <h2 className="text-xl font-semibold">No Recent Chats</h2>
                    <p className="text-neutral-500">Your recent conversations will appear here.</p>
                </div>
            );
        }

        return (
            <div className="space-y-4">
                {conversations.map((convo) => (
                    <Link key={convo.id} href={`/chat/${convo.id}`}>
                        <Card className="hover:bg-muted transition-colors cursor-pointer">
                            <CardHeader>
                                <CardTitle>{convo.title}</CardTitle>
                                <CardDescription>
                                    Last updated: {new Date(convo.updated_at).toLocaleString()}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <Layout>
            <main className="flex-1 overflow-auto bg-neutral-50 p-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-neutral-900 mb-3">Recent Chats</h1>
                        <p className="text-neutral-600 text-lg">
                            Select a conversation to continue where you left off.
                        </p>
                    </div>
                    {renderContent()}
                </div>
            </main>
        </Layout>
    );
} 