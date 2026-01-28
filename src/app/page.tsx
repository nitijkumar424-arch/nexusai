'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/sidebar';
import { ChatContainer } from '@/components/chat/chat-container';
import { SettingsDialog } from '@/components/settings/settings-dialog';
import { useChatStore } from '@/store/chat-store';
import { Heart } from 'lucide-react';

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { toggleSidebar } = useChatStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Sidebar */}
      <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatContainer onToggleSidebar={toggleSidebar} />
        
        {/* Developer Credits Footer */}
        <footer className="flex items-center justify-center gap-1.5 py-2 text-xs text-muted-foreground border-t border-border/50 bg-background/50 backdrop-blur-sm">
          <span>Developed with</span>
          <Heart className="h-3 w-3 text-red-500 fill-red-500" />
          <span>by</span>
          <a 
            href="https://github.com/nitijkumar424-arch" 
            target="_blank" 
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Nitij Kumar
          </a>
        </footer>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  );
}
