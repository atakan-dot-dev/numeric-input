import type { ExampleConfig } from '@shared/schema';

const signOptions = [
  { label: 'Any', value: 'any' },
  { label: 'Positive', value: 'positive' },
  { label: 'Negative', value: 'negative' },
];

const baseOptions = [
  { label: 'Binary (2)', value: '2' },
  { label: 'Octal (8)', value: '8' },
  { label: 'Decimal (10)', value: '10' },
  { label: 'Hex (16)', value: '16' },
  { label: 'Base 36', value: '36' },
];

const caseOptions = [
  { label: 'Uppercase', value: 'upper' },
  { label: 'Lowercase', value: 'lower' },
];

const arrowsOptions = [
  { label: 'Always', value: 'always' },
  { label: 'Never', value: 'never' },
  { label: 'On Focus', value: 'focus' },
];

const decimalKeysOptions = [
  { label: 'Both (. and ,)', value: 'both' },
  { label: 'Configured Only', value: 'configured' },
];

const separatorOptions = [
  { label: 'None', value: 'none' },
  { label: 'Locale', value: 'locale' },
  { label: 'Comma', value: ',' },
  { label: 'Period', value: '.' },
  { label: 'Space', value: ' ' },
  { label: 'Indian', value: 'indian' },
];

const decimalOptions = [
  { label: 'Locale', value: 'locale' },
  { label: 'Period (.)', value: '.' },
  { label: 'Comma (,)', value: ',' },
];

const localeOptions = [
  { label: 'English (US)', value: 'en-US' },
  { label: 'German', value: 'de-DE' },
  { label: 'French', value: 'fr-FR' },
  { label: 'Indian English', value: 'en-IN' },
  { label: 'Japanese', value: 'ja-JP' },
  { label: 'Arabic (SA)', value: 'ar-SA' },
];

