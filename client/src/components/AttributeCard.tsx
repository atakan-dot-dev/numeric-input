import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AttributeDefinition } from '@shared/schema';

interface AttributeCardProps {
  attribute: AttributeDefinition;
}

export function AttributeCard({ attribute }: AttributeCardProps) {
  return (
    <Card data-testid={`card-attribute-${attribute.name}`}>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-mono font-semibold">{attribute.name}</CardTitle>
          <Badge variant="outline" className="text-xs font-mono">
            {attribute.type}
          </Badge>
        </div>
        <CardDescription className="text-sm leading-relaxed">{attribute.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {attribute.defaultValue !== undefined && (
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Default:</span>
            <code className="ml-2 px-2 py-1 bg-muted rounded text-xs font-mono">
              {String(attribute.defaultValue)}
            </code>
          </div>
        )}
        {attribute.possibleValues && attribute.possibleValues.length > 0 && (
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
              Possible Values:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {attribute.possibleValues.map((value) => (
                <Badge key={value} variant="secondary" className="text-xs font-mono">
                  {value}
                </Badge>
              ))}
            </div>
          </div>
        )}
        {attribute.example && (
          <div>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide block mb-2">
              Example:
            </span>
            <code className="block px-3 py-2 bg-muted rounded text-xs font-mono">
              {attribute.example}
            </code>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
