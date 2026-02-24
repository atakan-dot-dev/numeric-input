import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

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
  decimal?: string;
  locale?: string;
  validIncrement?: number;
  keyIncrement?: number;
  incrementStart?: number;
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
  incrementStart: 'increment-start',
  validationTimeout: 'validation-timeout',
  valueAlgebra: 'value-algebra',
  percentagePrefix: 'percentage-prefix',
};

const CONFIG_KEYS = [
  'prefix', 'postfix', 'integer', 'sign', 'showPlus', 'base',
  'letterCase', 'separators', 'decimal', 'locale', 'validIncrement',
  'keyIncrement', 'incrementStart', 'validationTimeout', 'valueAlgebra',
  'percentage', 'percentagePrefix',
] as const;

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(
  (props, ref) => {
    const {
      prefix, postfix, integer, sign, showPlus, base, letterCase,
      separators, decimal, locale, validIncrement, keyIncrement,
      incrementStart, validationTimeout, valueAlgebra, percentage,
      percentagePrefix, onStoredValueChange, ...inputProps
    } = props;

    const inputRef = useRef<HTMLInputElement>(null);
    const attachedRef = useRef(false);

    useImperativeHandle(ref, () => inputRef.current!);

    const configValues = {
      prefix, postfix, integer, sign, showPlus, base, letterCase,
      separators, decimal, locale, validIncrement, keyIncrement,
      incrementStart, validationTimeout, valueAlgebra, percentage,
      percentagePrefix,
    };

    useEffect(() => {
      const el = inputRef.current;
      if (!el || !window.NumericInput) return;

      if (attachedRef.current) {
        window.NumericInput.detach(el);
        attachedRef.current = false;
      }

      const allAttrs = CONFIG_KEYS.map(k => ATTR_MAP[k] || k);
      allAttrs.forEach(attr => el.removeAttribute(attr));

      for (const key of CONFIG_KEYS) {
        const value = configValues[key];
        if (value === undefined || value === null || value === false || value === '') continue;
        const attrName = ATTR_MAP[key] || key;
        if (value === true) {
          el.setAttribute(attrName, '');
        } else {
          el.setAttribute(attrName, String(value));
        }
      }

      window.NumericInput.attach(el);
      attachedRef.current = true;

      const numericId = el.id ? `${el.id}-numeric` : null;
      const numericEl = numericId ? document.getElementById(numericId) as HTMLInputElement : null;

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
      separators, decimal, locale, validIncrement, keyIncrement,
      incrementStart, validationTimeout, valueAlgebra, percentage,
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
export default NumericInput;
