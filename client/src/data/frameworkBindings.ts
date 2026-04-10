export interface FrameworkBinding {
  id: string;
  name: string;
  type: 'package' | 'docs';
  icon: string;
  installInstructions?: string;
  usageCode: string;
  bindingSource?: string;
}

export const frameworkBindings: FrameworkBinding[] = [
  {
    id: 'react',
    name: 'React',
    type: 'package',
    icon: 'react',
    installInstructions: `npm install numeric-input numeric-input-react`,
    usageCode: `import { NumericInput } from 'numeric-input-react';

function App() {
  return (
    <NumericInput
      id="currency"
      prefix="$"
      separators=","
      min={0}
      placeholder="$0.00"
      onStoredValueChange={(value) => console.log('Stored:', value)}
    />
  );
}

// Percentage input
function PercentageInput() {
  return (
    <NumericInput
      id="tax-rate"
      percentage
      min={0}
      max={100}
      placeholder="0%"
    />
  );
}`,
    bindingSource: `import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

export interface NumericInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefix?: string;
  postfix?: string;
  integer?: boolean;
  sign?: 'any' | 'positive' | 'negative';
  showPlus?: boolean;
  base?: number;
  letterCase?: 'upper' | 'lower';
  separators?: string;
  decimalSeparator?: string;
  locale?: string;
  validIncrement?: number;
  keyIncrement?: number;
  snapOrigin?: number;
  validationTimeout?: number;
  valueAlgebra?: string;
  percentage?: boolean;
  percentagePrefix?: boolean;
  onStoredValueChange?: (value: string) => void;
}

const ATTR_MAP: Record<string, string> = {
  showPlus: 'show-plus',
  letterCase: 'letter-case',
  validIncrement: 'valid-increment',
  keyIncrement: 'key-increment',
  snapOrigin: 'snap-origin',
  decimalSeparator: 'decimal-separator',
  validationTimeout: 'validation-timeout',
  valueAlgebra: 'value-algebra',
  percentagePrefix: 'percentage-prefix',
};

const CONFIG_KEYS = [
  'prefix', 'postfix', 'integer', 'sign', 'showPlus', 'base',
  'letterCase', 'separators', 'decimalSeparator', 'locale', 'validIncrement',
  'keyIncrement', 'snapOrigin', 'validationTimeout', 'valueAlgebra',
  'percentage', 'percentagePrefix',
] as const;

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  (props, ref) => {
    const {
      prefix, postfix, integer, sign, showPlus, base, letterCase,
      separators, decimalSeparator, locale, validIncrement, keyIncrement,
      snapOrigin, validationTimeout, valueAlgebra, percentage,
      percentagePrefix, onStoredValueChange, ...inputProps
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const attachedRef = useRef(false);

    useImperativeHandle(ref, () => inputRef.current!);

    useEffect(() => {
      const el = inputRef.current;
      if (!el || !window.NumericInput) return;

      if (attachedRef.current) {
        window.NumericInput.detach(el);
        attachedRef.current = false;
      }

      const allAttrs = CONFIG_KEYS.map(k => ATTR_MAP[k] || k);
      allAttrs.forEach(attr => el.removeAttribute(attr));

      const configValues = {
        prefix, postfix, integer, sign, showPlus, base, letterCase,
        separators, decimalSeparator, locale, validIncrement, keyIncrement,
        snapOrigin, validationTimeout, valueAlgebra, percentage,
        percentagePrefix,
      };

      for (const key of CONFIG_KEYS) {
        const value = configValues[key];
        if (value === undefined || value === null
            || value === false || value === '') continue;
        const attrName = ATTR_MAP[key] || key;
        if (value === true) {
          el.setAttribute(attrName, '');
        } else {
          el.setAttribute(attrName, String(value));
        }
      }

      const originalId = el.id;
      window.NumericInput.attach(el);
      attachedRef.current = true;

      const numericId = originalId ? originalId + '-numeric' : null;
      const numericEl = numericId
        ? document.getElementById(numericId) as HTMLInputElement
        : null;

      const handler = () => {
        if (numericEl && onStoredValueChange) {
          onStoredValueChange(numericEl.value);
        }
      };

      if (numericEl) {
        numericEl.addEventListener('input', handler);
        handler();
      }

      return () => {
        if (numericEl) numericEl.removeEventListener('input', handler);
        if (attachedRef.current) {
          window.NumericInput.detach(el);
          attachedRef.current = false;
        }
      };
    }, [
      prefix, postfix, integer, sign, showPlus, base, letterCase,
      separators, decimalSeparator, locale, validIncrement, keyIncrement,
      snapOrigin, validationTimeout, valueAlgebra, percentage,
      percentagePrefix,
    ]);

    const needsTextType = !!(
      prefix || postfix || percentage || percentagePrefix ||
      (separators && separators !== 'none' && separators !== 'locale') ||
      (base && base !== 10)
    );

    return (
      <input
        ref={inputRef}
        type={needsTextType ? 'text' : 'number'}
        inputMode="numeric"
        {...inputProps}
      />
    );
  }
);

NumericInput.displayName = 'NumericInput';
export default NumericInput;`,
  },
  {
    id: 'vue',
    name: 'Vue',
    type: 'package',
    icon: 'vue',
    installInstructions: `npm install numeric-input numeric-input-vue`,
    usageCode: `<script setup lang="ts">
import NumericInput from 'numeric-input-vue';

function handleStoredValue(value: string) {
  console.log('Stored:', value);
}
</script>

<template>
  <NumericInput
    id="currency"
    prefix="$"
    separators=","
    :min="0"
    placeholder="$0.00"
    @stored-value-change="handleStoredValue"
  />

  <!-- Percentage input -->
  <NumericInput
    id="tax-rate"
    percentage
    :min="0"
    :max="100"
    placeholder="0%"
  />
</template>`,
    bindingSource: `<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

export interface NumericInputProps {
  id?: string;
  placeholder?: string;
  prefix?: string;
  postfix?: string;
  integer?: boolean;
  sign?: 'any' | 'positive' | 'negative';
  showPlus?: boolean;
  base?: number;
  letterCase?: 'upper' | 'lower';
  separators?: string;
  decimalSeparator?: string;
  locale?: string;
  min?: number;
  max?: number;
  validIncrement?: number;
  keyIncrement?: number;
  snapOrigin?: number;
  validationTimeout?: number;
  valueAlgebra?: string;
  percentage?: boolean;
  percentagePrefix?: boolean;
}

const props = withDefaults(defineProps<NumericInputProps>(), {});
const emit = defineEmits<{
  storedValueChange: [value: string];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
let attached = false;
let currentNumericEl: HTMLInputElement | null = null;
let currentHandler: (() => void) | null = null;

const ATTR_MAP: Record<string, string> = {
  showPlus: 'show-plus',
  letterCase: 'letter-case',
  validIncrement: 'valid-increment',
  keyIncrement: 'key-increment',
  snapOrigin: 'snap-origin',
  decimalSeparator: 'decimal-separator',
  validationTimeout: 'validation-timeout',
  valueAlgebra: 'value-algebra',
  percentagePrefix: 'percentage-prefix',
};

const CONFIG_KEYS = [
  'prefix', 'postfix', 'integer', 'sign', 'showPlus', 'base',
  'letterCase', 'separators', 'decimalSeparator', 'locale', 'min', 'max',
  'validIncrement', 'keyIncrement', 'snapOrigin',
  'validationTimeout', 'valueAlgebra', 'percentage', 'percentagePrefix',
] as const;

function cleanupListener() {
  if (currentNumericEl && currentHandler) {
    currentNumericEl.removeEventListener('input', currentHandler);
    currentNumericEl = null;
    currentHandler = null;
  }
}

function applyConfig() {
  const el = inputRef.value;
  if (!el || !window.NumericInput) return;

  cleanupListener();

  if (attached) {
    window.NumericInput.detach(el);
    attached = false;
  }

  const allAttrs = CONFIG_KEYS.map(k => ATTR_MAP[k] || k);
  allAttrs.forEach(attr => el.removeAttribute(attr));

  for (const key of CONFIG_KEYS) {
    const value = props[key];
    if (value === undefined || value === null
        || value === false || value === '') continue;
    const attrName = ATTR_MAP[key] || key;
    if (value === true) {
      el.setAttribute(attrName, '');
    } else {
      el.setAttribute(attrName, String(value));
    }
  }

  const originalId = el.id;
  window.NumericInput.attach(el);
  attached = true;

  const numericId = originalId ? originalId + '-numeric' : null;
  const numericEl = numericId
    ? (document.getElementById(numericId) as HTMLInputElement)
    : null;

  if (numericEl) {
    currentNumericEl = numericEl;
    currentHandler = () => {
      emit('storedValueChange', numericEl.value);
    };
    numericEl.addEventListener('input', currentHandler);
  }
}

onMounted(() => applyConfig());

watch(() => [
  props.prefix, props.postfix, props.integer, props.sign,
  props.showPlus, props.base, props.letterCase, props.separators,
  props.decimalSeparator, props.locale, props.min, props.max,
  props.validIncrement, props.keyIncrement, props.snapOrigin,
  props.validationTimeout, props.valueAlgebra, props.percentage,
  props.percentagePrefix,
], () => applyConfig());

onUnmounted(() => {
  cleanupListener();
  const el = inputRef.value;
  if (el && attached) {
    window.NumericInput.detach(el);
    attached = false;
  }
});

const needsTextType = !!(
  props.prefix || props.postfix || props.percentage ||
  props.percentagePrefix ||
  (props.separators && props.separators !== 'none'
    && props.separators !== 'locale') ||
  (props.base && props.base !== 10)
);
</script>

<template>
  <input
    ref="inputRef"
    :id="id"
    :type="needsTextType ? 'text' : 'number'"
    inputmode="numeric"
    :placeholder="placeholder"
  />
</template>`,
  },
  {
    id: 'angular',
    name: 'Angular',
    type: 'package',
    icon: 'angular',
    installInstructions: `npm install numeric-input numeric-input-angular`,
    usageCode: `// Import the component
import { NumericInputComponent } from 'numeric-input-angular';

@Component({
  imports: [NumericInputComponent],
  template: \`
    <numeric-input
      inputId="currency"
      prefix="$"
      separators=","
      [min]="0"
      placeholder="$0.00"
      (storedValueChange)="onValueChange($event)"
    />

    <!-- Percentage input -->
    <numeric-input
      inputId="tax-rate"
      [percentage]="true"
      [min]="0"
      [max]="100"
      placeholder="0%"
    />
  \`,
})
export class AppComponent {
  onValueChange(value: string) {
    console.log('Stored:', value);
  }
}`,
    bindingSource: `import {
  Component, ElementRef, Input, Output, EventEmitter,
  ViewChild, AfterViewInit, OnDestroy, OnChanges, SimpleChanges,
} from '@angular/core';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

const ATTR_MAP: Record<string, string> = {
  showPlus: 'show-plus',
  letterCase: 'letter-case',
  validIncrement: 'valid-increment',
  keyIncrement: 'key-increment',
  snapOrigin: 'snap-origin',
  decimalSeparator: 'decimal-separator',
  validationTimeout: 'validation-timeout',
  valueAlgebra: 'value-algebra',
  percentagePrefix: 'percentage-prefix',
};

@Component({
  selector: 'numeric-input',
  standalone: true,
  template: \`
    <input
      #inputEl
      [id]="inputId"
      [type]="computedType"
      inputmode="numeric"
      [placeholder]="placeholder"
      [class]="inputClass"
    />
  \`,
})
export class NumericInputComponent
  implements AfterViewInit, OnDestroy, OnChanges
{
  @ViewChild('inputEl') inputElRef!: ElementRef<HTMLInputElement>;

  @Input() inputId = '';
  @Input() placeholder = '';
  @Input() inputClass = '';

  @Input() prefix?: string;
  @Input() postfix?: string;
  @Input() integer?: boolean;
  @Input() sign?: 'any' | 'positive' | 'negative';
  @Input() showPlus?: boolean;
  @Input() base?: number;
  @Input() letterCase?: 'upper' | 'lower';
  @Input() separators?: string;
  @Input() decimalSeparator?: string;
  @Input() locale?: string;
  @Input() min?: number;
  @Input() max?: number;
  @Input() validIncrement?: number;
  @Input() keyIncrement?: number;
  @Input() snapOrigin?: number;
  @Input() validationTimeout?: number;
  @Input() valueAlgebra?: string;
  @Input() percentage?: boolean;
  @Input() percentagePrefix?: boolean;

  @Output() storedValueChange = new EventEmitter<string>();

  private attached = false;
  private inputHandler: (() => void) | null = null;
  private numericEl: HTMLInputElement | null = null;

  get computedType(): string {
    return !!(
      this.prefix || this.postfix || this.percentage ||
      this.percentagePrefix ||
      (this.separators && this.separators !== 'none'
        && this.separators !== 'locale') ||
      (this.base && this.base !== 10)
    ) ? 'text' : 'number';
  }

  ngAfterViewInit(): void {
    this.applyConfig();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.inputElRef) {
      this.applyConfig();
    }
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  private applyConfig(): void {
    const el = this.inputElRef?.nativeElement;
    if (!el || !window.NumericInput) return;

    this.cleanup();

    const configKeys = [
      'prefix', 'postfix', 'integer', 'sign', 'showPlus', 'base',
      'letterCase', 'separators', 'decimalSeparator', 'locale', 'min', 'max',
      'validIncrement', 'keyIncrement', 'snapOrigin',
      'validationTimeout', 'valueAlgebra', 'percentage',
      'percentagePrefix',
    ];

    const allAttrs = configKeys.map(k => ATTR_MAP[k] || k);
    allAttrs.forEach(attr => el.removeAttribute(attr));

    for (const key of configKeys) {
      const value = (this as any)[key];
      if (value === undefined || value === null
          || value === false || value === '') continue;
      const attrName = ATTR_MAP[key] || key;
      if (value === true) {
        el.setAttribute(attrName, '');
      } else {
        el.setAttribute(attrName, String(value));
      }
    }

    const originalId = el.id;
    window.NumericInput.attach(el);
    this.attached = true;

    const numericId = originalId ? originalId + '-numeric' : null;
    this.numericEl = numericId
      ? (document.getElementById(numericId) as HTMLInputElement)
      : null;

    if (this.numericEl) {
      this.inputHandler = () => {
        this.storedValueChange.emit(this.numericEl!.value);
      };
      this.numericEl.addEventListener('input', this.inputHandler);
    }
  }

  private cleanup(): void {
    if (this.numericEl && this.inputHandler) {
      this.numericEl.removeEventListener('input', this.inputHandler);
      this.inputHandler = null;
      this.numericEl = null;
    }
    const el = this.inputElRef?.nativeElement;
    if (el && this.attached) {
      window.NumericInput.detach(el);
      this.attached = false;
    }
  }
}`,
  },
  {
    id: 'svelte',
    name: 'Svelte',
    type: 'docs',
    icon: 'svelte',
    usageCode: `<!-- NumericInput.svelte -->
<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let id = '';
  export let placeholder = '';
  export let prefix: string | undefined = undefined;
  export let postfix: string | undefined = undefined;
  export let percentage: boolean = false;
  export let min: number | undefined = undefined;
  export let max: number | undefined = undefined;
  export let separators: string | undefined = undefined;

  const dispatch = createEventDispatcher<{ storedValueChange: string }>();
  let inputEl: HTMLInputElement;

  onMount(() => {
    if (prefix) inputEl.setAttribute('prefix', prefix);
    if (postfix) inputEl.setAttribute('postfix', postfix);
    if (percentage) inputEl.setAttribute('percentage', '');
    if (separators) inputEl.setAttribute('separators', separators);
    if (min !== undefined) inputEl.setAttribute('min', String(min));
    if (max !== undefined) inputEl.setAttribute('max', String(max));

    window.NumericInput.attach(inputEl);

    const numericEl = document.getElementById(id + '-numeric');
    const handler = () => dispatch('storedValueChange', numericEl?.value);
    numericEl?.addEventListener('input', handler);

    return () => {
      numericEl?.removeEventListener('input', handler);
      window.NumericInput.detach(inputEl);
    };
  });
</script>

<input bind:this={inputEl} {id} type="text" {placeholder} />

<!-- Usage -->
<NumericInput
  id="currency"
  prefix="$"
  separators=","
  min={0}
  placeholder="$0.00"
  on:storedValueChange={(e) => console.log('Stored:', e.detail)}
/>`,
  },
  {
    id: 'solid',
    name: 'Solid',
    type: 'docs',
    icon: 'solid',
    usageCode: `import { onMount, onCleanup, type Component } from 'solid-js';

interface NumericInputProps {
  id?: string;
  placeholder?: string;
  prefix?: string;
  percentage?: boolean;
  separators?: string;
  min?: number;
  max?: number;
  onStoredValueChange?: (value: string) => void;
}

const NumericInput: Component<NumericInputProps> = (props) => {
  let inputEl: HTMLInputElement | undefined;

  onMount(() => {
    if (!inputEl) return;
    if (props.prefix) inputEl.setAttribute('prefix', props.prefix);
    if (props.percentage) inputEl.setAttribute('percentage', '');
    if (props.separators) inputEl.setAttribute('separators', props.separators);
    if (props.min !== undefined) inputEl.setAttribute('min', String(props.min));
    if (props.max !== undefined) inputEl.setAttribute('max', String(props.max));

    window.NumericInput.attach(inputEl);

    const numericEl = document.getElementById(inputEl.id + '-numeric');
    const handler = () => props.onStoredValueChange?.(numericEl?.value ?? '');
    numericEl?.addEventListener('input', handler);

    onCleanup(() => {
      numericEl?.removeEventListener('input', handler);
      window.NumericInput.detach(inputEl!);
    });
  });

  return (
    <input
      ref={inputEl}
      id={props.id}
      type="text"
      placeholder={props.placeholder}
    />
  );
};

// Usage
<NumericInput
  id="currency"
  prefix="$"
  separators=","
  min={0}
  placeholder="$0.00"
  onStoredValueChange={(v) => console.log('Stored:', v)}
/>`,
  },
  {
    id: 'qwik',
    name: 'Qwik',
    type: 'docs',
    icon: 'qwik',
    usageCode: `import { component$, useSignal, useVisibleTask$, type QRL } from '@builder.io/qwik';

interface NumericInputProps {
  id?: string;
  placeholder?: string;
  prefix?: string;
  percentage?: boolean;
  separators?: string;
  min?: number;
  max?: number;
  onStoredValueChange$?: QRL<(value: string) => void>;
}

export const NumericInput = component$<NumericInputProps>((props) => {
  const inputRef = useSignal<HTMLInputElement>();

  useVisibleTask$(({ cleanup }) => {
    const el = inputRef.value;
    if (!el) return;

    if (props.prefix) el.setAttribute('prefix', props.prefix);
    if (props.percentage) el.setAttribute('percentage', '');
    if (props.separators) el.setAttribute('separators', props.separators);
    if (props.min !== undefined) el.setAttribute('min', String(props.min));
    if (props.max !== undefined) el.setAttribute('max', String(props.max));

    window.NumericInput.attach(el);

    const numericEl = document.getElementById(el.id + '-numeric');
    const handler = () => props.onStoredValueChange$?.(numericEl?.value ?? '');
    numericEl?.addEventListener('input', handler);

    cleanup(() => {
      numericEl?.removeEventListener('input', handler);
      window.NumericInput.detach(el);
    });
  });

  return (
    <input ref={inputRef} id={props.id} type="text" placeholder={props.placeholder} />
  );
});

// Usage
<NumericInput
  id="currency"
  prefix="$"
  separators=","
  min={0}
  placeholder="$0.00"
  onStoredValueChange$={(v) => console.log('Stored:', v)}
/>`,
  },
  {
    id: 'astro',
    name: 'Astro',
    type: 'docs',
    icon: 'astro',
    usageCode: [
      '---',
      '// CurrencyInput.astro',
      '---',
      '',
      '<input',
      '  id="currency-input"',
      '  type="text"',
      '  placeholder="$0.00"',
      '  prefix="$"',
      '  separators=","',
      '  min="0"',
      '/>',
      '',
      '<script>',
      '  import NumericInput from "numeric-input";',
      '',
      '  const input = document.getElementById("currency-input");',
      '  if (input) {',
      '    NumericInput.attach(input);',
      '  }',
      '</script>',
      '',
      '<!-- Percentage input -->',
      '<input',
      '  id="tax-rate"',
      '  type="text"',
      '  placeholder="0%"',
      '  percentage',
      '  min="0"',
      '  max="100"',
      '/>',
      '',
      '<script>',
      '  import NumericInput from "numeric-input";',
      '',
      '  const input = document.getElementById("tax-rate");',
      '  if (input) {',
      '    NumericInput.attach(input);',
      '  }',
      '</script>',
    ].join('\n'),
  },
];
