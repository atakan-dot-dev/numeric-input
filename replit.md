# NumericInput.js - Advanced Numeric Input Library Demo

## Project Overview
A comprehensive demo application showcasing NumericInput.js, a powerful, framework-agnostic JavaScript library for advanced numeric input handling. The library supports multiple number bases (2-36), locale-aware formatting, intelligent validation, and comprehensive keyboard interactions.

## Architecture

### Core Library (`public/numeric-input.js` and `client/public/numeric-input.js`)
- **Vanilla JavaScript**: Framework-agnostic core that can integrate with any framework
- **Dual-Input Architecture**: When attached, creates two inputs:
  - **Original (Hidden)**: Stores raw numeric value (e.g., "1234", "-25") - gets "-numeric" suffix on ID
  - **Display (Visible)**: Shows formatted value (e.g., "$1,234", "-25%") - keeps original ID
- **Attach/Detach API**: Simple methods to bind/unbind library to input elements
- **Configuration System**: Parses attributes from HTML elements
- **Event Handling**: Manages keydown, input, and paste events on display input
- **Multi-Base Support**: Handles bases 2-36 with proper letter casing
- **Locale Awareness**: Automatic formatting based on Intl API
- **Smart Validation**: Prevents invalid keystrokes before they're entered

### Test Suite (`public/numeric-input.test.js`)
- **Comprehensive Coverage**: Tests for all attributes and behaviors
- **Simple Test Runner**: Custom lightweight test framework
- **Browser Compatible**: Runs directly in the browser
- **14 Test Suites**: Validation, Formatting, Display, Keystroke, Edge Cases, Locale, Arrow Key Modifiers, Paste Filtering, Floating Point Precision, Increment Start, Non-Base-10 Increments, Postfix Display, Range Constraints, European Format
- **59 Test Cases**: Covering all functionality including bug regression tests

### Demo Application (React + TypeScript)
- **Sidebar Navigation**: Easy access to all sections
- **Dark/Light Mode**: Full theme support with toggle
- **Attribute Reference**: Comprehensive documentation of all attributes
- **Live Examples**: 20 interactive examples with live preview
- **Integrated Test Runner**: Run and view test results in the UI
- **Syntax Highlighting**: Code blocks with copy functionality

## Key Features

### Interactive Examples
- **20 Examples**: Comprehensive collection covering all library features
- **Configurable Examples**: Dynamic min/max controls on currency and percentage examples
  - Adjust constraints in real-time to test negative values and sign flipping
  - Perfect for testing edge cases and validation behavior
- **Categories**: Basic, Validation, Formatting, Base, Display, Locale, Configurable

### Attributes Supported

**Validation:**
- `valid-increment`: Restricts values to specific increments
- `key-increment`: Arrow key step amount
- `integer`: Boolean for integer-only input
- `sign`: Controls sign behavior (any, positive, negative)
- `min`, `max`: Range constraints
- `increment-start`: Base value for increment validation (defaults to max(0, min))

**Formatting:**
- `base`/`radix`: Number base (2-36)
- `letter-case`: Upper/lower for bases > 10
- `separators`: Digit grouping (locale, indian, custom)
- `decimal`: Decimal separator character

**Display:**
- `show-plus`: Display + for positive numbers
- `prefix`: String before number (e.g., "$")
- `postfix`: String after number (e.g., "%")

**Locale:**
- `locale`: Intl.Locale value for formatting

### Smart Behaviors
1. **Keystroke Filtering**: Invalid keystrokes are blocked before entry
2. **Sign Flipping**: "-" key flips sign when sign="any"
3. **Arrow Keys**: Up/down adjusts value by key-increment
4. **Range Enforcement**: Min/max constraints prevent invalid values
5. **Increment Validation**: Ensures values match valid-increment formula

## File Structure

