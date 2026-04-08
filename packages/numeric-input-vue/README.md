# numeric-input-vue

Vue 3 component wrapper for [numeric-input](../numeric-input), providing a fully typed `<NumericInput>` component with prop-driven configuration and a stored-value event.

## Requirements

- Vue 3
- `numeric-input` loaded globally (via CDN script tag or equivalent)

## Installation

```bash
npm install numeric-input-vue
```

Add the core library script to your HTML (or load it programmatically):

```html
<script src="https://unpkg.com/numeric-input/numeric-input.js"></script>
```

## Usage

```vue
<script setup lang="ts">
import NumericInput from 'numeric-input-vue';

function onStored(value: string) {
  console.log('stored:', value);
}
</script>

<template>
  <NumericInput
    id="price"
    prefix="$"
    separators=","
    decimal="."
    :min="0"
    :max="10000"
    :valid-increment="0.01"
    placeholder="0.00"
    @stored-value-change="onStored"
  />
</template>
```

### Percentage field (display 75 → stores 0.75)

```vue
<NumericInput
  id="discount"
  :percentage="true"
  :min="0"
  :max="100"
  @stored-value-change="(v) => discount = Number(v)"
/>
```

### Hex input with arrow-key stepping

```vue
<NumericInput
  id="color-channel"
  :base="16"
  letter-case="upper"
  :min="0"
  :max="255"
  :key-increment="1"
/>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `id` | `string` | HTML id attribute |
| `placeholder` | `string` | Placeholder text |
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

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `stored-value-change` | `string` | Fires on every change with the stored (algebra-transformed) value |

## How it works

The component renders a standard `<input>` element and calls `window.NumericInput.attach()` on mount, passing all props as HTML attributes. A `watch` on all props triggers a detach/re-attach cycle when any configuration changes. The `stored-value-change` event fires with the value from the hidden underlying input (after any `value-algebra` transformation).
