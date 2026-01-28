'use client';

import { memo } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { format } from 'date-fns';
import { 
  User, 
  Copy, 
  Check, 
  RotateCcw, 
  GitBranch,
  Volume2,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { CodeBlock } from './code-block';
import { Message, Persona } from '@/types';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
  persona?: Persona;
  onRegenerate?: () => void;
  onBranch?: () => void;
  isLast?: boolean;
}

export const ChatMessage = memo(function ChatMessage({ 
  message, 
  persona,
  onRegenerate, 
  onBranch,
  isLast 
}: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const isUser = message.role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring' as const,
        stiffness: 500,
        damping: 30
      }
    }
  };

  return (
    <TooltipProvider>
      <motion.div
        variants={messageVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "group relative flex gap-4 px-4 py-6",
          isUser ? "bg-transparent" : "bg-muted/30"
        )}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <Avatar className={cn(
            "h-8 w-8 ring-2 ring-background",
            isUser ? "bg-primary" : "bg-gradient-to-br from-purple-500 to-pink-500"
          )}>
            <AvatarFallback className="text-xs font-bold text-white">
              {isUser ? <User className="h-4 w-4" /> : (persona?.avatar || 'N')}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold">
              {isUser ? 'You' : (persona?.name || 'Nexus')}
            </span>
            <span className="text-muted-foreground text-xs">
              {format(new Date(message.createdAt), 'h:mm a')}
            </span>
            {message.model && !isUser && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                {message.model.split('/').pop()?.split('-').slice(0, 2).join('-')}
              </span>
            )}
          </div>

          {/* Web Sources */}
          {message.sources && message.sources.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap gap-2 pb-2"
            >
              {message.sources.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg",
                    "bg-background border text-sm hover:bg-muted transition-colors"
                  )}
                >
                  {source.favicon && (
                    <img src={source.favicon} alt="" className="h-4 w-4 rounded" />
                  )}
                  <span className="truncate max-w-[200px]">{source.title}</span>
                  <ExternalLink className="h-3 w-3 text-muted-foreground" />
                </a>
              ))}
            </motion.div>
          )}

          {/* Message Content */}
          <div className={cn(
            "prose prose-sm dark:prose-invert max-w-none",
            "prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent",
            "[&_pre]:my-0 [&_p]:my-2"
          )}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  const code = String(children).replace(/\n$/, '');
                  
                  if (match) {
                    return (
                      <CodeBlock
                        code={code}
                        language={match[1]}
                        showLineNumbers={code.split('\n').length > 1}
                      />
                    );
                  }
                  
                  return (
                    <code
                      className={cn(
                        "px-1.5 py-0.5 rounded-md bg-muted font-mono text-sm",
                        className
                      )}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                a({ href, children }) {
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      {children}
                    </a>
                  );
                },
                table({ children }) {
                  return (
                    <div className="overflow-x-auto my-4">
                      <table className="min-w-full divide-y divide-border">
                        {children}
                      </table>
                    </div>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Streaming indicator */}
          {message.isStreaming && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-1 text-muted-foreground"
            >
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs">Thinking...</span>
            </motion.div>
          )}

          {/* Actions */}
          {!isUser && !message.isStreaming && (
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5 text-green-500" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Copy</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleSpeak}
                  >
                    <Volume2 className={cn("h-3.5 w-3.5", isSpeaking && "text-primary")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isSpeaking ? 'Stop' : 'Read aloud'}</TooltipContent>
              </Tooltip>

              {isLast && onRegenerate && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={onRegenerate}
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Regenerate</TooltipContent>
                </Tooltip>
              )}

              {onBranch && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={onBranch}
                    >
                      <GitBranch className="h-3.5 w-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Branch from here</TooltipContent>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </TooltipProvider>
  );
});