```
├── public/
│   ├── numeric-input.js        # Core library
│   └── numeric-input.test.js   # Test suite (59 tests)
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppSidebar.tsx              # Navigation sidebar
│   │   │   ├── AttributeCard.tsx           # Attribute documentation
│   │   │   ├── CodeBlock.tsx               # Syntax highlighted code
│   │   │   ├── ExampleCard.tsx             # Interactive examples
│   │   │   ├── ConfigurableExampleCard.tsx # Adjustable min/max examples
│   │   │   ├── TestRunner.tsx              # Test suite UI
│   │   │   └── ThemeToggle.tsx             # Dark/light mode
│   │   ├── data/
│   │   │   ├── attributes.ts       # Attribute definitions
│   │   │   ├── examples.ts         # Example configurations (20 examples)
│   │   │   └── tests.ts            # Test suite data
│   │   ├── hooks/
│   │   │   ├── useNumericInput.ts  # Library integration
│   │   │   └── useTestRunner.ts    # Test execution
│   │   ├── pages/
│   │   │   └── Home.tsx            # Main demo page
│   │   └── App.tsx                 # App root with sidebar
│   └── index.html                  # Entry point
├── shared/
│   └── schema.ts                   # TypeScript types
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

**With Multiple Elements:**
```javascript
const inputs = document.querySelectorAll('.currency-input');
NumericInput.attach(inputs);
```

**Framework Integration:**
```javascript
// React example
useEffect(() => {
  const element = inputRef.current;
  NumericInput.attach(element);
  return () => NumericInput.detach(element);
}, []);
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

### Future Enhancements
- TypeScript definitions for library
- NPM package publishing
- React/Vue/Svelte wrapper components
- Accessibility improvements (ARIA labels)
- Copy/paste validation

## Testing

### Running Tests
1. Navigate to the "Tests" section in the demo
2. Click "Run All Tests" button
3. View results with pass/fail indicators
4. Expand test cases for details and errors

### Test Coverage
- ✅ Validation (min, max, increment, sign)
- ✅ Keystroke handling (arrows, sign flip, modifiers)
- ✅ Formatting (bases, separators, decimals)
- ✅ Display (prefix, postfix, show-plus)
- ✅ Locale support (decimal/group separators)
- ✅ Edge cases (conflicts, invalid values)
- ✅ Floating point precision (0.01 increments)
- ✅ Increment-start attribute
- ✅ Non-base-10 increments (hex, binary, octal)
- ✅ Postfix/prefix display during interaction
- ✅ Range constraint sign blocking
- ✅ European format (comma decimal)
- ✅ Paste filtering

## Browser Compatibility
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (14+)
- IE11: ❌ Not supported (uses modern JS)

## Performance
- **Library Size**: ~2KB gzipped
- **Zero Dependencies**: No external libraries required
- **Memory Efficient**: WeakMap for element tracking
- **Event Optimized**: Efficient keystroke filtering

## Recent Changes
- **Major Bug Fix Release (Latest)**:
  - Fixed keyIncrement NaN default: `parseFloat(null)` now properly defaults to `validIncrement || 1`
  - Fixed floating-point precision: Added `roundToPrecision` helper for arrow key increments, tolerance-based modulo in `isValidValue`
  - Added `increment-start` attribute: Separate base for increment validation (defaults to `max(0, min)`)
  - Fixed sign handling: `min >= 0` now properly blocks negative sign flipping; `sign='negative'` auto-negates typed values
  - Fixed decimal entry: Trailing decimals preserved during typing with `isTrailingDecimal` helper
  - Fixed postfix display: Always shown via `formatValue`, cursor positioned before postfix
  - Fixed European format: Dot group separators properly stripped in `parseValue`; reformatted `formatValue` to handle separator/decimal separately
  - Fixed negative-only mode: Auto-negate for `sign='negative'` in `handleInput`; standalone minus entry on empty inputs
  - Test suite expanded from 32 to 59 tests across 14 suites with full bug regression coverage
  - All test names synchronized between test file and tests.ts for proper result mapping
- **Configurable Examples**: Dynamic min/max controls on currency and percentage examples
- **20 Examples**: Comprehensive collection covering all library features
- Full demo application with sidebar navigation, dark/light theme, integrated test runner

## Known Limitations
1. Non-base-10 decimal handling is simplified (integer part only)
2. Some locale digit inputs may need additional testing
3. Mobile keyboard handling varies by browser

## Contributing
This is a demo project. For production use, additional testing and polishing would be needed, particularly:
- Mobile device testing
- Additional locale testing
- Performance optimization for large number of inputs
- Accessibility audit
