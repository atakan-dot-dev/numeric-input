# numeric-input-angular

Angular standalone component wrapper for [numeric-input](../numeric-input), providing a fully typed `<numeric-input>` component with input-binding configuration and a stored-value output event.

## Requirements

- Angular 16, 17, 18, or 19
- `numeric-input` loaded globally (via CDN script tag or equivalent)

## Installation

```bash
npm install numeric-input-angular
```

Add the core library script to your `angular.json` scripts array or `index.html`:

```html
<script src="https://unpkg.com/numeric-input/numeric-input.js"></script>
```

## Usage

Import the standalone component:

```ts
import { NumericInputComponent } from 'numeric-input-angular';

@Component({
  standalone: true,
  imports: [NumericInputComponent],
  template: `
    <numeric-input
      inputId="price"
      prefix="$"
      separators=","
      decimal="."
      [min]="0"
      [max]="10000"
      [validIncrement]="0.01"
      placeholder="0.00"
      (storedValueChange)="onStored($event)"
    />
  `,
})
export class MyComponent {
  onStored(value: string) {
    console.log('stored:', value);
  }
}
```

### Percentage field (display 75 → stores 0.75)

```html
<numeric-input
  inputId="discount"
  [percentage]="true"
  [min]="0"
  [max]="100"
  (storedValueChange)="discount = +$event"
/>
```

### Hex input with arrow-key stepping

```html
<numeric-input
  inputId="color-channel"
  [base]="16"
  letterCase="upper"
  [min]="0"
  [max]="255"
  [keyIncrement]="1"
/>
```

## Inputs

| Input | Type | Description |
|-------|------|-------------|
| `inputId` | `string` | HTML id attribute for the inner input |
| `placeholder` | `string` | Placeholder text |
| `inputClass` | `string` | CSS class(es) applied to the inner input |
| `prefix` | `string` | Text shown before the number |
| `postfix` | `string` | Text shown after the number |
| `integer` | `boolean` | Integers only |
| `sign` | `'any' \| 'positive' \| 'negative'` | Allowed sign |
| `showPlus` | `boolean` | Display `+` for positive values |
| `base` | `number` | Numeral base 2–36 (default `10`) |
| `letterCase` | `'upper' \| 'lower'` | Case for base > 10 digits |
| `separators` | `string` | Thousands separator (or `"locale"`) |
| `decimal` | `string` | Decimal separator (or `"locale"`) |
| `locale` | `string` | BCP 47 locale tag |
| `min` | `number` | Minimum value |
| `max` | `number` | Maximum value |
| `validIncrement` | `number` | Snap to nearest multiple on blur |
| `keyIncrement` | `number` | Arrow-key step size |
| `incrementStart` | `number` | Arrow-key starting value when field is empty |
| `validationTimeout` | `number` | Debounce delay (ms) before increment snapping |
| `valueAlgebra` | `string` | Expression mapping display → stored value |
| `percentage` | `boolean` | Shorthand: `value-algebra="x*0.01" postfix="%"` |
| `percentagePrefix` | `boolean` | Shorthand: `value-algebra="x*0.01" prefix="%"` |

## Outputs

| Output | Payload | Description |
|--------|---------|-------------|
| `storedValueChange` | `string` | Fires on every change with the stored (algebra-transformed) value |

## How it works

The component is a standalone Angular component that renders a standard `<input>` element and calls `window.NumericInput.attach()` in `ngAfterViewInit`, passing all inputs as HTML attributes. `ngOnChanges` triggers a detach/re-attach cycle when any input binding changes. The `storedValueChange` output fires with the value from the hidden underlying input (after any `value-algebra` transformation).
