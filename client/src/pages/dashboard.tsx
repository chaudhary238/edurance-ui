import { useState, useRef, useEffect } from "react";
import { Layout } from "@/components/layout";
import { SearchSection } from "@/components/search-section";
import { Policy } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import PolicyDetailsDisplay from "@/components/policy-details-display";
import { SearchResultsDisplay } from "@/components/search-results-display";
import { Paperclip, Send, Bot, User } from "lucide-react";
import { ChatMessageContent } from "@/components/ChatMessageContent";
import { RecommendationQuiz } from "@/components/recommendation-quiz";
import { PolicyComparisonSelector } from "@/components/policy-comparison-selector";
import { ComparisonReportDisplay } from "@/components/comparison-report-display";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { FileText, Image as ImageIcon } from "lucide-react";

type Message = {
    id: number;
    text: React.ReactNode;
    sender: 'user' | 'bot';
    isLoading?: boolean;
};

export default function Dashboard() {
  const [isChatActive, setIsChatActive] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  // Add state to hold the IDs of the policies being compared
  const [comparisonPolicyIds, setComparisonPolicyIds] = useState<string[]>([]);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(scrollToBottom, [messages]);

  const handlePolicySelect = async (policy: Policy) => {
    setIsChatLoading(true);
    setSelectedPolicy(policy);
    setError(null);

    try {
      const response = await fetch(`/api/policies/${policy.policyNumber}/details`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Failed to fetch policy details.');
      }
      const details = await response.json();
      
      const detailsMessage: Message = {
          id: Date.now(),
          sender: 'bot',
          text: (
              <div>
                  <p>Great! You've selected the <strong>{policy.policyName}</strong> policy.</p>
                  <p className="mt-4">Here are the key details. You can now ask me any specific questions about this policy.</p>
                  <div className="mt-4">
                    <PolicyDetailsDisplay details={details} />
                  </div>
              </div>
          )
      };

      setMessages(prev => [...prev, detailsMessage]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsChatLoading(false);
    }
  };
  
  const handleNewChat = () => {
    setIsChatActive(false);
    setSelectedPolicy(null);
    setMessages([]);
    setError(null);
    setConversationId(null);
  }

  const handleQuery = async (query: string) => {
    setIsChatActive(true); 
    setError(null);

    const userMessage: Message = {
        id: Date.now(),
        text: query,
        sender: 'user',
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      sender: 'bot',
      text: 'Thinking...',
      isLoading: true,
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setTimeout(() => scrollToBottom(), 0); 

    try {
      const response = await fetch('/api/query/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "Failed to process query.");
      }
      
      const result = await response.json();
      
      let botResponse: React.ReactNode;

      if (result.workflow === 'policy_comparison' && result.payload && result.payload.length > 0) {
        botResponse = <PolicyComparisonSelector policies={result.payload} onCompare={handleStartComparison} />;
      } else if (result.workflow === 'single_policy_query' && result.payload) {
        botResponse = <SearchResultsDisplay results={result.payload} onPolicySelect={handlePolicySelect} />;
      } else if (result.workflow === 'policy_recommendation') {
        botResponse = <RecommendationQuiz onQuizComplete={handleQuizComplete} />;
      } else {
        botResponse = "I couldn't find anything related to your query. Please try again.";
      }
      
      const finalMessage: Message = {
        ...loadingMessage,
        text: botResponse,
        isLoading: false,
      };

      setMessages(prev => [...prev.slice(0, -1), finalMessage]);

    } catch (err: any) {
      const errorMessage: Message = {
        ...loadingMessage,
        text: `Sorry, an error occurred: ${err.message}`,
        isLoading: false,
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
      setError(err.message);
    }
  };

  const handleStartComparison = async (policies: Policy[]) => {
    setIsChatLoading(true); // Disable input while comparison is loading
    const policyIds = policies.map(p => p.policyNumber);
    setComparisonPolicyIds(policyIds); // Save policy IDs for follow-up chat

    // Create a user message to represent the selection, making it conversational
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: `Great, please compare ${policies[0].policyName} vs ${policies[1].policyName}.`,
    };

    // Replace the selection UI with the new user message and a loading message for the bot's response
    const loadingMessage: Message = {
      id: Date.now() + 1,
      sender: 'bot',
      text: '', // Start with an empty message, the loader will be the main content
      isLoading: true
    };
    
    // This replaces the selector with the user message and the bot's loading message
    setMessages(prev => [...prev.slice(0, -1), userMessage, loadingMessage]);
    setTimeout(() => scrollToBottom(), 0);

    try {
      // Hit the correct, existing endpoint
      const response = await fetch('/api/policies/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ policy_ids: policyIds }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to start comparison.');
      }
      if (!response.body) {
        throw new Error("The response body is empty.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let comparisonText = '';

      const processStream = async () => {
        const { value, done } = await reader.read();
        if (done) {
          setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.sender === 'bot') {
              // We use the new component here for proper rendering
              const finishedMessage = {
                ...lastMessage,
                text: <ComparisonReportDisplay report={comparisonText} />,
                isLoading: false
              };
              // Now that the stream is done, also set the selectedPolicy so the chat input enables
              setSelectedPolicy({ 
                policyNumber: 'comparison', 
                policyName: 'Comparison', 
                insurerName: '', 
                id: 0, 
                lastAnalyzed: new Date(),
                premiumAmount: '',
                // Add missing properties to satisfy the type
                createdAt: null,
                userId: 0,
                coverageAmount: null,
                full_summary: null,
                status: 'active',
                updatedAt: null,
              });
              return [...prev.slice(0, -1), finishedMessage];
            }
            return prev;
          });
          setIsChatLoading(false); // Enable input now
          return;
        }

        const chunk = decoder.decode(value, { stream: true });
        comparisonText += chunk;

        setMessages(prev => {
          const lastMessage = prev[prev.length - 1];
          if (lastMessage && lastMessage.sender === 'bot') {
            const updatedMessage = { ...lastMessage, text: <ComparisonReportDisplay report={comparisonText} />, isLoading: true };
            return [...prev.slice(0, -1), updatedMessage];
          }
          return prev;
        });
        
        await new Promise(resolve => setTimeout(resolve, 50)); // Small delay for rendering
        processStream();
      };
      await processStream();

    } catch (err: any) {
      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Sorry, I couldn't compare those policies. Error: ${err.message}`
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
      setIsChatLoading(false); // Ensure loading is turned off on error
    }
  };

  const handleQuizComplete = async (answers: { [key: string]: string | number }) => {
    setError(null);

    // Create a user message that summarizes their answers
    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: `I am ${answers.age || 'XX'} years old, having ${answers.family_members || 'YY'} family members. I will need ${answers.coverage_type || 'some'} coverage, with a primary requirement of '${answers.primary_concern || 'Low Premium'}'. Find a policy for me.`,
    };

    const loadingMessage: Message = {
      id: Date.now() + 1,
      sender: 'bot',
      text: 'Finding your best policies...',
      isLoading: true,
    };

    // Replace the quiz component with the user message and the bot's loading message
    setMessages(prev => [...prev.slice(0, -1), userMessage, loadingMessage]);

    try {
      const response = await fetch('/api/recommend/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        throw new Error('Failed to get policy recommendations.');
      }
      const results = await response.json();
      
      const resultsMessage: Message = {
        ...loadingMessage,
        isLoading: false,
        text: (
          <div>
            <p className="font-semibold mb-4">Based on your answers, here are my top recommendations:</p>
            <SearchResultsDisplay results={results} onPolicySelect={handlePolicySelect} />
          </div>
        )
      };
      
      setMessages(prev => [...prev.slice(0, -1), resultsMessage]);

    } catch (err: any) {
      console.error("Error during quiz completion:", err);
      const errorMessage: Message = {
        ...loadingMessage,
        isLoading: false,
        text: "Sorry, I couldn't fetch recommendations at this time."
      };
      setMessages(prev => [...prev.slice(0, -1), errorMessage]);
      setError(err.message);
    }
  };
  
  const handleSend = async (query: string) => {
    if (query.trim() === '' || !selectedPolicy) return;

    // Handle follow-up questions for a comparison
    if (selectedPolicy.policyNumber === 'comparison') {
        // Here we can call a new handler specifically for comparison chat
        handleComparisonChat(query);
        return;
    }

    setIsChatLoading(true);
    const userMessage: Message = {
      id: Date.now(),
      text: query,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage, { id: Date.now() + 1, text: '', sender: 'bot', isLoading: true }]);
    setTimeout(() => scrollToBottom(), 0);

    try {
        const response = await fetch(`/api/policies/${selectedPolicy.policyNumber}/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: query,
              conversation_id: conversationId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'The AI is feeling a bit under the weather. Please try again later.');
        }

        if (!response.body) {
            throw new Error("The response body is empty.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        let isStreamStarted = false;
        let lastMessageText = '';
        
        const processStream = async () => {
            const { value, done } = await reader.read();
            if (done) {
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage && lastMessage.sender === 'bot') {
                        return [...prev.slice(0, -1), { ...lastMessage, isLoading: false }];
                    }
                    return prev;
                });
                setIsChatLoading(false);
                return;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            
            if (!isStreamStarted) {
                try {
                    const data = JSON.parse(chunk);
                    if (data.conversation_id) {
                        setConversationId(data.conversation_id);
                        isStreamStarted = true;
                        requestAnimationFrame(processStream); 
                        return;
                    }
                } catch (e) {
                }
                isStreamStarted = true;
            }
            
                lastMessageText += chunk;
                setMessages(prevMessages => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.sender === 'bot') {
                        return [
                            ...prevMessages.slice(0, -1),
                        { ...lastMessage, text: <ComparisonReportDisplay report={lastMessageText} />, isLoading: true }
                        ];
                    }
                    return prevMessages;
                });
            
            requestAnimationFrame(processStream);
        };
        await processStream();
    } catch (err) {
        setMessages(prev => prev.slice(0, -1));
        setError('The AI is having a moment. Please try again.');
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleComparisonChat = async (query: string) => {
    setIsChatLoading(true);
    const userMessage: Message = {
      id: Date.now(),
      text: query,
      sender: 'user',
    };
    setMessages(prev => [...prev, userMessage, { id: Date.now() + 1, text: '', sender: 'bot', isLoading: true }]);
    setTimeout(() => scrollToBottom(), 0);

    try {
        const response = await fetch('/api/policies/compare/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              message: query,
              policy_ids: comparisonPolicyIds,
              conversation_id: conversationId
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'The AI is feeling a bit under the weather. Please try again later.');
        }

        if (!response.body) {
            throw new Error("The response body is empty.");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        let isStreamStarted = false;
        let lastMessageText = '';
        
        const processStream = async () => {
            const { value, done } = await reader.read();
            if (done) {
        setMessages(prev => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.sender === 'bot') {
                return [...prev.slice(0, -1), { ...lastMessage, isLoading: false }];
            }
            return prev;
        });
                setIsChatLoading(false);
                return;
            }
            
            const chunk = decoder.decode(value, { stream: true });
            
            // The comparison chat streams NDJSON, so we handle it line by line
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
                try {
                    const data = JSON.parse(line);

                    if (!isStreamStarted && data.conversation_id) {
                        setConversationId(data.conversation_id);
                        isStreamStarted = true;
                    }

                    if(data.content_chunk) {
                        lastMessageText += data.content_chunk;
                    }
                } catch (e) {
                    // It might not be JSON, but a regular text chunk. Append directly.
                    // This is especially true for the comparison follow-up chat.
                    lastMessageText += chunk;
                }
            }
            
            setMessages(prevMessages => {
                const lastMessage = prevMessages[prevMessages.length - 1];
                if (lastMessage && lastMessage.sender === 'bot') {
                    // For the follow up chat, we also want rich markdown rendering
                    return [
                        ...prevMessages.slice(0, -1),
                        { ...lastMessage, text: <ComparisonReportDisplay report={lastMessageText} />, isLoading: true }
                    ];
                }
                return prevMessages;
            });
            
            requestAnimationFrame(processStream);
        };
        await processStream();

    } catch (err) {
        setMessages(prev => prev.slice(0, -1));
        setError('The AI is having a moment. Please try again.');
    } finally {
        setIsChatLoading(false);
    }
  }
  
  const handleFileUpload = (file: File) => {
    console.log("File selected:", file.name);
    const uploadMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: `You've selected ${file.name} for analysis.`
    };
    setMessages(prev => [...prev, uploadMessage]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const triggerFileSelect = (accept: string) => {
    if (fileInputRef.current) {
        fileInputRef.current.accept = accept;
        fileInputRef.current.click();
    }
  };

      return (
    <Layout>
      <div className="flex flex-col h-full">
        {!isChatActive ? (
        <div className="flex flex-col items-center justify-center h-full p-8 bg-neutral-50">
          <div className="text-center mb-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-neutral-900 mb-3">Ask Anything</h1>
            <p className="text-neutral-600 text-lg">
              Get instant answers from your policy documents.
            </p>
          </div>
          <div className="w-full max-w-2xl">
              <SearchSection onSearch={() => {}} onQuerySubmit={handleQuery} isLoading={isChatLoading} />
            </div>
                  </div>
        ) : (
          <>
            <ScrollArea className="flex-1 bg-neutral-100/50" ref={messagesEndRef}>
              <div className="p-6 space-y-6 max-w-5xl mx-auto">
                          {messages.map((message) => (
                    <div key={message.id} className={`flex items-start gap-4 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                  {message.sender === 'bot' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot className="w-5 h-5"/></AvatarFallback>
                                      </Avatar>
                                  )}
                        <div className={`rounded-lg p-4 max-w-[75%] ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-white'}`}>
                            <ChatMessageContent content={message.text} />
                            {message.isLoading && (
                                <p className="text-sm text-gray-500 mt-2 animate-pulse">thinking...</p>
                            )}
                                  </div>
                                   {message.sender === 'user' && (
                            <Avatar className="h-8 w-8">
                                <AvatarFallback><User className="w-5 h-5"/></AvatarFallback>
                                      </Avatar>
                                  )}
                              </div>
                          ))}
                      </div>
                  </ScrollArea>
            <footer className="p-4 border-t">
              <div className="relative max-w-5xl mx-auto">
                        <Input
                    placeholder={selectedPolicy ? `Message ${selectedPolicy.policyName}...` : "Ask a follow-up question..."}
                    disabled={!selectedPolicy || isChatLoading}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend(e.currentTarget.value);
                            e.currentTarget.value = "";
                        }
                    }}
                    className="pr-24"
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => triggerFileSelect(".jpg,.jpeg,.png")}>
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Image
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => triggerFileSelect(".pdf,.doc,.docx")}>
                                <FileText className="w-4 h-4 mr-2" />
                                Document
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Button variant="ghost" size="icon" onClick={() => {
                        const input = document.querySelector('input[placeholder^="Message"]');
                        if (input) {
                          handleSend((input as HTMLInputElement).value);
                          (input as HTMLInputElement).value = "";
                        }
                    }} disabled={!selectedPolicy || isChatLoading}>
                        <Send className="h-5 w-5" />
                        </Button>
                </div>
              </div>
            </footer>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
            />
          </>
        )}
          </div>
    </Layout>
  );
}
