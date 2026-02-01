'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Image, 
  Code, 
  Package,
  Download,
  ArrowLeft,
  Star,
  FileCode,
  Palette,
  BookOpen,
  Layout,
  Terminal,
  Smartphone,
  X,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface FormatOption {
  format: string;
  label: string;
  icon: string;
  url: string;
}

interface DownloadItem {
  id: string;
  name: string;
  description: string;
  category: 'pdf' | 'image' | 'code' | 'digital';
  fileSize: string;
  downloads: number;
  icon: typeof FileText;
  formats: FormatOption[];
  tags: string[];
  featured?: boolean;
}

const downloads: DownloadItem[] = [
  // PDF Documents
  {
    id: 'pdf1',
    name: 'Developer Resume Template',
    description: 'Professional ATS-friendly resume template for software developers with modern design',
    category: 'pdf',
    fileSize: '245 KB',
    downloads: 2450,
    icon: FileText,
    formats: [
      { format: 'pdf', label: 'PDF Document', icon: '📄', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'docx', label: 'Word Document', icon: '📝', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'google', label: 'Google Docs', icon: '📋', url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs/copy' }
    ],
    tags: ['Resume', 'Career', 'Template'],
    featured: true
  },
  {
    id: 'pdf2',
    name: 'System Design Cheatsheet',
    description: 'Quick reference guide for system design interviews with diagrams and patterns',
    category: 'pdf',
    fileSize: '1.2 MB',
    downloads: 5820,
    icon: BookOpen,
    formats: [
      { format: 'pdf', label: 'PDF Document', icon: '📄', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'png', label: 'PNG Image', icon: '🖼️', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' }
    ],
    tags: ['Interview', 'System Design', 'Cheatsheet'],
    featured: true
  },
  {
    id: 'pdf3',
    name: 'Git Commands Reference',
    description: 'Complete Git command reference with examples and common workflows',
    category: 'pdf',
    fileSize: '580 KB',
    downloads: 3200,
    icon: Terminal,
    formats: [
      { format: 'pdf', label: 'PDF Document', icon: '📄', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'md', label: 'Markdown', icon: '📑', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' }
    ],
    tags: ['Git', 'Reference', 'Commands']
  },
  {
    id: 'pdf4',
    name: 'React Best Practices Guide',
    description: 'Comprehensive guide to React patterns, hooks, and performance optimization',
    category: 'pdf',
    fileSize: '890 KB',
    downloads: 4100,
    icon: FileCode,
    formats: [
      { format: 'pdf', label: 'PDF Document', icon: '📄', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'epub', label: 'EPUB eBook', icon: '📚', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' }
    ],
    tags: ['React', 'Best Practices', 'Guide']
  },

  // Images/Graphics
  {
    id: 'img1',
    name: 'Developer Wallpaper Pack',
    description: '10 high-resolution coding-themed wallpapers for desktop (4K resolution)',
    category: 'image',
    fileSize: '25 MB',
    downloads: 8900,
    icon: Palette,
    formats: [
      { format: 'zip', label: 'ZIP Archive (All)', icon: '📦', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'png', label: 'PNG (4K)', icon: '🖼️', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'jpg', label: 'JPG (Compressed)', icon: '📷', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' }
    ],
    tags: ['Wallpaper', '4K', 'Desktop'],
    featured: true
  },
  {
    id: 'img2',
    name: 'Tech Icon Set',
    description: '100+ tech and programming icons in SVG and PNG formats',
    category: 'image',
    fileSize: '5.5 MB',
    downloads: 3400,
    icon: Image,
    formats: [
      { format: 'svg', label: 'SVG (Vector)', icon: '✨', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'png', label: 'PNG (Raster)', icon: '🖼️', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'zip', label: 'ZIP (All Formats)', icon: '📦', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' }
    ],
    tags: ['Icons', 'SVG', 'Design']
  },
  {
    id: 'img3',
    name: 'Social Media Templates',
    description: 'Canva-compatible templates for LinkedIn, Twitter, and GitHub banners',
    category: 'image',
    fileSize: '12 MB',
    downloads: 2100,
    icon: Layout,
    formats: [
      { format: 'canva', label: 'Canva Template', icon: '🎨', url: 'https://www.canva.com/templates' },
      { format: 'psd', label: 'Photoshop PSD', icon: '🖌️', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'figma', label: 'Figma File', icon: '🔷', url: 'https://www.figma.com/community' }
    ],
    tags: ['Social Media', 'Templates', 'Banners']
  },

  // Code/Templates
  {
    id: 'code1',
    name: 'Next.js Starter Template',
    description: 'Production-ready Next.js 15 template with TypeScript, Tailwind, and authentication',
    category: 'code',
    fileSize: '2.1 MB',
    downloads: 6700,
    icon: Code,
    formats: [
      { format: 'zip', label: 'ZIP Download', icon: '📦', url: 'https://github.com/nitijkumar424-arch/nexusai/archive/refs/heads/main.zip' },
      { format: 'github', label: 'GitHub Clone', icon: '🐙', url: 'https://github.com/nitijkumar424-arch/nexusai' },
      { format: 'stackblitz', label: 'Open in StackBlitz', icon: '⚡', url: 'https://stackblitz.com/github/nitijkumar424-arch/nexusai' }
    ],
    tags: ['Next.js', 'TypeScript', 'Starter'],
    featured: true
  },
  {
    id: 'code2',
    name: 'React Component Library',
    description: '20+ reusable React components with TypeScript and Storybook documentation',
    category: 'code',
    fileSize: '1.5 MB',
    downloads: 4200,
    icon: Package,
    formats: [
      { format: 'npm', label: 'NPM Package', icon: '📦', url: 'https://www.npmjs.com' },
      { format: 'zip', label: 'ZIP Download', icon: '🗂️', url: 'https://github.com/nitijkumar424-arch/nexusai/archive/refs/heads/main.zip' },
      { format: 'github', label: 'GitHub Repo', icon: '🐙', url: 'https://github.com/nitijkumar424-arch/nexusai' }
    ],
    tags: ['React', 'Components', 'Library']
  },
  {
    id: 'code3',
    name: 'API Starter Kit',
    description: 'Node.js Express API boilerplate with JWT auth, MongoDB, and Docker setup',
    category: 'code',
    fileSize: '890 KB',
    downloads: 3800,
    icon: Terminal,
    formats: [
      { format: 'zip', label: 'ZIP Download', icon: '📦', url: 'https://github.com/nitijkumar424-arch/nexusai/archive/refs/heads/main.zip' },
      { format: 'github', label: 'GitHub Clone', icon: '🐙', url: 'https://github.com/nitijkumar424-arch/nexusai' }
    ],
    tags: ['Node.js', 'API', 'Boilerplate']
  },
  {
    id: 'code4',
    name: 'VS Code Settings & Extensions',
    description: 'My personal VS Code configuration with recommended extensions list',
    category: 'code',
    fileSize: '45 KB',
    downloads: 5500,
    icon: FileCode,
    formats: [
      { format: 'json', label: 'JSON Settings', icon: '⚙️', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'gist', label: 'GitHub Gist', icon: '📋', url: 'https://gist.github.com' }
    ],
    tags: ['VS Code', 'Config', 'Extensions']
  },

  // Digital Products
  {
    id: 'digital1',
    name: 'Portfolio Website Template',
    description: 'Beautiful portfolio template for developers with dark/light theme support',
    category: 'digital',
    fileSize: '3.2 MB',
    downloads: 7200,
    icon: Smartphone,
    formats: [
      { format: 'zip', label: 'ZIP Download', icon: '📦', url: 'https://github.com/nitijkumar424-arch/nexusai/archive/refs/heads/main.zip' },
      { format: 'vercel', label: 'Deploy to Vercel', icon: '▲', url: 'https://vercel.com/new' },
      { format: 'netlify', label: 'Deploy to Netlify', icon: '🌐', url: 'https://app.netlify.com/start' }
    ],
    tags: ['Portfolio', 'Template', 'Website'],
    featured: true
  },
  {
    id: 'digital2',
    name: 'Notion Productivity System',
    description: 'Complete Notion template for project management, notes, and goal tracking',
    category: 'digital',
    fileSize: '1.8 MB',
    downloads: 4600,
    icon: Layout,
    formats: [
      { format: 'notion', label: 'Duplicate to Notion', icon: '📓', url: 'https://www.notion.so/templates' },
      { format: 'pdf', label: 'PDF Guide', icon: '📄', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' }
    ],
    tags: ['Notion', 'Productivity', 'Template']
  },
  {
    id: 'digital3',
    name: 'Interview Prep Tracker',
    description: 'Excel/Google Sheets template to track your interview preparation progress',
    category: 'digital',
    fileSize: '320 KB',
    downloads: 3100,
    icon: FileText,
    formats: [
      { format: 'sheets', label: 'Google Sheets', icon: '📊', url: 'https://docs.google.com/spreadsheets' },
      { format: 'xlsx', label: 'Excel File', icon: '📗', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' },
      { format: 'csv', label: 'CSV File', icon: '📋', url: 'https://drive.google.com/uc?export=download&id=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs' }
    ],
    tags: ['Interview', 'Tracker', 'Spreadsheet']
  }
];

const categoryConfig = {
  pdf: { 
    name: 'PDF Documents', 
    icon: FileText, 
    color: 'from-red-500 to-orange-500',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-500'
  },
  image: { 
    name: 'Images & Graphics', 
    icon: Image, 
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-500'
  },
  code: { 
    name: 'Code & Templates', 
    icon: Code, 
    color: 'from-green-500 to-emerald-500',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-500'
  },
  digital: { 
    name: 'Digital Products', 
    icon: Package, 
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-500'
  }
};

function DownloadDialog({ 
  item, 
  open, 
  onClose 
}: { 
  item: DownloadItem | null; 
  open: boolean; 
  onClose: () => void;
}) {
  const [selectedFormat, setSelectedFormat] = useState<FormatOption | null>(null);
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  const config = categoryConfig[item.category];

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: FormatOption) => {
    setSelectedFormat(format);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Download {item.name}
          </DialogTitle>
          <DialogDescription>
            Choose your preferred format to download
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Format Selection */}
          {!selectedFormat ? (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Select Format:</p>
              <div className="grid gap-2">
                {item.formats.map((format) => (
                  <button
                    key={format.format}
                    onClick={() => handleDownload(format)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                  >
                    <span className="text-2xl">{format.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium group-hover:text-primary transition-colors">
                        {format.label}
                      </p>
                      <p className="text-xs text-muted-foreground uppercase">
                        .{format.format}
                      </p>
                    </div>
                    <Download className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Download Link Display */
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-lg text-green-600">
                <Check className="h-4 w-4" />
                <span className="text-sm font-medium">Format selected: {selectedFormat.label}</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Download Link:</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedFormat.url}
                    readOnly
                    className="flex-1 px-3 py-2 text-sm bg-muted rounded-lg border border-border truncate"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleCopyLink(selectedFormat.url)}
                  >
                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedFormat(null)}
                >
                  Choose Different Format
                </Button>
                <a
                  href={selectedFormat.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Open Link
                  </Button>
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-4">
          <span>File size: {item.fileSize}</span>
          <span>{item.downloads.toLocaleString()} downloads</span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DownloadCard({ 
  item, 
  onDownload 
}: { 
  item: DownloadItem;
  onDownload: (item: DownloadItem) => void;
}) {
  const config = categoryConfig[item.category];
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      className="group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300"
    >
      {item.featured && (
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-yellow-500 text-black gap-1">
            <Star className="h-3 w-3 fill-current" />
            Featured
          </Badge>
        </div>
      )}

      <div className={`p-6 ${config.bgColor}`}>
        <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${config.color}`}>
          <Icon className="h-8 w-8 text-white" />
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div>
          <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-1">
            {item.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {item.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-[10px]">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Download className="h-3 w-3" />
            {item.downloads.toLocaleString()} downloads
          </span>
          <span>{item.formats.length} formats</span>
        </div>

        <Button 
          className="w-full gap-2 group-hover:bg-primary"
          onClick={() => onDownload(item)}
        >
          <Download className="h-4 w-4" />
          Download Free
        </Button>
      </div>
    </motion.div>
  );
}

export default function DownloadsPage() {
  const [selectedItem, setSelectedItem] = useState<DownloadItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const featuredDownloads = downloads.filter(d => d.featured);
  const categories = ['pdf', 'image', 'code', 'digital'] as const;

  const handleDownload = (item: DownloadItem) => {
    setSelectedItem(item);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedItem(null);
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
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to NEXUS AI</span>
          </Link>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="NEXUS AI" className="h-8 w-8" />
            <span className="font-semibold">Downloads</span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <Badge variant="outline" className="px-4 py-1">
            100% Free Resources
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Free Downloads
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A collection of free resources including templates, guides, code snippets, and design assets 
            to help you build amazing projects. Choose your preferred format!
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-8 mt-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{downloads.length}</div>
            <div className="text-sm text-muted-foreground">Resources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">
              {(downloads.reduce((acc, d) => acc + d.downloads, 0) / 1000).toFixed(1)}K+
            </div>
            <div className="text-sm text-muted-foreground">Downloads</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">4</div>
            <div className="text-sm text-muted-foreground">Categories</div>
          </div>
        </motion.div>
      </section>

      {/* Featured Downloads */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6"
        >
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />
            Featured Downloads
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {featuredDownloads.map((item) => (
            <DownloadCard key={item.id} item={item} onDownload={handleDownload} />
          ))}
        </div>
      </section>

      {/* All Categories */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        {categories.map((categoryKey, categoryIndex) => {
          const config = categoryConfig[categoryKey];
          const categoryItems = downloads.filter(d => d.category === categoryKey);
          const Icon = config.icon;

          return (
            <motion.div
              key={categoryKey}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: categoryIndex * 0.1 }}
              className="mb-16"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold">{config.name}</h2>
                <Badge variant="secondary">{categoryItems.length} items</Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categoryItems.map((item) => (
                  <DownloadCard key={item.id} item={item} onDownload={handleDownload} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        <p>
          All resources are free for personal and commercial use.
        </p>
        <p className="mt-2">
          Made with ❤️ by <a href="https://github.com/nitijkumar424-arch" className="text-primary hover:underline">Nitij Kumar</a>
        </p>
      </footer>

      {/* Download Dialog */}
      <DownloadDialog 
        item={selectedItem} 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
      />
    </div>
  );
}
