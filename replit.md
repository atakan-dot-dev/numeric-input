# NumericInput.js - Advanced Numeric Input Library Demo

## Project Overview
A comprehensive demo application showcasing NumericInput.js, a powerful, framework-agnostic JavaScript library for advanced numeric input handling. The library supports multiple number bases (2-36), locale-aware formatting, intelligent validation, value-algebra transformations, and comprehensive keyboard interactions.

## Architecture

### Core Library (`public/numeric-input.js` and `client/public/numeric-input.js`)
- **Vanilla JavaScript**: Framework-agnostic core that can integrate with any framework
- **Dual-Input Architecture**: When attached, creates two inputs:
  - **Original (Hidden)**: Stores raw numeric value (or algebra-transformed value) - gets "-numeric" suffix on ID
  - **Display (Visible)**: Shows formatted value (e.g., "$1,234", "50%") - keeps original ID
- **Attach/Detach API**: Simple methods to bind/unbind library to input elements
- **Configuration System**: Parses attributes from HTML elements
- **Event Handling**: Manages keydown, input, and paste events on display input
- **Multi-Base Support**: Handles bases 2-36 with proper letter casing
- **Locale Awareness**: Automatic formatting based on Intl API
- **Smart Validation**: Prevents invalid keystrokes before they're entered
- **Value Algebra**: Safe expression parser for transforming display values to stored values

### Test Suite (`public/numeric-input.test.js`)
- **Comprehensive Coverage**: Tests for all attributes and behaviors
- **Simple Test Runner**: Custom lightweight test framework
- **Browser Compatible**: Runs directly in the browser
- **19 Test Suites**: Validation, Formatting, Display, Keystroke, Edge Cases, Locale, Arrow Key Modifiers, Paste Filtering, Floating Point Precision, Increment Start, Non-Base-10 Increments, Postfix Display, Range Constraints, European Format, Precision Preservation, Validation Timeout, Value Algebra, Percentage, Arrow Buttons
- **~88 Test Cases**: Covering all functionality including value-algebra, percentage, and arrow button tests

### Demo Application (React + TypeScript)
- **Sidebar Navigation**: Easy access to all sections including Framework Bindings
- **Dark/Light Mode**: Full theme support with toggle
- **Attribute Reference**: Comprehensive documentation with 5 tabs (Validation, Formatting, Display, Locale, Advanced)
- **10 Interactive Examples**: Configurable controls (selects, inputs, toggles, switch-labels) for real-time attribute experimentation
- **About Section**: Project background describing AI-assisted development experiment
- **Framework Bindings**: Code examples for 7 frameworks (React, Vue, Angular, Svelte, Solid, Qwik, Astro)
- **Integrated Test Runner**: Run and view test results in the UI
- **Syntax Highlighting**: Code blocks with copy functionality

### Framework Bindings (`public/bindings/`)
- **React** (`numeric-input-react/`): `<NumericInput>` component with typed props, forwardRef, lifecycle management
- **Vue** (`numeric-input-vue/`): `<NumericInput>` SFC component with props, emits, watchers
- **Angular** (`numeric-input-angular/`): `<numeric-input>` standalone component with @Input/@Output bindings
- **Svelte, Solid, Qwik, Astro**: Documentation-only component patterns
- Each package has `package.json` with `numeric-input` as peer dependency

## Key Features

### Interactive Examples
- **10 Interactive Examples**: Each with configurable controls (selects, inputs, toggles, switch-labels)
  - Basic Number, Range & Increments, Currency, Percentage, Number Base, Display Options, Locale & Format, Value Algebra, Precision, Full Config Playground
- **Real-time Configuration**: Adjust any attribute and see behavior change instantly
- **Auto-generated HTML**: Code block updates as controls change
- **Stored Value Display**: Shows the underlying value stored in the hidden input

### Attributes Supported

**Validation:**
- `valid-increment`: Restricts values to specific increments
- `key-increment`: Arrow key step amount
- `integer`: Boolean for integer-only input
- `sign`: Controls sign behavior (any, positive, negative)
- `min`, `max`: Range constraints
- `increment-start`: Base value for increment validation (defaults to max(0, min))
- `validation-timeout`: Debounce delay in ms before snapping to valid increment (default 500)

**Formatting:**
- `base`/`radix`: Number base (2-36)
- `letter-case`: Upper/lower for bases > 10
- `separators`: Digit grouping (locale, indian, custom)
- `decimal`: Decimal separator character

