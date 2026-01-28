'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useChatStore } from '@/store/chat-store';
import { Persona } from '@/types';
import { cn } from '@/lib/utils';

interface PersonaSelectorProps {
  selectedPersonaId: string;
  onSelectPersona: (persona: Persona) => void;
}

export function PersonaSelector({ selectedPersonaId, onSelectPersona }: PersonaSelectorProps) {
  const [open, setOpen] = useState(false);
  const { personas } = useChatStore();
  
  const selectedPersona = personas.find(p => p.id === selectedPersonaId) || personas[0];

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 gap-2 px-3 border-dashed",
            "hover:border-solid hover:border-primary/50",
            "transition-all duration-200"
          )}
        >
          <Avatar className="h-5 w-5" style={{ backgroundColor: selectedPersona.color }}>
            <AvatarFallback className="text-[10px] text-white font-bold">
              {selectedPersona.avatar}
            </AvatarFallback>
          </Avatar>
          <span>{selectedPersona.name}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="start">
        {personas.map((persona) => (
          <DropdownMenuItem
            key={persona.id}
            onClick={() => {
              onSelectPersona(persona);
              setOpen(false);
            }}
            className="flex items-start gap-3 py-2 cursor-pointer"
          >
            <Avatar className="h-8 w-8 mt-0.5" style={{ backgroundColor: persona.color }}>
              <AvatarFallback className="text-xs text-white font-bold">
                {persona.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-medium">{persona.name}</span>
                {persona.isDefault && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                    Default
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {persona.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
