import { onMounted, onUnmounted, ref, type Ref } from 'vue';

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
}
