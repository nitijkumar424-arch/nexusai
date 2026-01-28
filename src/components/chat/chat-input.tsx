'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Mic, 
  MicOff, 
  Globe, 
  Paperclip, 
  StopCircle, 
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useChatStore } from '@/store/chat-store';
import { cn } from '@/lib/utils';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface ChatInputProps {
  onSendMessage: (content: string, enableWebSearch: boolean) => void;
  isLoading: boolean;
  onStop?: () => void;
}

export function ChatInput({ onSendMessage, isLoading, onStop }: ChatInputProps) {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [webSearchEnabled, setWebSearchEnabled] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  
  const { settings } = useChatStore();

  useEffect(() => {
    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = Array.from({ length: event.results.length }, (_, i) => event.results[i])
          .map(result => result[0].transcript)
          .join('');
        setInput(transcript);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  }, [isListening]);

  const handleSubmit = useCallback(() => {
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim(), webSearchEnabled);
    setInput('');
  }, [input, isLoading, webSearchEnabled, onSendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && settings.sendWithEnter) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit, settings.sendWithEnter]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [input]);

  return (
    <TooltipProvider>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative"
      >
        <div className={cn(
          "relative flex flex-col rounded-2xl border bg-background/80 backdrop-blur-xl",
          "shadow-lg shadow-primary/5 transition-all duration-300",
          "focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary/30"
        )}>
          {/* Web Search Indicator */}
          <AnimatePresence>
            {webSearchEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-4 pt-3 pb-1"
              >
                <div className="flex items-center gap-2 text-sm text-primary">
                  <Globe className="h-4 w-4" />
                  <span>Web search enabled - I&apos;ll search the internet for current information</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="flex items-end gap-2 p-3">
            <div className="flex gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-9 w-9 rounded-xl transition-all",
                      webSearchEnabled && "bg-primary/10 text-primary"
                    )}
                    onClick={() => setWebSearchEnabled(!webSearchEnabled)}
                  >
                    <Globe className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Toggle web search</p>
                </TooltipContent>
              </Tooltip>

              {settings.enableVoice && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-9 w-9 rounded-xl transition-all",
                        isListening && "bg-red-500/10 text-red-500 animate-pulse"
                      )}
                      onClick={toggleListening}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{isListening ? 'Stop listening' : 'Voice input'}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-xl"
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p>Attach file</p>
                </TooltipContent>
              </Tooltip>
            </div>

            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className={cn(
                "flex-1 min-h-[44px] max-h-[200px] resize-none border-0",
                "bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0",
                "placeholder:text-muted-foreground/50 text-base"
              )}
              rows={1}
            />

            <div className="flex gap-1">
              {isLoading ? (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-9 w-9 rounded-xl"
                  onClick={onStop}
                >
                  <StopCircle className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  variant="default"
                  size="icon"
                  className={cn(
                    "h-9 w-9 rounded-xl transition-all",
                    "bg-gradient-to-r from-primary to-primary/80",
                    !input.trim() && "opacity-50 cursor-not-allowed"
                  )}
                  onClick={handleSubmit}
                  disabled={!input.trim()}
                >
                  {input.trim() ? (
                    <Send className="h-4 w-4" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Subtle gradient glow effect */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-xl transition-opacity group-focus-within:opacity-100 -z-10" />
      </motion.div>
    </TooltipProvider>
  );
}
