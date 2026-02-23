import { useEffect, useRef } from 'react';

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
}
