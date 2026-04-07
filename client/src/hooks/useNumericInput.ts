import { useEffect, useRef } from 'react';
import type { NumericInputConfig } from '@shared/schema';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

let scriptPromise: Promise<void> | null = null;

export function loadNumericInputScript(): Promise<void> {
  if (scriptPromise) {
    return scriptPromise;
  }

  if (window.NumericInput) {
    scriptPromise = Promise.resolve();
    return scriptPromise;
  }

  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = '/numeric-input.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load NumericInput script'));
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export function useNumericInput(elementId: string, config: Partial<NumericInputConfig>, scriptLoaded: boolean) {
  const attached = useRef(false);

  useEffect(() => {
    if (!scriptLoaded || !window.NumericInput) {
      return;
    }

    const element = document.getElementById(elementId);
    if (!element || attached.current) {
      return;
    }

    // Set attributes on the element
    Object.entries(config).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const attrName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        
        if (typeof value === 'boolean') {
          if (value) {
            element.setAttribute(attrName, '');
          }
        } else {
          element.setAttribute(attrName, String(value));
        }
      }
    });

    // Attach the library
    window.NumericInput.attach(element);
    attached.current = true;

    return () => {
      if (element && window.NumericInput) {
        window.NumericInput.detach(element);
        attached.current = false;
      }
    };
  }, [elementId, config, scriptLoaded]);
}
