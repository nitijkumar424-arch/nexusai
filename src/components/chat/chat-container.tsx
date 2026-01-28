'use client';

import { useRef, useEffect, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  Sparkles, 
  ArrowDown,
  MessageSquarePlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { ModelSelector } from './model-selector';
import { PersonaSelector } from './persona-selector';
import { useChatStore } from '@/store/chat-store';
import { getModelById, AI_MODELS } from '@/lib/models';
import { WebSource, AIModel, Persona } from '@/types';
import { cn } from '@/lib/utils';

interface ChatContainerProps {
  onToggleSidebar: () => void;
}

export function ChatContainer({ onToggleSidebar }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const {
    conversations,
    currentConversationId,
    settings,
    personas,
    createConversation,
    getCurrentConversation,
    addMessage,
    updateMessage,
    updateConversation,
    branchConversation,
    isSidebarOpen,
  } = useChatStore();

  const currentConversation = getCurrentConversation();
  const currentModel = currentConversation 
    ? getModelById(currentConversation.model) || AI_MODELS[0]
    : AI_MODELS[0];
  const currentPersona = personas.find(p => p.id === currentConversation?.persona) || personas[0];

  const scrollToBottom = useCallback((smooth = true) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: smooth ? 'smooth' : 'auto',
      });
    }
  }, []);

  useEffect(() => {
    scrollToBottom(false);
  }, [currentConversationId, scrollToBottom]);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
      }
    };

    const scrollEl = scrollRef.current;
    scrollEl?.addEventListener('scroll', handleScroll);
    return () => scrollEl?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = useCallback(async (content: string, enableWebSearch: boolean) => {
    let conversationId = currentConversationId;
    
    if (!conversationId) {
      conversationId = createConversation(currentModel.id, currentPersona.id);
    }

    // Add user message
    addMessage(conversationId, {
      role: 'user',
      content,
    });

    // Get web search results if enabled
    let sources: WebSource[] = [];
    if (enableWebSearch && settings.enableWebSearch) {
      try {
        const searchResponse = await fetch('/api/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: content }),
        });
        const searchData = await searchResponse.json();
        sources = searchData.results || [];
      } catch (error) {
        console.error('Search failed:', error);
      }
    }

    // Add assistant message placeholder
    const assistantMessageId = addMessage(conversationId, {
      role: 'assistant',
      content: '',
      model: currentModel.id,
      isStreaming: true,
      sources: sources.length > 0 ? sources : undefined,
    });

    setIsStreaming(true);
    abortControllerRef.current = new AbortController();

    try {
      const conversation = conversations.find(c => c.id === conversationId);
      const messages = conversation?.messages.slice(0, -1).map(m => ({
        role: m.role,
        content: m.content,
      })) || [];

      // Add search context to the message if we have sources
      let finalContent = content;
      if (sources.length > 0) {
        const searchContext = sources.map(s => `[${s.title}](${s.url}): ${s.snippet}`).join('\n\n');
        finalContent = `Based on the following web search results:\n\n${searchContext}\n\nUser question: ${content}\n\nProvide a comprehensive answer with citations to the sources.`;
      }

      messages.push({ role: 'user', content: finalContent });

      const apiEndpoint = currentModel.provider === 'google' 
        ? '/api/chat/google' 
        : '/api/chat';

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          model: currentModel.id,
          provider: currentModel.provider,
          systemPrompt: currentPersona.systemPrompt,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          fullContent += chunk;
          updateMessage(conversationId!, assistantMessageId, {
            content: fullContent,
            isStreaming: true,
          });
          scrollToBottom();
        }
      }

      updateMessage(conversationId!, assistantMessageId, {
        content: fullContent,
        isStreaming: false,
      });

      // Update conversation title if it's the first message
      if (conversation?.messages.length === 1) {
        const title = content.slice(0, 50) + (content.length > 50 ? '...' : '');
        updateConversation(conversationId!, { title });
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        updateMessage(conversationId!, assistantMessageId, {
          content: 'Response stopped.',
          isStreaming: false,
        });
      } else {
        console.error('Chat error:', error);
        updateMessage(conversationId!, assistantMessageId, {
          content: 'Sorry, an error occurred. Please try again.',
          isStreaming: false,
        });
      }
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  }, [
    currentConversationId,
    currentModel,
    currentPersona,
    settings.enableWebSearch,
    conversations,
    createConversation,
    addMessage,
    updateMessage,
    updateConversation,
    scrollToBottom,
  ]);

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const handleRegenerate = useCallback(() => {
    if (!currentConversation) return;
    const lastUserMessage = [...currentConversation.messages]
      .reverse()
      .find(m => m.role === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content, false);
    }
  }, [currentConversation, handleSendMessage]);

  const handleBranch = useCallback((messageIndex: number) => {
    if (currentConversationId) {
      branchConversation(currentConversationId, messageIndex);
    }
  }, [currentConversationId, branchConversation]);

  const handleModelChange = useCallback((model: AIModel) => {
    if (currentConversationId) {
      updateConversation(currentConversationId, { model: model.id });
    }
  }, [currentConversationId, updateConversation]);

  const handlePersonaChange = useCallback((persona: Persona) => {
    if (currentConversationId) {
      updateConversation(currentConversationId, { persona: persona.id });
    }
  }, [currentConversationId, updateConversation]);

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <header className={cn(
        "flex items-center justify-between px-4 py-3 border-b",
        "bg-background/80 backdrop-blur-xl z-10"
      )}>
        <div className="flex items-center gap-3">
          {!isSidebarOpen && (
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={onToggleSidebar}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <ModelSelector
            selectedModelId={currentModel.id}
            onSelectModel={handleModelChange}
          />
          <PersonaSelector
            selectedPersonaId={currentPersona.id}
            onSelectPersona={handlePersonaChange}
          />
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => createConversation()}
        >
          <MessageSquarePlus className="h-4 w-4" />
          New Chat
        </Button>
      </header>

      {/* Messages */}
      <div 
        ref={scrollRef} 
        className="flex-1 overflow-y-auto"
      >
        {currentConversation?.messages && currentConversation.messages.length > 0 ? (
          <div className="pb-32">
            {currentConversation.messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                persona={currentPersona}
                isLast={index === currentConversation.messages.length - 1}
                onRegenerate={
                  index === currentConversation.messages.length - 1 && 
                  message.role === 'assistant' && 
                  !message.isStreaming
                    ? handleRegenerate
                    : undefined
                }
                onBranch={() => handleBranch(index)}
              />
            ))}
          </div>
        ) : (
          <WelcomeScreen onStartChat={(prompt) => handleSendMessage(prompt, false)} />
        )}
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 z-20"
          >
            <Button
              variant="secondary"
              size="icon"
              className="rounded-full shadow-lg"
              onClick={() => scrollToBottom()}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input */}
      <div className={cn(
        "absolute bottom-0 left-0 right-0 p-4",
        "bg-gradient-to-t from-background via-background to-transparent"
      )}>
        <div className="max-w-3xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isStreaming}
            onStop={handleStop}
          />
        </div>
      </div>
    </div>
  );
}

