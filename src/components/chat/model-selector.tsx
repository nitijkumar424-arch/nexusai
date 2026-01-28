'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronDown, 
  Zap, 
  Brain, 
  Sparkles,
  Check,
  Rocket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { AI_MODELS, getModelsByProvider } from '@/lib/models';
import { AIModel } from '@/types';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (model: AIModel) => void;
}

const providerIcons: Record<string, typeof Zap> = {
  fireworks: Rocket,
  groq: Zap,
  google: Brain,
  openrouter: Sparkles,
};

const providerColors: Record<string, string> = {
  fireworks: 'text-orange-500',
  groq: 'text-green-500',
  google: 'text-blue-500',
  openrouter: 'text-purple-500',
};

const providerLabels: Record<string, string> = {
  fireworks: 'Fireworks AI',
  groq: 'Groq (Ultra Fast)',
  google: 'Google AI',
  openrouter: 'OpenRouter',
};

export function ModelSelector({ selectedModelId, onSelectModel }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedModel = AI_MODELS.find(m => m.id === selectedModelId) || AI_MODELS[0];
  const Icon = providerIcons[selectedModel.provider];

  const providers = ['fireworks', 'groq', 'google', 'openrouter'];

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
          <Icon className={cn("h-4 w-4", providerColors[selectedModel.provider])} />
          <span className="max-w-[150px] truncate">{selectedModel.name}</span>
          {selectedModel.speed === 'fast' && (
            <Zap className="h-3 w-3 text-yellow-500 fill-yellow-500" />
          )}
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start">
        {providers.map((provider) => {
          const models = getModelsByProvider(provider);
          if (models.length === 0) return null;
          
          const ProviderIcon = providerIcons[provider];
          
          return (
            <div key={provider}>
              <DropdownMenuLabel className="flex items-center gap-2">
                <ProviderIcon className={cn("h-4 w-4", providerColors[provider])} />
                {providerLabels[provider]}
              </DropdownMenuLabel>
              <DropdownMenuGroup>
                {models.map((model) => (
                  <DropdownMenuItem
                    key={model.id}
                    onClick={() => {
                      onSelectModel(model);
                      setOpen(false);
                    }}
                    className="flex items-start gap-3 py-2 cursor-pointer"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{model.name}</span>
                        {model.speed === 'fast' && (
                          <Badge variant="secondary" className="h-5 text-[10px] gap-1">
                            <Zap className="h-2.5 w-2.5 fill-current" />
                            Fast
                          </Badge>
                        )}
                        {selectedModelId === model.id && (
                          <Check className="h-4 w-4 text-primary ml-auto" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {model.description}
                      </p>
                      {model.capabilities && (
                        <div className="flex gap-1 flex-wrap">
                          {model.capabilities.map((cap) => (
                            <span
                              key={cap}
                              className="text-[10px] px-1.5 py-0.5 rounded bg-muted"
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
