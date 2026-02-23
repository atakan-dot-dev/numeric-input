import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';

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
}
