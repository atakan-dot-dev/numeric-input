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
    installInstructions: `# Install the library
npm install numeric-input

# Copy the hook to your project
# public/bindings/react/useNumericInput.ts`,
    usageCode: `import { useRef } from 'react';
import { useNumericInput } from './useNumericInput';

function CurrencyInput() {
  const inputRef = useRef<HTMLInputElement>(null);

  useNumericInput(inputRef, {
    prefix: '$',
    separators: ',',
    decimal: '.',
    min: '0',
  });

  return <input ref={inputRef} type="text" placeholder="$0.00" />;
}`,
    bindingSource: `import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

export function useNumericInput(
  ref: React.RefObject<HTMLInputElement>,
  attributes?: Record<string, string | boolean>
) {
  const attachedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.NumericInput) return;

    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        if (typeof value === 'boolean' && value) {
          el.setAttribute(key, '');
        } else if (typeof value === 'string') {
          el.setAttribute(key, value);
        }
      });
    }

    window.NumericInput.attach(el);
    attachedRef.current = true;

    return () => {
      if (attachedRef.current) {
        window.NumericInput.detach(el);
        attachedRef.current = false;
      }
    };
  }, [ref, attributes]);
}`,
  },
  {
    id: 'vue',
    name: 'Vue',
    type: 'package',
    icon: 'vue',
    installInstructions: `# Install the library
npm install numeric-input

# Copy the composable to your project
# public/bindings/vue/useNumericInput.ts`,
    usageCode: `<script setup lang="ts">
import { ref } from 'vue';
import { useNumericInput } from './useNumericInput';

const inputRef = ref<HTMLInputElement | null>(null);

useNumericInput(inputRef, {
  prefix: '$',
  separators: ',',
  decimal: '.',
  min: '0',
});
</script>

<template>
  <input ref="inputRef" type="text" placeholder="$0.00" />
</template>`,
    bindingSource: `import { onMounted, onUnmounted, ref, type Ref } from 'vue';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

export function useNumericInput(
  inputRef: Ref<HTMLInputElement | null>,
  attributes?: Record<string, string | boolean>
) {
  let attached = false;

  onMounted(() => {
    const el = inputRef.value;
    if (!el || !window.NumericInput) return;

    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        if (typeof value === 'boolean' && value) {
          el.setAttribute(key, '');
        } else if (typeof value === 'string') {
          el.setAttribute(key, value);
        }
      });
    }

    window.NumericInput.attach(el);
    attached = true;
  });

  onUnmounted(() => {
    const el = inputRef.value;
    if (el && attached) {
      window.NumericInput.detach(el);
      attached = false;
    }
  });
}`,
  },
  {
    id: 'angular',
    name: 'Angular',
    type: 'package',
    icon: 'angular',
    installInstructions: `# Install the library
npm install numeric-input

# Copy the directive to your project
# public/bindings/angular/numeric-input.directive.ts`,
    usageCode: `// app.module.ts
import { NumericInputDirective } from './numeric-input.directive';

@NgModule({
  declarations: [NumericInputDirective],
})
export class AppModule {}

// component.html
<input
  numericInput
  [numericInputAttributes]="{ prefix: '$', separators: ',', min: '0' }"
  type="text"
  placeholder="$0.00"
/>`,
    bindingSource: `import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

@Directive({
  selector: '[numericInput]',
})
export class NumericInputDirective implements OnInit, OnDestroy {
  @Input() numericInputAttributes?: Record<string, string | boolean>;

  private attached = false;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  ngOnInit(): void {
    const element = this.el.nativeElement;

    if (this.numericInputAttributes) {
      Object.entries(this.numericInputAttributes).forEach(([key, value]) => {
        if (typeof value === 'boolean' && value) {
          element.setAttribute(key, '');
        } else if (typeof value === 'string') {
          element.setAttribute(key, value);
        }
      });
    }

    if (window.NumericInput) {
      window.NumericInput.attach(element);
      this.attached = true;
    }
  }

  ngOnDestroy(): void {
    if (this.attached && window.NumericInput) {
      window.NumericInput.detach(this.el.nativeElement);
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
    usageCode: `<script lang="ts">
  import { onMount } from 'svelte';

  let inputEl: HTMLInputElement;

  onMount(() => {
    inputEl.setAttribute('prefix', '$');
    inputEl.setAttribute('separators', ',');
    inputEl.setAttribute('min', '0');

    window.NumericInput.attach(inputEl);

    return () => {
      window.NumericInput.detach(inputEl);
    };
  });
</script>

<input bind:this={inputEl} type="text" placeholder="$0.00" />`,
  },
  {
    id: 'solid',
    name: 'Solid',
    type: 'docs',
    icon: 'solid',
    usageCode: `import { onMount, onCleanup } from 'solid-js';

function CurrencyInput() {
  let inputEl: HTMLInputElement | undefined;

  onMount(() => {
    if (!inputEl) return;
    inputEl.setAttribute('prefix', '$');
    inputEl.setAttribute('separators', ',');
    inputEl.setAttribute('min', '0');

    window.NumericInput.attach(inputEl);
  });

  onCleanup(() => {
    if (inputEl) {
      window.NumericInput.detach(inputEl);
    }
  });

  return <input ref={inputEl} type="text" placeholder="$0.00" />;
}`,
  },
  {
    id: 'qwik',
    name: 'Qwik',
    type: 'docs',
    icon: 'qwik',
    usageCode: `import { component$, useSignal, useVisibleTask$ } from '@builder.io/qwik';

export const CurrencyInput = component$(() => {
  const inputRef = useSignal<HTMLInputElement>();

  useVisibleTask$(({ cleanup }) => {
    const el = inputRef.value;
    if (!el) return;

    el.setAttribute('prefix', '$');
    el.setAttribute('separators', ',');
    el.setAttribute('min', '0');

    window.NumericInput.attach(el);

    cleanup(() => {
      window.NumericInput.detach(el);
    });
  });

  return <input ref={inputRef} type="text" placeholder="$0.00" />;
});`,
  },
  {
    id: 'astro',
    name: 'Astro',
    type: 'docs',
    icon: 'astro',
    usageCode: `---
// CurrencyInput.astro
---

<input
  id="currency-input"
  type="text"
  placeholder="$0.00"
  prefix="$"
  separators=","
  min="0"
/>

<script>
  import NumericInput from 'numeric-input';

  const input = document.getElementById('currency-input');
  if (input) {
    NumericInput.attach(input);
  }
</script>`,
  },
];
