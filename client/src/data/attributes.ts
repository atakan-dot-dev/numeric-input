import type { AttributeDefinition } from '@shared/schema';

export const validationAttributes: AttributeDefinition[] = [
  {
    name: 'valid-increment',
    type: 'number',
    description: 'Restricts valid values to increments from min. Value must satisfy: value = min + x * increment (where x is a positive integer). Defaults to 0, which allows all numbers.',
    defaultValue: 0,
    example: 'valid-increment="5" min="0"',
  },
  {
    name: 'key-increment',
    type: 'number',
    description: 'The amount by which arrow keys increase/decrease the value. Must be a multiple of valid-increment unless valid-increment is 0.',
    example: 'key-increment="1"',
  },
  {
    name: 'integer',
    type: 'boolean',
    description: 'When present, restricts input to integers only. Sets valid-increment to the nearest integer above 1.',
    example: 'integer',
  },
  {
    name: 'min',
    type: 'number',
    description: 'Minimum allowed value. Keystrokes that would make the value go below min are ignored.',
    example: 'min="0"',
  },
  {
    name: 'max',
    type: 'number',
    description: 'Maximum allowed value. Keystrokes that would make the value exceed max are ignored.',
    example: 'max="100"',
  },
  {
    name: 'sign',
    type: 'enum',
    description: 'Controls sign behavior. "any" allows both positive and negative (pressing "-" flips sign), "positive" only allows positive numbers, "negative" only allows negative (sign always shown).',
    defaultValue: 'any',
    possibleValues: ['any', 'positive', 'negative'],
    example: 'sign="positive"',
  },
];

export const formattingAttributes: AttributeDefinition[] = [
  {
    name: 'base',
    type: 'number',
    description: 'Number base for display and input. Supports bases 2-36. Base 2-10 use locale-aware digits, base 11-36 use English letters.',
    defaultValue: 10,
    possibleValues: ['2-36'],
    example: 'base="16"',
  },
  {
    name: 'radix',
    type: 'number',
    description: 'Alias for base. If both base and radix are provided, radix takes precedence (with console warning).',
    possibleValues: ['2-36'],
    example: 'radix="2"',
  },
  {
    name: 'letter-case',
    type: 'enum',
    description: 'Controls letter case for bases > 10. Only affects letters A-Z used in base 11-36.',
    defaultValue: 'upper',
    possibleValues: ['upper', 'lower'],
    example: 'letter-case="lower"',
  },
  {
    name: 'separators',
    type: 'string',
    description: 'Character or system for digit grouping. Can be a single character (",", ".", "_"), "indian" for Indian numbering, or "locale" for locale-based grouping.',
    defaultValue: 'locale',
    possibleValues: ['locale', 'indian', ',', '.', '_', '(any char)'],
    example: 'separators=","',
  },
  {
    name: 'decimal',
    type: 'string',
    description: 'Character for decimal separator. Use "locale" to determine based on locale, or specify a custom character.',
    defaultValue: 'locale',
    example: 'decimal="."',
  },
];

export const displayAttributes: AttributeDefinition[] = [
  {
    name: 'show-plus',
    type: 'boolean',
    description: 'When present, displays "+" sign for positive numbers.',
    example: 'show-plus',
  },
  {
    name: 'prefix',
    type: 'string',
    description: 'Fixed string displayed between the sign and the number.',
    example: 'prefix="$"',
  },
  {
    name: 'postfix',
    type: 'string',
    description: 'Fixed string displayed after the number.',
    example: 'postfix=" USD"',
  },
];

export const localeAttributes: AttributeDefinition[] = [
  {
    name: 'locale',
    type: 'string',
    description: 'Valid Intl.Locale value for output formatting. Determines default separators and decimal characters. Digit input possible in selected locale and standard Western numerals. Defaults to closest container or system locale.',
    defaultValue: 'system/container locale',
    example: 'locale="en-US"',
  },
];

export const allAttributes: AttributeDefinition[] = [
  ...validationAttributes,
  ...formattingAttributes,
  ...displayAttributes,
  ...localeAttributes,
];
