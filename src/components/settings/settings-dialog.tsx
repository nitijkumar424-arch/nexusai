'use client';

import { motion } from 'framer-motion';
import { X, Moon, Sun, Volume2, Globe, Keyboard, Trash2, Download, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useChatStore } from '@/store/chat-store';
import { AI_MODELS } from '@/lib/models';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const { settings, updateSettings, personas, clearAllData, conversations } = useChatStore();
  const { theme, setTheme } = useTheme();

  const handleExport = () => {
    const data = {
      conversations,
      settings,
      personas,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-ai-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        // Import logic would go here
        console.log('Imported data:', data);
      } catch (error) {
        console.error('Failed to import:', error);
      }
    };
    input.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Settings</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="models">Models</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto py-4">
            <TabsContent value="general" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Keyboard className="h-4 w-4" />
                  Input Preferences
                </h3>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Send with Enter</Label>
                    <p className="text-sm text-muted-foreground">
                      Press Enter to send messages (Shift+Enter for new line)
                    </p>
                  </div>
                  <Switch
                    checked={settings.sendWithEnter}
                    onCheckedChange={(checked) => updateSettings({ sendWithEnter: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Stream Responses</Label>
                    <p className="text-sm text-muted-foreground">
                      Show AI responses as they&apos;re generated
                    </p>
                  </div>
                  <Switch
                    checked={settings.streamResponses}
                    onCheckedChange={(checked) => updateSettings({ streamResponses: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Volume2 className="h-4 w-4" />
                  Voice Features
                </h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Voice Input</Label>
                    <p className="text-sm text-muted-foreground">
                      Use microphone for voice-to-text input
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableVoice}
                    onCheckedChange={(checked) => updateSettings({ enableVoice: checked })}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Web Search
                </h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable Web Search</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow AI to search the web for current information
                    </p>
                  </div>
                  <Switch
                    checked={settings.enableWebSearch}
                    onCheckedChange={(checked) => updateSettings({ enableWebSearch: checked })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="models" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold">Default Model</h3>
                <Select
                  value={settings.defaultModel}
                  onValueChange={(value) => updateSettings({ defaultModel: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AI_MODELS.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="flex items-center gap-2">
                          <span>{model.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ({model.provider})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  This model will be used for new conversations by default.
                </p>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Default Persona</h3>
                <Select
                  value={settings.defaultPersona}
                  onValueChange={(value) => updateSettings({ defaultPersona: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {personas.map((persona) => (
                      <SelectItem key={persona.id} value={persona.id}>
                        {persona.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">API Keys Status</h3>
                <div className="grid gap-2">
                  {[
                    { name: 'Fireworks AI', key: 'FIREWORKS_API_KEY', status: true },
                    { name: 'Groq', key: 'GROQ_API_KEY', status: false },
                    { name: 'Google AI', key: 'GOOGLE_GENERATIVE_AI_API_KEY', status: false },
                    { name: 'OpenRouter', key: 'OPENROUTER_API_KEY', status: false },
                  ].map((provider) => (
                    <div
                      key={provider.key}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <span>{provider.name}</span>
                      <span className={cn(
                        "text-xs px-2 py-1 rounded-full",
                        provider.status 
                          ? "bg-green-500/10 text-green-500" 
                          : "bg-yellow-500/10 text-yellow-500"
                      )}>
                        {provider.status ? 'Configured' : 'Not Set'}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  Add API keys in your .env.local file to enable more models.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  {theme === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                  Theme
                </h3>
                
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'system'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={cn(
                        "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                        theme === t 
                          ? "border-primary bg-primary/5" 
                          : "border-transparent bg-muted/50 hover:bg-muted"
                      )}
                    >
                      {t === 'light' && <Sun className="h-6 w-6" />}
                      {t === 'dark' && <Moon className="h-6 w-6" />}
                      {t === 'system' && (
                        <div className="relative h-6 w-6">
                          <Sun className="absolute h-4 w-4 top-0 left-0" />
                          <Moon className="absolute h-4 w-4 bottom-0 right-0" />
                        </div>
                      )}
                      <span className="text-sm capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold">Font Size</h3>
                <Select
                  value={settings.fontSize}
                  onValueChange={(value: 'small' | 'medium' | 'large') => 
                    updateSettings({ fontSize: value })
                  }
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="large">Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="data" className="space-y-6 mt-0">
              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Download all your conversations and settings as a JSON file.
                </p>
                <Button onClick={handleExport} variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export All Data
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </h3>
                <p className="text-sm text-muted-foreground">
                  Restore conversations from a previously exported file.
                </p>
                <Button onClick={handleImport} variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Import Data
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-semibold text-destructive flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Danger Zone
                </h3>
                <p className="text-sm text-muted-foreground">
                  Permanently delete all your data. This action cannot be undone.
                </p>
                <Button 
                  onClick={() => {
                    if (confirm('Are you sure? This will delete all conversations and settings.')) {
                      clearAllData();
                    }
                  }} 
                  variant="destructive" 
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete All Data
                </Button>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
