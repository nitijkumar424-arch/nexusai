'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Settings,
  ChevronLeft,
  Search,
  Sparkles,
  Clock,
  ShoppingBag,
  Download,
  Wand2,
  BarChart3
} from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek, isThisMonth } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useChatStore } from '@/store/chat-store';
import { Conversation } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onOpenSettings: () => void;
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const { 
    conversations, 
    currentConversationId, 
    isSidebarOpen,
    createConversation, 
    deleteConversation, 
    setCurrentConversation,
    toggleSidebar
  } = useChatStore();

  const filteredConversations = conversations.filter(c =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = groupConversationsByDate(filteredConversations);

  const sidebarVariants = {
    open: { width: 280, opacity: 1 },
    closed: { width: 0, opacity: 0 }
  };

  return (
    <TooltipProvider>
      <motion.div
        variants={sidebarVariants}
        initial={false}
        animate={isSidebarOpen ? 'open' : 'closed'}
        className={cn(
          "relative flex flex-col h-full border-r bg-card/50 backdrop-blur-xl",
          "overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">Nexus AI</span>
          </motion.div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={() => createConversation()}
            className={cn(
              "w-full justify-start gap-2",
              "bg-gradient-to-r from-primary/10 to-purple-500/10",
              "hover:from-primary/20 hover:to-purple-500/20",
              "border border-primary/20"
            )}
            variant="outline"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Search */}
        <div className="px-3 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 bg-background/50"
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1 px-2">
          <div className="space-y-4 py-2">
            {Object.entries(groupedConversations).map(([group, convos]) => (
              <div key={group}>
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  {group}
                </div>
                <div className="space-y-1">
                  <AnimatePresence mode="popLayout">
                    {convos.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setCurrentConversation(conversation.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              setCurrentConversation(conversation.id);
                            }
                          }}
                          className={cn(
                            "group w-full flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer",
                            "text-left text-sm transition-all duration-200",
                            "hover:bg-muted/50",
                            currentConversationId === conversation.id
                              ? "bg-primary/10 text-primary"
                              : "text-foreground/80"
                          )}
                        >
                          <MessageSquare className={cn(
                            "h-4 w-4 flex-shrink-0",
                            currentConversationId === conversation.id
                              ? "text-primary"
                              : "text-muted-foreground"
                          )} />
                          <span className="truncate flex-1">
                            {conversation.title}
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className={cn(
                                  "h-6 w-6 opacity-0 group-hover:opacity-100",
                                  "hover:bg-destructive/10 hover:text-destructive"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteConversation(conversation.id);
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs mt-1">Start a new chat to begin</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-3 border-t space-y-1">
          <Link href="/create">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 text-primary"
            >
              <Wand2 className="h-4 w-4" />
              Create
            </Button>
          </Link>
          <Link href="/analytics">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Button>
          </Link>
          <Link href="/downloads">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <Download className="h-4 w-4" />
              Downloads
            </Button>
          </Link>
          <Link href="/recommendations">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              Recommendations
            </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={onOpenSettings}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Button>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}

function groupConversationsByDate(conversations: Conversation[]) {
  const groups: Record<string, Conversation[]> = {};

  for (const conv of conversations) {
    const date = new Date(conv.updatedAt);
    let group: string;

    if (isToday(date)) {
      group = 'Today';
    } else if (isYesterday(date)) {
      group = 'Yesterday';
    } else if (isThisWeek(date)) {
      group = 'This Week';
    } else if (isThisMonth(date)) {
      group = 'This Month';
    } else {
      group = format(date, 'MMMM yyyy');
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(conv);
  }

  return groups;
}
