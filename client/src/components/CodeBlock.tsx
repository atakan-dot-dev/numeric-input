import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = 'html', className = '' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group ${className}`}>
      <div className="absolute right-2 top-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          onClick={handleCopy}
          data-testid="button-copy-code"
          className="h-8"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1.5" />
              Copy
            </>
          )}
        </Button>
      </div>
      <pre className="bg-muted rounded-md p-4 overflow-x-auto border border-border">
        <code className="font-mono text-sm text-foreground">{code}</code>
      </pre>
    </div>
  );
}
