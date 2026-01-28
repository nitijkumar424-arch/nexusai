'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Download, Play, Code2 } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language = 'plaintext', filename, showLineNumbers = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const { theme } = useTheme();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `code.${language}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExecute = async () => {
    if (language !== 'javascript' && language !== 'js') return;
    
    setIsExecuting(true);
    setOutput(null);
    
    try {
      const logs: string[] = [];
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      // Execute in a sandboxed function
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
      const fn = new AsyncFunction(code);
      const result = await fn();
      
      console.log = originalLog;
      
      const outputLines = logs.length > 0 ? logs : (result !== undefined ? [String(result)] : ['No output']);
      setOutput(outputLines.join('\n'));
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const canExecute = language === 'javascript' || language === 'js';

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative rounded-xl overflow-hidden border bg-card my-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b">
          <div className="flex items-center gap-2">
            <Code2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {filename || language}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {canExecute && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={handleExecute}
                    disabled={isExecuting}
                  >
                    <Play className={cn("h-3.5 w-3.5", isExecuting && "animate-spin")} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Run code</TooltipContent>
              </Tooltip>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={handleDownload}
                >
                  <Download className="h-3.5 w-3.5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download</TooltipContent>
            </Tooltip>
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
              <TooltipContent>{copied ? 'Copied!' : 'Copy code'}</TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Code */}
        <div className="overflow-x-auto">
          <SyntaxHighlighter
            language={language}
            style={theme === 'dark' ? oneDark : oneLight}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: '1rem',
              background: 'transparent',
              fontSize: '0.875rem',
            }}
            lineNumberStyle={{
              minWidth: '2.5em',
              paddingRight: '1em',
              color: 'var(--muted-foreground)',
              opacity: 0.5,
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>

        {/* Output */}
        {output && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="border-t bg-muted/30"
          >
            <div className="px-4 py-2 text-xs font-medium text-muted-foreground border-b">
              Output
            </div>
            <pre className="p-4 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
              {output}
            </pre>
          </motion.div>
        )}
      </motion.div>
    </TooltipProvider>
  );
}
