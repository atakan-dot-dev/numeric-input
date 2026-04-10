# numeric-input

Framework-agnostic JavaScript library for advanced numeric input handling.

- Multi-base display (decimal, hex, binary, octal, any base 2–36)
- Locale-aware formatting via the `Intl` API
- Real-time keystroke filtering and range enforcement
- Configurable arrow-key increments with debounced validation
- Value algebra (`value-algebra="x*0.01"`) for display-vs-stored-value separation
- Percentage shorthands (`percentage`, `percentage-prefix`)
- Smart paste: normalises numbers from any locale automatically
- No dependencies, no build step — a single vanilla JS file

## Installation

**CDN (browser):**

```html
<script src="https://unpkg.com/numeric-input/numeric-input.js"></script>
```

**npm:**

```bash
npm install numeric-input
```

```js
const NumericInput = require('numeric-input');
```

## Quick start

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://unpkg.com/numeric-input/numeric-input.js"></script>
</head>
<body>
  <!-- Currency input: $0 – $10,000 in $0.01 steps -->
  <input id="price" prefix="$" separators="," decimal="." min="0" max="10000" valid-increment="0.01" />

  <!-- Percentage stored as a decimal (75 displayed → 0.75 stored) -->
  <input id="pct" percentage min="0" max="100" />

  <script>
    NumericInput.attach(document.getElementById('price'));
    NumericInput.attach(document.getElementById('pct'));

    // Or attach all at once using a selector
    // NumericInput.attach(document.querySelectorAll('[data-numeric]'));
  </script>
</body>
</html>
```

## Common attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `min` | number | Minimum allowed value |
| `max` | number | Maximum allowed value |
| `prefix` | string | Text displayed before the number (e.g. `"$"`) |
| `postfix` | string | Text displayed after the number (e.g. `"%"`) |
| `integer` | boolean | Restrict to integers only |
| `sign` | `any` \| `positive` \| `negative` | Allowed sign |
| `separators` | string | Thousands separator character (or `"locale"`) |
| `decimal` | string | Decimal separator character (or `"locale"`) |
| `locale` | string | BCP 47 locale tag for number formatting (e.g. `"de-DE"`) |
| `base` | number | Display base: 2–36 (default `10`) |
| `letter-case` | `upper` \| `lower` | Case for hex digits A–F |
| `valid-increment` | number | Snap value to nearest multiple on blur |
| `key-increment` | number | Arrow-key step size |
| `value-algebra` | string | Expression mapping display value to stored value (e.g. `"x*0.01"`) |
| `percentage` | boolean | Shorthand for `value-algebra="x*0.01" postfix="%"` |
| `percentage-prefix` | boolean | Shorthand for `value-algebra="x*0.01" prefix="%"` |
| `arrows` | `always` \| `focus` \| `never` | When to show increment/decrement buttons |
| `show-plus` | boolean | Show `+` sign for positive values |

Full attribute reference with live examples: **[demo app](https://atakan-dot-dev.github.io/numeric-input)**

## API

```js
NumericInput.attach(element)   // Attach to a single element or NodeList
NumericInput.detach(element)   // Remove all NumericInput behaviour
```

## Running tests

```bash
npm test
```

105 tests covering validation, formatting, bases, algebra, percentage, paste, and more.