function WelcomeScreen({ onStartChat }: { onStartChat: (prompt: string) => void }) {
  const suggestions = [
    {
      title: 'Write code',
      prompt: 'Help me write a React component for a todo list with animations',
      icon: '💻',
    },
    {
      title: 'Explain concept',
      prompt: 'Explain how blockchain technology works in simple terms',
      icon: '💡',
    },
    {
      title: 'Creative writing',
      prompt: 'Write a short story about a time traveler who can only go forward',
      icon: '✨',
    },
    {
      title: 'Analyze data',
      prompt: 'What are the key factors to consider when analyzing market trends?',
      icon: '📊',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-2xl"
      >
        <div className="relative">
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: 'reverse'
            }}
            className="h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center"
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
          <div className="absolute inset-0 h-20 w-20 mx-auto rounded-2xl bg-gradient-to-br from-primary via-purple-500 to-pink-500 blur-2xl opacity-50" />
        </div>

        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Nexus AI</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Your intelligent assistant powered by multiple AI models
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
          {suggestions.map((suggestion, index) => (
            <motion.button
              key={suggestion.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onStartChat(suggestion.prompt)}
              className={cn(
                "flex items-start gap-3 p-4 rounded-xl text-left",
                "bg-muted/50 hover:bg-muted transition-colors",
                "border border-transparent hover:border-primary/20"
              )}
            >
              <span className="text-2xl">{suggestion.icon}</span>
              <div>
                <div className="font-medium">{suggestion.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">
                  {suggestion.prompt}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
