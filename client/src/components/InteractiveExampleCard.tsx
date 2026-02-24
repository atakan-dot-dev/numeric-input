import { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CodeBlock } from './CodeBlock';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ExampleConfig, NumericInputConfig, ExampleControl } from '@shared/schema';

interface InteractiveExampleCardProps {
  example: ExampleConfig;
  scriptLoaded?: boolean;
}

function configToHtml(config: Partial<NumericInputConfig>): string {
  const attrs: string[] = [];
  const keyMap: Record<string, string> = {
    validIncrement: 'valid-increment',
    keyIncrement: 'key-increment',
    incrementStart: 'increment-start',
    letterCase: 'letter-case',
    showPlus: 'show-plus',
    valueAlgebra: 'value-algebra',
    validationTimeout: 'validation-timeout',
    percentagePrefix: 'percentage-prefix',
  };

  for (const [key, value] of Object.entries(config)) {
    if (value === undefined || value === null || value === '') continue;
    if (key === 'sign' && value === 'any') continue;
    if (key === 'separators' && value === 'locale') continue;
    if (key === 'decimal' && value === 'locale') continue;
    if (key === 'base' && value === 10) continue;
    if (key === 'letterCase' && value === 'upper') continue;

    const attrName = keyMap[key] || key;

    if (typeof value === 'boolean') {
      if (value) attrs.push(attrName);
    } else {
      attrs.push(`${attrName}="${value}"`);
    }
  }

  const type = (config.prefix || config.postfix || config.percentage || config.percentagePrefix ||
    (config.separators && config.separators !== 'none' && config.separators !== 'locale') ||
    (config.base && config.base !== 10)) ? 'text' : 'number';

  if (attrs.length === 0) return `<input type="${type}" />`;
  return `<input type="${type}" ${attrs.join(' ')} />`;
}

export function InteractiveExampleCard({ example, scriptLoaded = false }: InteractiveExampleCardProps) {
  const [currentValue, setCurrentValue] = useState('--');
  const [config, setConfig] = useState<Partial<NumericInputConfig>>({ ...example.config });
  const attachedRef = useRef(false);

  const needsTextInput = !!(
    config.prefix ||
    config.postfix ||
    config.percentage ||
    config.percentagePrefix ||
    (config.separators && config.separators !== 'none' && config.separators !== 'locale') ||
    (config.base && config.base !== 10)
  );

  const updateConfig = useCallback((key: string, value: any) => {
    setConfig(prev => {
      const next = { ...prev };
      if (value === '' || value === undefined || value === null) {
        delete (next as any)[key];
      } else {
        (next as any)[key] = value;
      }
      if (key === 'percentage' && value === true) {
        delete (next as any).percentagePrefix;
      }
      if (key === 'percentagePrefix' && value === true) {
        delete (next as any).percentage;
      }
      return next;
    });
  }, []);

  useEffect(() => {
    const input = document.getElementById(`demo-${example.id}`) as HTMLInputElement;
    if (!input || !scriptLoaded || !(window as any).NumericInput) return;

    const allPossibleAttrs = [
      'prefix', 'postfix', 'separators', 'decimal', 'min', 'max',
      'valid-increment', 'key-increment', 'base', 'radix', 'letter-case',
      'sign', 'locale', 'integer', 'show-plus', 'increment-start',
      'validation-timeout', 'value-algebra', 'percentage', 'percentage-prefix'
    ];

    if (attachedRef.current) {
      (window as any).NumericInput.detach(input);
      attachedRef.current = false;
    }

    allPossibleAttrs.forEach(attr => input.removeAttribute(attr));

    Object.entries(config).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') return;
      const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      if (typeof value === 'boolean') {
        if (value) input.setAttribute(attrName, '');
      } else {
        input.setAttribute(attrName, String(value));
      }
    });

    (window as any).NumericInput.attach(input);
    attachedRef.current = true;

    const originalInput = document.getElementById(`demo-${example.id}-numeric`) as HTMLInputElement;

    const handleInput = () => {
      if (originalInput) {
        setCurrentValue(originalInput.value || '--');
      }
    };

    if (originalInput) {
      originalInput.addEventListener('input', handleInput);
      handleInput();
    }

    return () => {
      if (originalInput) {
        originalInput.removeEventListener('input', handleInput);
      }
      if ((window as any).NumericInput && attachedRef.current) {
        (window as any).NumericInput.detach(input);
        attachedRef.current = false;
      }
    };
  }, [example.id, config, scriptLoaded]);

  const renderControl = (control: ExampleControl) => {
    const key = control.key;
    const currentVal = (config as any)[key];

    if (control.type === 'toggle') {
      return (
        <div key={key} className="space-y-1" data-testid={`control-${example.id}-${key}`}>
          <Label className="text-xs invisible select-none" aria-hidden="true">&zwj;</Label>
          <div className="flex items-center justify-between gap-2 h-8">
            <Label className="text-xs cursor-pointer" htmlFor={`ctrl-${example.id}-${key}`}>{control.label}</Label>
            <Switch
              id={`ctrl-${example.id}-${key}`}
              checked={!!currentVal}
              onCheckedChange={(checked) => updateConfig(key, checked || undefined)}
              data-testid={`toggle-${example.id}-${key}`}
            />
          </div>
        </div>
      );
    }

    if (control.type === 'select') {
      return (
        <div key={key} className="space-y-1" data-testid={`control-${example.id}-${key}`}>
          <Label className="text-xs" htmlFor={`ctrl-${example.id}-${key}`}>{control.label}</Label>
          <Select
            value={currentVal !== undefined ? String(currentVal) : control.options[0]?.value}
            onValueChange={(val) => {
              if (key === 'base') {
                updateConfig(key, parseInt(val));
              } else {
                updateConfig(key, val);
              }
            }}
          >
            <SelectTrigger id={`ctrl-${example.id}-${key}`} className="h-8 text-xs" data-testid={`select-${example.id}-${key}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {control.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} data-testid={`option-${example.id}-${key}-${opt.value}`}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    if (control.type === 'input') {
      return (
        <div key={key} className="space-y-1" data-testid={`control-${example.id}-${key}`}>
          <Label className="text-xs" htmlFor={`ctrl-${example.id}-${key}`}>{control.label}</Label>
          <Input
            id={`ctrl-${example.id}-${key}`}
            type={control.inputType || 'text'}
            value={currentVal !== undefined ? String(currentVal) : ''}
            placeholder={control.placeholder}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                updateConfig(key, undefined);
              } else if (control.inputType === 'number') {
                const num = parseFloat(raw);
                updateConfig(key, isNaN(num) ? undefined : num);
              } else {
                updateConfig(key, raw);
              }
            }}
            className="h-8 text-xs font-mono"
            data-testid={`input-ctrl-${example.id}-${key}`}
          />
        </div>
      );
    }

    return null;
  };

  const generatedCode = configToHtml(config);

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
        {example.controls && example.controls.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
              Configuration
            </h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {example.controls.map(renderControl)}
            </div>
          </div>
        )}

        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            HTML
          </h4>
          <CodeBlock code={generatedCode} language="html" />
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
              <span className="text-muted-foreground">Stored value:</span>
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
