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
  const [min, setMin] = useState(example.config.min ?? -1000);
  const [max, setMax] = useState(example.config.max ?? 1000);
  const [config, setConfig] = useState(example.config);

  // Update config when min/max changes
  useEffect(() => {
    setConfig({
      ...example.config,
      min,
      max,
    });
  }, [min, max, example.config]);

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
      setCurrentValue(input.value || '--');
    };

    input.addEventListener('input', handleInput);
    return () => {
      input.removeEventListener('input', handleInput);
      if ((window as any).NumericInput) {
        (window as any).NumericInput.detach(input);
      }
    };
  }, [example.id, config, scriptLoaded]);

  // Generate dynamic code
  const generateCode = () => {
    const attrs: string[] = [];
    if (config.prefix) attrs.push(`prefix="${config.prefix}"`);
    if (config.postfix) attrs.push(`postfix="${config.postfix}"`);
    if (config.separators) attrs.push(`separators="${config.separators}"`);
    if (config.decimal) attrs.push(`decimal="${config.decimal}"`);
    if (min !== undefined) attrs.push(`min="${min}"`);
    if (max !== undefined) attrs.push(`max="${max}"`);
    const inputType = needsTextInput ? 'text' : 'number';
    return `<input type="${inputType}" ${attrs.join(' ')} />`;
  };

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
            Configuration Controls
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`min-${example.id}`} className="text-xs">
                Minimum
              </Label>
              <Input
                id={`min-${example.id}`}
                type="number"
                value={min}
                onChange={(e) => setMin(Number(e.target.value))}
                className="h-8 text-sm"
                data-testid={`input-min-${example.id}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`max-${example.id}`} className="text-xs">
                Maximum
              </Label>
              <Input
                id={`max-${example.id}`}
                type="number"
                value={max}
                onChange={(e) => setMax(Number(e.target.value))}
                className="h-8 text-sm"
                data-testid={`input-max-${example.id}`}
              />
            </div>
          </div>
        </div>

        {showCode && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Configuration
            </h4>
            <CodeBlock code={generateCode()} language="html" />
          </div>
        )}

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
