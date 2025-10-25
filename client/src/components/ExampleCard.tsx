import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { Badge } from '@/components/ui/badge';
import type { ExampleConfig } from '@shared/schema';
import { useNumericInput } from '@/hooks/useNumericInput';

interface ExampleCardProps {
  example: ExampleConfig;
  showCode?: boolean;
  scriptLoaded?: boolean;
}

export function ExampleCard({ example, showCode = true, scriptLoaded = false }: ExampleCardProps) {
  const [currentValue, setCurrentValue] = useState('--');
  
  useNumericInput(`demo-${example.id}`, example.config, scriptLoaded);

  // Use type="text" for inputs with formatting (prefix, postfix, separators, or base != 10)
  const needsTextInput = !!(
    example.config.prefix || 
    example.config.postfix || 
    (example.config.separators && example.config.separators !== 'none') ||
    (example.config.base && example.config.base !== 10)
  );

  useEffect(() => {
    // The original input is hidden and has "-numeric" suffix
    const originalInput = document.getElementById(`demo-${example.id}-numeric`) as HTMLInputElement;
    if (!originalInput) return;

    const handleInput = () => {
      // Display the numeric value from the hidden original input
      setCurrentValue(originalInput.value || '--');
    };

    // Listen to the original input for value changes
    originalInput.addEventListener('input', handleInput);
    
    // Also set initial value
    handleInput();
    
    return () => originalInput.removeEventListener('input', handleInput);
  }, [example.id, scriptLoaded]);

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
        {showCode && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
              Configuration
            </h4>
            <CodeBlock code={example.code} language="html" />
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
