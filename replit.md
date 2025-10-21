# NumericInput.js - Advanced Numeric Input Library Demo

## Project Overview
A comprehensive demo application showcasing NumericInput.js, a powerful, framework-agnostic JavaScript library for advanced numeric input handling. The library supports multiple number bases (2-36), locale-aware formatting, intelligent validation, and comprehensive keyboard interactions.

## Architecture

### Core Library (`public/numeric-input.js`)
- **Vanilla JavaScript**: Framework-agnostic core that can integrate with any framework
- **Attach/Detach API**: Simple methods to bind/unbind library to input elements
- **Configuration System**: Parses attributes from HTML elements
- **Event Handling**: Manages keydown, keypress, and input events
- **Multi-Base Support**: Handles bases 2-36 with proper letter casing
- **Locale Awareness**: Automatic formatting based on Intl API
- **Smart Validation**: Prevents invalid keystrokes before they're entered

### Test Suite (`public/numeric-input.test.js`)
- **Comprehensive Coverage**: Tests for all attributes and behaviors
- **Simple Test Runner**: Custom lightweight test framework
- **Browser Compatible**: Runs directly in the browser
- **6 Test Suites**: Validation, Keystroke, Formatting, Display, Locale, Edge Cases
- **30+ Test Cases**: Covering all functionality

### Demo Application (React + TypeScript)
- **Sidebar Navigation**: Easy access to all sections
- **Dark/Light Mode**: Full theme support with toggle
- **Attribute Reference**: Comprehensive documentation of all attributes
- **Live Examples**: 12+ interactive examples with live preview
- **Integrated Test Runner**: Run and view test results in the UI
- **Syntax Highlighting**: Code blocks with copy functionality

## Key Features

### Attributes Supported

**Validation:**
- `valid-increment`: Restricts values to specific increments
- `key-increment`: Arrow key step amount
- `integer`: Boolean for integer-only input
- `sign`: Controls sign behavior (any, positive, negative)
- `min`, `max`: Range constraints

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
│   └── numeric-input.test.js   # Test suite
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppSidebar.tsx      # Navigation sidebar
│   │   │   ├── AttributeCard.tsx   # Attribute documentation
│   │   │   ├── CodeBlock.tsx       # Syntax highlighted code
│   │   │   ├── ExampleCard.tsx     # Interactive examples
│   │   │   ├── TestRunner.tsx      # Test suite UI
│   │   │   └── ThemeToggle.tsx     # Dark/light mode
│   │   ├── data/
│   │   │   ├── attributes.ts       # Attribute definitions
│   │   │   ├── examples.ts         # Example configurations
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
- ✅ Keystroke handling (arrows, sign flip)
- ✅ Formatting (bases, separators, decimals)
- ✅ Display (prefix, postfix, show-plus)
- ✅ Locale support
- ✅ Edge cases (conflicts, invalid values)

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
- Initial implementation of core library
- Comprehensive test suite with 30+ tests
- Full demo application with 12+ examples
- Dark/light theme support
- Integrated test runner UI

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