**Display:**
- `show-plus`: Display + for positive numbers
- `prefix`: String before number (e.g., "$")
- `postfix`: String after number (e.g., "%")
- `arrows`: Arrow button visibility (always/never/focus) — custom increment/decrement buttons

**Locale:**
- `locale`: Intl.Locale value for formatting

**Advanced:**
- `value-algebra`: Expression to transform display value → stored value (e.g., `x*0.01`)
  - Safe recursive descent parser (no eval/Function)
  - Supports: `+`, `-`, `*`, `/`, parentheses, variable `x`, `floor()`, `ceil()`, `round()`
  - Constraints: max 100 characters, max 5 operations (parentheses don't count)
  - Display shows raw number; hidden input stores algebra-transformed result
- `percentage`: Shorthand for `value-algebra="x*0.01" postfix="%"`
- `percentage-prefix`: Shorthand for `value-algebra="x*0.01" prefix="%"`

### Smart Behaviors
1. **Keystroke Filtering**: Invalid keystrokes are blocked before entry
2. **Sign Flipping**: "-" key flips sign when sign="any"
3. **Arrow Keys**: Up/down adjusts value by key-increment
4. **Range Enforcement**: Min/max constraints prevent invalid values
5. **Increment Validation**: Ensures values match valid-increment formula
6. **Debounced Validation**: Increment constraints use configurable timeout (default 500ms)
7. **Precision Preservation**: Arrow key increments with integer steps preserve user-typed decimal places
8. **Value Algebra**: Algebraic expressions transform display values to stored values safely
9. **Custom Arrow Buttons**: Configurable increment/decrement buttons (always/never/focus visibility)

## File Structure

```
├── public/
│   ├── numeric-input.js        # Core library (synced copy)
│   ├── numeric-input.test.js   # Test suite (synced copy)
│   └── bindings/
│       ├── numeric-input-react/
│       │   ├── package.json
│       │   └── src/NumericInput.tsx
│       ├── numeric-input-vue/
│       │   ├── package.json
│       │   └── src/NumericInput.vue
│       └── numeric-input-angular/
│           ├── package.json
│           └── src/numeric-input.component.ts
├── client/
│   ├── public/
│   │   ├── numeric-input.js        # Core library
│   │   └── numeric-input.test.js   # Test suite (~88 tests)
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppSidebar.tsx              # Navigation sidebar
│   │   │   ├── AttributeCard.tsx           # Attribute documentation
│   │   │   ├── CodeBlock.tsx               # Syntax highlighted code
│   │   │   ├── InteractiveExampleCard.tsx  # Interactive examples with controls
│   │   │   ├── TestRunner.tsx              # Test suite UI
│   │   │   └── ThemeToggle.tsx             # Dark/light mode
│   │   ├── data/
│   │   │   ├── attributes.ts       # Attribute definitions (5 categories)
│   │   │   ├── examples.ts         # Example configurations (10 interactive)
│   │   │   ├── frameworkBindings.ts # Framework binding code examples
│   │   │   └── tests.ts            # Test suite data
│   │   ├── hooks/
│   │   │   ├── useNumericInput.ts  # Library integration
│   │   │   └── useTestRunner.ts    # Test execution
│   │   ├── pages/
│   │   │   └── Home.tsx            # Main demo page
│   │   └── App.tsx                 # App root with sidebar
│   └── index.html                  # Entry point
├── shared/
│   └── schema.ts                   # TypeScript types (includes ExampleControl)
└── server/
    └── (Express backend for serving)
```

## Usage

### Running the Demo
The application starts automatically with `npm run dev`. Navigate to the URL shown in the console to view the interactive demo.

### Using the Library

**Attach to Element:**
```html
<input type="number" min="0" max="100" prefix="$" />
<script>
  NumericInput.attach(document.querySelector('input'));
</script>
```

**Percentage Input:**
```html
<input type="text" percentage min="0" max="100" />
<!-- User types 50, form submits 0.5 -->
```

**Value Algebra:**
```html
<input type="text" value-algebra="x*0.01" postfix="%" />
<!-- Custom algebra: display → stored transformation -->
```

**Framework Integration (React):**
```typescript
import { NumericInput } from 'numeric-input-react';

function MyInput() {
  return <NumericInput percentage min={0} max={100} placeholder="0%" />;
}
```

## Development Notes

### Design System
- **Color Palette**: Developer tool aesthetic (Linear/Vercel inspired)
- **Typography**: Inter for UI, JetBrains Mono for code
- **Dark Mode**: Primary theme with light mode support
- **Spacing**: Consistent 4-6 unit gutters throughout
- **Components**: Shadcn UI component library

### Technical Decisions
1. **Vanilla JS Core**: Ensures framework independence
2. **Attribute-Based Config**: Familiar HTML pattern
3. **Event Prevention**: Better UX than validation after input
4. **Intl API**: Leverages browser's locale capabilities
5. **WeakMap Storage**: Prevents memory leaks
6. **Safe Expression Parser**: Recursive descent parser prevents code injection (no eval)
7. **Interactive Examples**: Controls-based UI replaces static code editing

## Testing

### Running Tests
1. Navigate to the "Tests" section in the demo
2. Click "Run All Tests" button
3. View results with pass/fail indicators
4. Expand test cases for details and errors

### Test Coverage
- Validation (min, max, increment, sign)
- Keystroke handling (arrows, sign flip, modifiers)
- Formatting (bases, separators, decimals)
- Display (prefix, postfix, show-plus)
- Locale support (decimal/group separators)
- Edge cases (conflicts, invalid values)
- Floating point precision (0.01 increments)
- Increment-start attribute
- Non-base-10 increments (hex, binary, octal)
- Postfix/prefix display during interaction
- Range constraint sign blocking
- European format (comma decimal)
- Paste filtering
- Precision preservation (arrow key decimals)
- Validation timeout (debounced increment snapping)
- Value algebra (expression parser, functions, security)
- Percentage shorthands (percentage, percentage-prefix)
- Arrow buttons (always/never/focus visibility modes)

## Browser Compatibility
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (14+)
- IE11: Not supported (uses modern JS)

## Performance
- **Library Size**: ~3KB gzipped (includes expression parser)
- **Zero Dependencies**: No external libraries required
- **Memory Efficient**: WeakMap for element tracking
- **Event Optimized**: Efficient keystroke filtering
- **Zero-cost Algebra**: Expression parser code paths skipped when value-algebra not set

## Recent Changes
- **Value Algebra & Interactive Examples (Latest)**:
  - Added `value-algebra` attribute with safe recursive descent expression parser (~200 lines)
  - Parser supports: arithmetic (`+`,`-`,`*`,`/`), parentheses, variable `x`, functions (`floor`,`ceil`,`round`)
  - Security: No eval/Function, max 100 chars, max 5 operations, parentheses don't count as operations
  - Added `percentage` and `percentage-prefix` shorthand attributes
  - Consolidated 20 examples → 10 interactive examples with select/input/toggle controls
  - New `InteractiveExampleCard` component with real-time config, auto-generated HTML, stored value display
  - Removed old `ExampleCard` and `ConfigurableExampleCard` components
  - Added "Advanced" attribute tab (value-algebra, percentage, percentage-prefix, increment-start, validation-timeout)
  - Added framework bindings as npm packages: React component, Vue SFC, Angular standalone component; Svelte/Solid/Qwik/Astro (docs)
  - Added "Framework Bindings" section with tabbed code display for 7 frameworks
  - Test suite expanded to ~88 tests across 19 suites (added Value Algebra, Percentage, Arrow Button tests)
  - Updated schema with ExampleControl types for interactive example controls (including switch-label)
- **UI Enhancements (Latest)**:
  - Added `arrows` attribute (always/never/focus) with custom increment/decrement buttons in core library
  - Custom arrow buttons use wrapper div with absolute positioning and opacity/pointer-events for focus visibility
  - Added `switch-label` control type for exclusive prefix/postfix toggles (used in Percentage and Currency examples)
  - Currency example enhanced with prefix/postfix switch, separate text inputs, and key-increment control
  - Reordered feature boxes: Smart Validation, Easy Integration, Locale Aware, Rich Feature Set (2-column layout)
  - Added "About This Project" section describing AI-assisted development experiment
  - Added "About" link to sidebar navigation

## Known Limitations
1. Non-base-10 decimal handling is simplified (integer part only)
2. Some locale digit inputs may need additional testing
3. Mobile keyboard handling varies by browser
4. Value-algebra reverse computation not supported (display value must be set directly)
5. Expression parser limited to 5 operations and 100 characters by design
