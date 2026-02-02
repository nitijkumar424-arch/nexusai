'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wand2, 
  Download, 
  ArrowLeft,
  Sparkles,
  FileText,
  Code,
  Image,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Palette,
  Circle,
  Hexagon,
  Square,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type GenerationType = 'logo' | 'document' | 'code';

interface GeneratedResult {
  content: string;
  filename: string;
  downloadUrl: string;
  mimeType: string;
}

const logoStyles = [
  { id: 'modern', name: 'Modern', icon: Square, description: 'Rounded rectangle with gradient' },
  { id: 'circle', name: 'Circle', icon: Circle, description: 'Circular with gradient' },
  { id: 'hexagon', name: 'Hexagon', icon: Hexagon, description: 'Hexagonal shape' },
  { id: 'minimal', name: 'Minimal', icon: Square, description: 'Clean bordered design' },
  { id: 'tech', name: 'Tech', icon: Zap, description: 'Dark tech aesthetic' },
];

const documentTypes = [
  { id: 'resume', name: 'Resume/CV', description: 'Professional resume template' },
  { id: 'cover_letter', name: 'Cover Letter', description: 'Job application cover letter' },
  { id: 'business_plan', name: 'Business Plan', description: 'Startup business plan' },
  { id: 'readme', name: 'README', description: 'Project documentation' },
];

const codeLanguages = [
  { id: 'react', name: 'React/TypeScript', types: ['component', 'hook'] },
  { id: 'node', name: 'Node.js', types: ['api'] },
  { id: 'python', name: 'Python', types: ['script'] },
];

export default function CreatePage() {
  const [activeTab, setActiveTab] = useState<GenerationType>('logo');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Logo state
  const [logoName, setLogoName] = useState('');
  const [logoStyle, setLogoStyle] = useState('modern');

  // Document state
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('resume');
  const [docContent, setDocContent] = useState('');

  // Code state
  const [codeName, setCodeName] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('react');
  const [codeType, setCodeType] = useState('component');

  const handleGenerate = async () => {
    setLoading(true);
    try {
      let body: Record<string, string> = { type: activeTab };

      if (activeTab === 'logo') {
        body = { ...body, name: logoName, style: logoStyle };
      } else if (activeTab === 'document') {
        body = { ...body, name: docName, documentType: docType, prompt: docContent };
      } else if (activeTab === 'code') {
        body = { ...body, name: codeName, language: codeLanguage, codeType: codeType };
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          content: data.content,
          filename: data.filename,
          downloadUrl: data.downloadUrl,
          mimeType: data.mimeType,
        });
        setDialogOpen(true);
      }
    } catch (error) {
      console.error('Generation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result.downloadUrl;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-purple-500/5" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to NEXUS AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="NEXUS AI" className="h-8 w-8" />
            <span className="font-semibold">Creator</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="px-4 py-1 mb-4">
            <Wand2 className="h-3 w-3 mr-1" />
            AI-Powered Generator
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Create Anything
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Generate logos, documents, and code instantly. Get your download link immediately!
          </p>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as GenerationType)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="logo" className="gap-2">
              <Palette className="h-4 w-4" />
              Logo
            </TabsTrigger>
            <TabsTrigger value="document" className="gap-2">
              <FileText className="h-4 w-4" />
              Document
            </TabsTrigger>
            <TabsTrigger value="code" className="gap-2">
              <Code className="h-4 w-4" />
              Code
            </TabsTrigger>
          </TabsList>

          {/* Logo Tab */}
          <TabsContent value="logo">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Brand/Company Name</label>
                <Input
                  placeholder="e.g., TechFlow, MyStartup, John Doe"
                  value={logoName}
                  onChange={(e) => setLogoName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Logo Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {logoStyles.map((style) => {
                    const Icon = style.icon;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setLogoStyle(style.id)}
                        className={`p-4 rounded-lg border text-center transition-all ${
                          logoStyle === style.id
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`h-6 w-6 mx-auto mb-2 ${logoStyle === style.id ? 'text-primary' : ''}`} />
                        <p className="text-xs font-medium">{style.name}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!logoName || loading}
                className="w-full gap-2"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Generate Logo
              </Button>
            </motion.div>
          </TabsContent>

          {/* Document Tab */}
          <TabsContent value="document">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Name/Title</label>
                  <Input
                    placeholder="e.g., My Resume, Project Name"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Document Type</label>
                  <Select value={docType} onValueChange={setDocType}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {documentTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Details (Optional)</label>
                <Textarea
                  placeholder="Add any specific details you want to include..."
                  value={docContent}
                  onChange={(e) => setDocContent(e.target.value)}
                  className="bg-background/50 min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!docName || loading}
                className="w-full gap-2"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                Generate Document
              </Button>
            </motion.div>
          </TabsContent>

          {/* Code Tab */}
          <TabsContent value="code">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6"
            >
              <div className="space-y-2">
                <label className="text-sm font-medium">Component/Function Name</label>
                <Input
                  placeholder="e.g., UserProfile, fetchData, DataProcessor"
                  value={codeName}
                  onChange={(e) => setCodeName(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Language</label>
                  <Select value={codeLanguage} onValueChange={(v) => {
                    setCodeLanguage(v);
                    setCodeType(codeLanguages.find(l => l.id === v)?.types[0] || 'component');
                  }}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {codeLanguages.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <Select value={codeType} onValueChange={setCodeType}>
                    <SelectTrigger className="bg-background/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {codeLanguages.find(l => l.id === codeLanguage)?.types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={!codeName || loading}
                className="w-full gap-2"
                size="lg"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Code className="h-4 w-4" />
                )}
                Generate Code
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 text-center"
        >
          <h3 className="text-lg font-semibold mb-4">How it works</h3>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">1</span>
              Choose type & fill details
            </div>
            <span className="hidden sm:block">→</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">2</span>
              Click Generate
            </div>
            <span className="hidden sm:block">→</span>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center text-xs font-bold">3</span>
              Download your file
            </div>
          </div>
        </motion.div>
      </main>

      {/* Result Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Generated Successfully!
            </DialogTitle>
            <DialogDescription>
              Your {activeTab} is ready. Choose your preferred format to download.
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-4 py-4">
              {/* Preview */}
              {activeTab === 'logo' && (
                <div className="flex justify-center p-4 bg-muted/50 rounded-lg">
                  <div 
                    dangerouslySetInnerHTML={{ __html: result.content }} 
                    className="w-32 h-32"
                  />
                </div>
              )}

              {(activeTab === 'document' || activeTab === 'code') && (
                <div className="bg-muted/50 rounded-lg p-4 max-h-48 overflow-auto">
                  <pre className="text-xs whitespace-pre-wrap font-mono">
                    {result.content.slice(0, 800)}
                    {result.content.length > 800 && '...'}
                  </pre>
                </div>
              )}

              {/* File info */}
              <div className="flex items-center justify-between text-sm text-muted-foreground p-3 bg-muted/30 rounded-lg">
                <span className="font-medium">{result.filename}</span>
                <span>{result.mimeType}</span>
              </div>

              {/* Actions */}
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={handleCopy} className="gap-2">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Copied!' : 'Copy Content'}
                </Button>
                <Button onClick={handleDownload} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download File
                </Button>
              </div>

              {/* Generate another */}
              <Button 
                variant="ghost" 
                onClick={() => setDialogOpen(false)}
                className="w-full gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Generate Another
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>
          Made with ❤️ by <a href="https://github.com/nitijkumar424-arch" className="text-primary hover:underline">Nitij Kumar</a>
        </p>
      </footer>
    </div>
  );
}