export const examples: ExampleConfig[] = [
  {
    id: 'basic',
    title: 'Basic Number',
    description: 'Configure integer mode and sign restrictions',
    category: 'Validation',
    config: {},
    controls: [
      { type: 'toggle', key: 'integer', label: 'Integer Only' },
      { type: 'select', key: 'sign', label: 'Sign', options: signOptions },
      { type: 'input', key: 'min', label: 'Min', inputType: 'number', placeholder: 'No min' },
      { type: 'input', key: 'max', label: 'Max', inputType: 'number', placeholder: 'No max' },
    ],
  },
  {
    id: 'increments',
    title: 'Range & Increments',
    description: 'Set min/max constraints and increment steps with configurable validation timeout',
    category: 'Validation',
    config: { validIncrement: 5, keyIncrement: 5, incrementStart: 0 },
    controls: [
      { type: 'input', key: 'min', label: 'Min', inputType: 'number', placeholder: 'No min' },
      { type: 'input', key: 'max', label: 'Max', inputType: 'number', placeholder: 'No max' },
      { type: 'input', key: 'validIncrement', label: 'Valid Increment', inputType: 'number', placeholder: '0' },
      { type: 'input', key: 'keyIncrement', label: 'Key Increment', inputType: 'number', placeholder: '1' },
      { type: 'input', key: 'incrementStart', label: 'Increment Start', inputType: 'number', placeholder: '0' },
      { type: 'input', key: 'validationTimeout', label: 'Timeout (ms)', inputType: 'number', placeholder: '500' },
    ],
  },
  {
    id: 'currency',
    title: 'Currency',
    description: 'Formatted currency input with prefix, separators, and decimal precision',
    category: 'Formatting',
    config: { prefix: '$', decimal: '.', separators: ',', min: 0 },
    controls: [
      { type: 'switch-label-input', key: 'prefix', altKey: 'postfix', leftLabel: 'Prefix', rightLabel: 'Postfix', leftPlaceholder: 'USD', rightPlaceholder: '$' },
      { type: 'select', key: 'separators', label: 'Separators', options: separatorOptions },
      { type: 'select', key: 'decimal', label: 'Decimal', options: decimalOptions },
      { type: 'input', key: 'keyIncrement', label: 'Key Increment', inputType: 'number', placeholder: '1' },
      { type: 'input', key: 'min', label: 'Min', inputType: 'number', placeholder: 'No min' },
      { type: 'input', key: 'max', label: 'Max', inputType: 'number', placeholder: 'No max' },
      { type: 'input', key: 'validIncrement', label: 'Valid Increment', inputType: 'number', placeholder: '0.01' },
    ],
  },
  {
    id: 'percentage',
    title: 'Percentage',
    description: 'Percentage input with automatic value-algebra (display 50 → stores 0.5)',
    category: 'Formatting',
    config: { percentage: true, min: 0, max: 100 },
    controls: [
      { type: 'switch-label', key: 'percentage', altKey: 'percentagePrefix', leftLabel: 'Prefix', rightLabel: 'Postfix' },
      { type: 'input', key: 'min', label: 'Min', inputType: 'number', placeholder: 'No min' },
      { type: 'input', key: 'max', label: 'Max', inputType: 'number', placeholder: 'No max' },
    ],
  },
  {
    id: 'decimal-keys',
    title: 'Decimal Keys',
    description: 'Control how period and comma keys behave — both produce decimal separator, or only the configured one',
    category: 'Input',
    config: { decimalKeys: 'both', decimal: ',' },
    controls: [
      { type: 'select', key: 'decimalKeys', label: 'Decimal Keys', options: decimalKeysOptions },
      { type: 'select', key: 'decimal', label: 'Decimal Char', options: decimalOptions },
      { type: 'select', key: 'separators', label: 'Separators', options: separatorOptions },
    ],
  },
  {
    id: 'smart-paste',
    title: 'Smart Paste',
    description: 'Paste numbers in any format — auto-detects European (100.000,25) vs US (100,000.25) style',
    category: 'Input',
    config: { decimal: '.', separators: ',' },
    controls: [
      { type: 'select', key: 'decimal', label: 'Decimal Char', options: decimalOptions },
      { type: 'select', key: 'separators', label: 'Separators', options: separatorOptions },
      { type: 'select', key: 'locale', label: 'Locale', options: localeOptions },
    ],
  },
  {
    id: 'base',
    title: 'Number Base',
    description: 'Input in different number bases from binary to base-36',
    category: 'Base',
    config: { base: 16, letterCase: 'upper', prefix: '0x' },
    controls: [
      { type: 'select', key: 'base', label: 'Base', options: baseOptions },
      { type: 'select', key: 'letterCase', label: 'Letter Case', options: caseOptions },
      { type: 'input', key: 'prefix', label: 'Prefix', inputType: 'text', placeholder: '0x' },
    ],
  },
  {
    id: 'display',
    title: 'Display Options',
    description: 'Configure prefix, postfix, sign display, and arrow visibility',
    category: 'Display',
    config: { postfix: '°C', showPlus: true },
    controls: [
      { type: 'input', key: 'prefix', label: 'Prefix', inputType: 'text', placeholder: 'None' },
      { type: 'input', key: 'postfix', label: 'Postfix', inputType: 'text', placeholder: 'None' },
      { type: 'toggle', key: 'showPlus', label: 'Show Plus (+)' },
      { type: 'select', key: 'arrows', label: 'Arrows', options: arrowsOptions },
      { type: 'input', key: 'min', label: 'Min', inputType: 'number', placeholder: 'No min' },
      { type: 'input', key: 'max', label: 'Max', inputType: 'number', placeholder: 'No max' },
    ],
  },
  {
    id: 'locale',
    title: 'Locale & Format',
    description: 'Locale-aware formatting with different separator and decimal conventions',
    category: 'Locale',
    config: { locale: 'de-DE', decimal: ',', separators: '.' },
    controls: [
      { type: 'select', key: 'locale', label: 'Locale', options: localeOptions },
      { type: 'select', key: 'separators', label: 'Separators', options: separatorOptions },
      { type: 'select', key: 'decimal', label: 'Decimal', options: decimalOptions },
      { type: 'select', key: 'decimalKeys', label: 'Decimal Keys', options: decimalKeysOptions },
    ],
  },
  {
    id: 'algebra',
    title: 'Value Algebra',
    description: 'Apply algebraic transformations to convert display values to stored values',
    category: 'Advanced',
    config: { valueAlgebra: 'x*0.01', postfix: '%' },
    controls: [
      { type: 'input', key: 'valueAlgebra', label: 'Expression', inputType: 'text', placeholder: 'x*0.01' },
      { type: 'input', key: 'prefix', label: 'Prefix', inputType: 'text', placeholder: 'None' },
      { type: 'input', key: 'postfix', label: 'Postfix', inputType: 'text', placeholder: 'None' },
      { type: 'input', key: 'min', label: 'Min', inputType: 'number', placeholder: 'No min' },
      { type: 'input', key: 'max', label: 'Max', inputType: 'number', placeholder: 'No max' },
    ],
  },
  {
    id: 'precision',
    title: 'Precision',
    description: 'Fine-grained decimal increments for scientific or financial use',
    category: 'Validation',
    config: { validIncrement: 0.01, keyIncrement: 0.01, decimal: '.' },
    controls: [
      { type: 'input', key: 'validIncrement', label: 'Valid Increment', inputType: 'number', placeholder: '0.01' },
      { type: 'input', key: 'keyIncrement', label: 'Key Increment', inputType: 'number', placeholder: '0.01' },
      { type: 'select', key: 'decimal', label: 'Decimal', options: decimalOptions },
      { type: 'toggle', key: 'integer', label: 'Integer Only' },
    ],
  },
  {
    id: 'playground',
    title: 'Full Config Playground',
    description: 'All options available — experiment with any combination of attributes',
    category: 'Advanced',
    config: {},
    controls: [
      { type: 'toggle', key: 'integer', label: 'Integer Only' },
      { type: 'select', key: 'sign', label: 'Sign', options: signOptions },
      { type: 'input', key: 'min', label: 'Min', inputType: 'number', placeholder: 'No min' },
      { type: 'input', key: 'max', label: 'Max', inputType: 'number', placeholder: 'No max' },
      { type: 'input', key: 'validIncrement', label: 'Valid Increment', inputType: 'number', placeholder: '0' },
      { type: 'input', key: 'keyIncrement', label: 'Key Increment', inputType: 'number', placeholder: '1' },
      { type: 'input', key: 'prefix', label: 'Prefix', inputType: 'text', placeholder: 'None' },
      { type: 'input', key: 'postfix', label: 'Postfix', inputType: 'text', placeholder: 'None' },
      { type: 'toggle', key: 'showPlus', label: 'Show Plus (+)' },
      { type: 'select', key: 'base', label: 'Base', options: baseOptions },
      { type: 'select', key: 'letterCase', label: 'Letter Case', options: caseOptions },
      { type: 'select', key: 'separators', label: 'Separators', options: separatorOptions },
      { type: 'select', key: 'decimal', label: 'Decimal', options: decimalOptions },
      { type: 'select', key: 'locale', label: 'Locale', options: localeOptions },
      { type: 'toggle', key: 'percentage', label: 'Percentage' },
      { type: 'input', key: 'valueAlgebra', label: 'Value Algebra', inputType: 'text', placeholder: 'e.g. x*0.01' },
      { type: 'select', key: 'arrows', label: 'Arrows', options: arrowsOptions },
      { type: 'select', key: 'decimalKeys', label: 'Decimal Keys', options: decimalKeysOptions },
    ],
  },
];
