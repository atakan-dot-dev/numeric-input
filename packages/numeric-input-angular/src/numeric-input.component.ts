import {
  Component,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  SimpleChanges,
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
  template: `
    <input
      #inputEl
      [id]="inputId"
      [type]="computedType"
      inputmode="numeric"
      [placeholder]="placeholder"
      [class]="inputClass"
    />
  `,
})
export class NumericInputComponent implements AfterViewInit, OnDestroy, OnChanges {
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
      this.prefix || this.postfix || this.percentage || this.percentagePrefix ||
      (this.separators && this.separators !== 'none' && this.separators !== 'locale') ||
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
      'validIncrement', 'keyIncrement', 'snapOrigin', 'validationTimeout',
      'valueAlgebra', 'percentage', 'percentagePrefix',
    ];

    const allAttrs = configKeys.map(k => ATTR_MAP[k] || k);
    allAttrs.forEach(attr => el.removeAttribute(attr));

    for (const key of configKeys) {
      const value = (this as any)[key];
      if (value === undefined || value === null || value === false || value === '') continue;
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

    const numericId = originalId ? `${originalId}-numeric` : null;
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
}
