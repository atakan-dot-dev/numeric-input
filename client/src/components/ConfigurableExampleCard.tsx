import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import type { ExampleConfig } from '@shared/schema';

interface ConfigurableExampleCardProps {
  example: ExampleConfig;
  showCode?: boolean;
  scriptLoaded?: boolean;
}

export function ConfigurableExampleCard({ example, showCode = true, scriptLoaded = false }: ConfigurableExampleCardProps) {
  const [currentValue, setCurrentValue] = useState('--');
  const [htmlCode, setHtmlCode] = useState(example.code);
  const [config, setConfig] = useState(example.config);

  // Parse HTML code to extract config when code changes
  useEffect(() => {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlCode, 'text/html');
      const inputElement = doc.querySelector('input');
      
      if (inputElement) {
        const newConfig: any = {};
        
        // Parse all possible attributes
        const attrs = ['prefix', 'postfix', 'separators', 'decimal', 'min', 'max', 
                      'valid-increment', 'key-increment', 'base', 'letter-case', 
                      'sign', 'locale'];
        
        attrs.forEach(attr => {
          const value = inputElement.getAttribute(attr);
          if (value !== null) {
            const camelAttr = attr.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
            // Convert numeric attributes
            if (['min', 'max', 'validIncrement', 'keyIncrement', 'base'].includes(camelAttr)) {
              newConfig[camelAttr] = parseFloat(value);
            } else {
              newConfig[camelAttr] = value;
            }
          }
        });
        
        // Check for boolean attributes
        if (inputElement.hasAttribute('integer')) newConfig.integer = true;
        if (inputElement.hasAttribute('show-plus')) newConfig.showPlus = true;
        
        setConfig(newConfig);
      }
    } catch (e) {
      console.error('Failed to parse HTML:', e);
    }
  }, [htmlCode]);

  // Use type="text" for inputs with formatting
  const needsTextInput = !!(
    config.prefix || 
    config.postfix || 
    (config.separators && config.separators !== 'none') ||
    (config.base && config.base !== 10)
  );

  useEffect(() => {
    const input = document.getElementById(`demo-${example.id}`) as HTMLInputElement;
    if (!input || !scriptLoaded || !(window as any).NumericInput) return;

    // First, clear all NumericInput-related attributes
    const allPossibleAttrs = [
      'prefix', 'postfix', 'separators', 'decimal', 'min', 'max',
      'valid-increment', 'key-increment', 'base', 'radix', 'letter-case',
      'sign', 'locale', 'integer', 'show-plus'
    ];
    allPossibleAttrs.forEach(attr => {
      input.removeAttribute(attr);
    });
    
    // Apply all config attributes to the element
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        
        if (typeof value === 'boolean') {
          if (value) {
            input.setAttribute(attrName, '');
          }
        } else {
          input.setAttribute(attrName, String(value));
        }
      }
    });

    // Detach and reattach NumericInput to pick up new config
    (window as any).NumericInput.detach(input);
    (window as any).NumericInput.attach(input);

    const handleInput = () => {
      // Display the parsed numeric value, not the raw input
      const numericValue = input.getAttribute('data-numeric-value');
      setCurrentValue(numericValue || '--');
    };

    input.addEventListener('input', handleInput);
    return () => {
      input.removeEventListener('input', handleInput);
      if ((window as any).NumericInput) {
        (window as any).NumericInput.detach(input);
      }
    };
  }, [example.id, config, scriptLoaded]);

  return (
    <Card data-testid={`card-example-${example.id}`}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold">{example.title}</CardTitle>
            <CardDescription className="text-sm">{example.description}</CardDescription>
          </div>
          <Badge variant="secondary" className="text-xs">
            {example.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Edit Configuration
          </h4>
          <div className="space-y-2">
            <Label htmlFor={`code-${example.id}`} className="text-xs">
              HTML Code
            </Label>
            <textarea
              id={`code-${example.id}`}
              value={htmlCode}
              onChange={(e) => setHtmlCode(e.target.value)}
              className="w-full h-20 px-3 py-2 rounded-md border border-input bg-background font-mono text-xs resize-y focus:outline-none focus:ring-2 focus:ring-ring"
              data-testid={`textarea-code-${example.id}`}
              spellCheck={false}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Edit the HTML attributes above to test different configurations in real-time.
            </p>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
            Live Demo
          </h4>
          <div className="space-y-2">
            <input
              type={needsTextInput ? "text" : "number"}
              id={`demo-${example.id}`}
              className="w-full h-10 px-3 rounded-md border border-input bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="Try typing here..."
              data-testid={`input-demo-${example.id}`}
              inputMode="numeric"
            />
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Current value:</span>
              <code className="px-2 py-1 bg-muted rounded text-xs font-mono" data-testid={`text-value-${example.id}`}>
                {currentValue}
              </code>
            </div>
            <div className="text-xs text-muted-foreground">
              Try entering negative values or values outside the range to test validation.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
