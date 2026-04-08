# numeric-input-react

React component wrapper for [numeric-input](../numeric-input), providing a fully typed `<NumericInput>` component with prop-driven configuration and a stored-value callback.

## Requirements

- React 18 or 19
- `numeric-input` loaded globally (via CDN script tag or equivalent)

## Installation

```bash
npm install numeric-input-react
```

Add the core library script to your HTML (or load it programmatically):

```html
<script src="https://unpkg.com/numeric-input/numeric-input.js"></script>
```

## Usage

```tsx
import { NumericInput } from 'numeric-input-react';

function PriceInput() {
  return (
    <NumericInput
      id="price"
      prefix="$"
      separators=","
      decimal="."
      min={0}
      max={10000}
      validIncrement={0.01}
      placeholder="0.00"
      onStoredValueChange={(value) => console.log('stored:', value)}
    />
  );
}
```

### Percentage field (display 75 → stores 0.75)

```tsx
<NumericInput
  id="discount"
  percentage
  min={0}
  max={100}
  onStoredValueChange={(value) => setDiscount(Number(value))}
/>
```

### Hex input with arrow-key stepping

```tsx
<NumericInput
  id="color-channel"
  base={16}
  letterCase="upper"
  min={0}
  max={255}
  keyIncrement={1}
/>
```

## Props

All standard `<input>` HTML attributes are supported in addition to the numeric-input-specific props below.

| Prop | Type | Description |
|------|------|-------------|
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
| `onStoredValueChange` | `(value: string) => void` | Fires on every change with the stored (algebra-transformed) value |

## How it works

The component renders a standard `<input>` element and calls `window.NumericInput.attach()` after mount, passing all props as HTML attributes. When props change, it detaches and re-attaches automatically. The `onStoredValueChange` callback fires with the value from the hidden underlying input (after any `value-algebra` transformation).
