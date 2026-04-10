import type { AttributeDefinition } from '@shared/schema';

export const validationAttributes: AttributeDefinition[] = [
  {
    name: 'valid-increment',
    type: 'number',
    description: 'Restricts valid values to multiples of this increment offset from snap-origin (defaults to max(0, min)). Value must satisfy: (value − snapOrigin) % increment = 0. Defaults to 0, which allows all values. See accuracy for a shorthand.',
    defaultValue: 0,
    example: 'valid-increment="0.25" min="0"',
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
    name: 'decimal-separator',
    type: 'string',
    description: 'Character for decimal separator. Use "locale" to determine based on locale, or specify a custom character.',
    defaultValue: 'locale',
    example: 'decimal-separator="."',
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
  {
    name: 'arrows',
    type: 'string',
    description: 'Controls visibility of increment/decrement arrow buttons. "always" shows arrows at all times, "focus" shows them only when the input is focused, "never" hides them entirely.',
    defaultValue: 'always',
    possibleValues: ['always', 'never', 'focus'],
    example: 'arrows="focus"',
  },
  {
    name: 'decimal-keys',
    type: 'string',
    description: 'Controls how period (.) and comma (,) keys behave. "both" makes either key produce the configured decimal separator. "configured" only allows the configured decimal key, blocking the other.',
    defaultValue: 'both',
    possibleValues: ['both', 'configured'],
    example: 'decimal-keys="configured"',
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

export const advancedAttributes: AttributeDefinition[] = [
  {
    name: 'value-algebra',
    type: 'string',
    description: 'Algebraic expression to transform the display value into the stored value. Uses variable "x" for the display value. Supports +, -, *, / operators and floor(), ceil(), round() functions. Max 100 characters, max 5 operations. No eval() — uses a safe recursive descent parser.',
    example: 'value-algebra="x*0.01"',
  },
  {
    name: 'percentage',
    type: 'boolean',
    description: 'Shorthand that sets value-algebra="x*0.01" and postfix="%". User types 50, form submits 0.5. Explicit postfix overrides the default "%".',
    example: 'percentage',
  },
  {
    name: 'percentage-prefix',
    type: 'boolean',
    description: 'Shorthand that sets value-algebra="x*0.01" and prefix="%". Same algebra as percentage but shows the % symbol before the number.',
    example: 'percentage-prefix',
  },
  {
    name: 'snap-origin',
    type: 'number',
    description: 'Origin point for increment snapping. The valid-increment check uses this as the base instead of max(0, min). Useful when valid values should be offset from 0.',
    defaultValue: 'max(0, min)',
    example: 'snap-origin="3" valid-increment="5"',
  },
  {
    name: 'accuracy',
    type: 'number',
    description: 'Shorthand for setting valid-increment to a decimal precision. accuracy="2" sets valid-increment="0.01", accuracy="0" sets valid-increment="1". Only applied when valid-increment is not already set.',
    defaultValue: 'none',
    example: 'accuracy="2"',
  },
  {
    name: 'validation-timeout',
    type: 'number',
    description: 'Debounce delay in milliseconds before snapping to the nearest valid increment. Allows users to type freely; the value snaps after typing stops.',
    defaultValue: '500',
    example: 'validation-timeout="1000"',
  },
];

export const allAttributes: AttributeDefinition[] = [
  ...validationAttributes,
  ...formattingAttributes,
  ...displayAttributes,
  ...localeAttributes,
  ...advancedAttributes,
];
