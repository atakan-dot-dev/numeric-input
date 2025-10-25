/**
 * NumericInput.js Test Suite
 * Comprehensive tests for all library functionality
 */

// Simple test framework
const TestRunner = {
  tests: [],
  suites: {},
  currentSuite: null,

  suite(name, fn) {
    this.currentSuite = name;
    this.suites[name] = [];
    fn();
    this.currentSuite = null;
  },

  test(name, fn) {
    const test = {
      suite: this.currentSuite,
      name,
      fn,
      status: 'pending',
      error: null,
      duration: 0,
    };
    this.tests.push(test);
    if (this.currentSuite) {
      this.suites[this.currentSuite].push(test);
    }
  },

  async run() {
    const results = {
      total: this.tests.length,
      passed: 0,
      failed: 0,
      tests: [],
    };

    for (const test of this.tests) {
      const start = performance.now();
      try {
        test.status = 'running';
        await test.fn();
        test.status = 'passed';
        results.passed++;
      } catch (error) {
        test.status = 'failed';
        test.error = error.message;
        results.failed++;
      }
      test.duration = performance.now() - start;
      results.tests.push(test);
    }

    return results;
  },

  reset() {
    this.tests = [];
    this.suites = {};
    this.currentSuite = null;
  },
};

// Assertion helpers
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
}

function assertThrows(fn, message) {
  try {
    fn();
    throw new Error(message || 'Expected function to throw');
  } catch (error) {
    // Expected
  }
}

// Mock DOM elements for testing
function createMockInput(attributes = {}) {
  const input = {
    type: 'number',
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
    _attributes: { ...attributes },
    _listeners: {},
    
    getAttribute(name) {
      return this._attributes[name];
    },
    
    setAttribute(name, value) {
      this._attributes[name] = value;
    },
    
    hasAttribute(name) {
      return name in this._attributes;
    },
    
    removeAttribute(name) {
      delete this._attributes[name];
    },
    
    addEventListener(event, handler) {
      if (!this._listeners[event]) {
        this._listeners[event] = [];
      }
      this._listeners[event].push(handler);
    },
    
    removeEventListener(event, handler) {
      if (this._listeners[event]) {
        this._listeners[event] = this._listeners[event].filter(h => h !== handler);
      }
    },
    
    dispatchEvent(event) {
      const listeners = this._listeners[event.type] || [];
      listeners.forEach(handler => handler(event));
    },
    
    setSelectionRange(start, end) {
      this.selectionStart = start;
      this.selectionEnd = end;
    },
  };
  
  return input;
}

// Load NumericInput library
if (typeof NumericInput === 'undefined' && typeof require !== 'undefined') {
  var NumericInput = require('./numeric-input.js');
}

// ============================================================================
// VALIDATION TESTS
// ============================================================================

TestRunner.suite('Validation Tests', () => {
  TestRunner.test('Min value constraint', () => {
    const config = NumericInput.parseConfig(createMockInput({ min: '0' }));
    assert(NumericInput.isValidValue(0, config), 'Value 0 should be valid with min=0');
    assert(NumericInput.isValidValue(10, config), 'Value 10 should be valid with min=0');
    assert(!NumericInput.isValidValue(-1, config), 'Value -1 should be invalid with min=0');
  });

  TestRunner.test('Max value constraint', () => {
    const config = NumericInput.parseConfig(createMockInput({ max: '100' }));
    assert(NumericInput.isValidValue(100, config), 'Value 100 should be valid with max=100');
    assert(NumericInput.isValidValue(50, config), 'Value 50 should be valid with max=100');
    assert(!NumericInput.isValidValue(101, config), 'Value 101 should be invalid with max=100');
  });

  TestRunner.test('Valid increment enforcement', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'valid-increment': '5',
      min: '0'
    }));
    assert(NumericInput.isValidValue(0, config), 'Value 0 should be valid');
    assert(NumericInput.isValidValue(5, config), 'Value 5 should be valid');
    assert(NumericInput.isValidValue(10, config), 'Value 10 should be valid');
    assert(!NumericInput.isValidValue(3, config), 'Value 3 should be invalid with increment=5');
    assert(!NumericInput.isValidValue(7, config), 'Value 7 should be invalid with increment=5');
  });

  TestRunner.test('Integer attribute', () => {
    const config = NumericInput.parseConfig(createMockInput({ integer: '' }));
    assertEqual(config.validIncrement, 1, 'Valid increment should be 1 for integer');
    assert(config.integer, 'Integer flag should be true');
  });

  TestRunner.test('Sign positive constraint', () => {
    const config = NumericInput.parseConfig(createMockInput({ sign: 'positive' }));
    assert(NumericInput.isValidValue(10, config), 'Positive value should be valid');
    assert(NumericInput.isValidValue(0, config), 'Zero should be valid');
    assert(!NumericInput.isValidValue(-10, config), 'Negative value should be invalid');
  });

  TestRunner.test('Sign negative constraint', () => {
    const config = NumericInput.parseConfig(createMockInput({ sign: 'negative' }));
    assert(NumericInput.isValidValue(-10, config), 'Negative value should be valid');
    assert(!NumericInput.isValidValue(10, config), 'Positive value should be invalid');
  });
});

// ============================================================================
// FORMATTING TESTS
// ============================================================================

TestRunner.suite('Formatting Tests', () => {
  TestRunner.test('Decimal (base 10) display', () => {
    const config = NumericInput.parseConfig(createMockInput({}));
    const formatted = NumericInput.formatValue(12345, config);
    assert(formatted.includes('12345'), 'Should format decimal number correctly');
  });

  TestRunner.test('Binary (base 2) display', () => {
    const config = NumericInput.parseConfig(createMockInput({ base: '2' }));
    const formatted = NumericInput.formatValue(5, config);
    assertEqual(formatted, '101', 'Should format binary correctly');
  });

  TestRunner.test('Hexadecimal (base 16) display', () => {
    const config = NumericInput.parseConfig(createMockInput({ base: '16' }));
    const formatted = NumericInput.formatValue(255, config);
    assertEqual(formatted, 'FF', 'Should format hexadecimal correctly');
  });

  TestRunner.test('Letter case upper', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      base: '16',
      'letter-case': 'upper'
    }));
    const formatted = NumericInput.formatValue(171, config);
    assertEqual(formatted, 'AB', 'Should use uppercase letters');
  });

  TestRunner.test('Letter case lower', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      base: '16',
      'letter-case': 'lower'
    }));
    const formatted = NumericInput.formatValue(171, config);
    assertEqual(formatted, 'ab', 'Should use lowercase letters');
  });

  TestRunner.test('Separator formatting', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      separators: ',',
      locale: 'en-US'
    }));
    const formatted = NumericInput.formatValue(1000000, config);
    assert(formatted.includes(','), 'Should include comma separator');
  });

  TestRunner.test('Indian separator system', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      separators: 'indian',
      locale: 'en-IN'
    }));
    const formatted = NumericInput.formatValue(100000, config);
    assert(formatted.includes(','), 'Should include separators for Indian numbering');
  });

  TestRunner.test('Decimal character', () => {
    const config = NumericInput.parseConfig(createMockInput({ decimal: ',' }));
    const formatted = NumericInput.formatValue(1.5, config);
    assert(formatted.includes(','), 'Should use custom decimal separator');
  });
});

// ============================================================================
// DISPLAY TESTS
// ============================================================================

TestRunner.suite('Display Tests', () => {
  TestRunner.test('Prefix display', () => {
    const config = NumericInput.parseConfig(createMockInput({ prefix: '$' }));
    const formatted = NumericInput.formatValue(100, config);
    assert(formatted.startsWith('$'), 'Should display prefix');
  });

  TestRunner.test('Postfix display', () => {
    const config = NumericInput.parseConfig(createMockInput({ postfix: '%' }));
    const formatted = NumericInput.formatValue(50, config);
    assert(formatted.endsWith('%'), 'Should display postfix');
  });

  TestRunner.test('Show plus sign', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'show-plus': '' }));
    const formatted = NumericInput.formatValue(10, config);
    assert(formatted.startsWith('+'), 'Should display + for positive numbers');
  });

  TestRunner.test('Prefix with sign', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      prefix: '$',
      'show-plus': ''
    }));
    const formatted = NumericInput.formatValue(10, config);
    assert(formatted.startsWith('+$') || formatted.includes('+$'), 'Should display sign before prefix');
  });
});

// ============================================================================
// KEYSTROKE TESTS
// ============================================================================

TestRunner.suite('Keystroke Tests', () => {
  TestRunner.test('Arrow key increment', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'key-increment': '5' }));
    const newValue = NumericInput.handleArrowKey(1, 0, config);
    assertEqual(newValue, 5, 'Should increment by key-increment amount');
  });

  TestRunner.test('Arrow key decrement', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'key-increment': '5' }));
    const newValue = NumericInput.handleArrowKey(-1, 10, config);
    assertEqual(newValue, 5, 'Should decrement by key-increment amount');
  });

  TestRunner.test('Allow sign without number', () => {
    const config = NumericInput.parseConfig(createMockInput({ sign: 'any' }));
    const parsed = NumericInput.parseValue('-', config);
    assert(parsed === '' || parsed === '-', 'Should allow standalone sign');
  });

  TestRunner.test('Sign flipping prevents multiple signs', () => {
    const input = createMockInput({ sign: 'any' });
    const config = NumericInput.parseConfig(input);
    input.value = '';
    
    // First minus should not add anything when no value
    const event1 = { key: '-', preventDefault: () => {}, altKey: false, ctrlKey: false, shiftKey: false, metaKey: false };
    NumericInput.handleKeyDown(event1, input, config);
    assert(input.value === '', 'First minus on empty input should do nothing');
    
    // Type a number
    input.value = '5';
    
    // Second minus should flip sign
    const event2 = { key: '-', preventDefault: () => {}, altKey: false, ctrlKey: false, shiftKey: false, metaKey: false };
    NumericInput.handleKeyDown(event2, input, config);
    assert(input.value === '-5', 'Minus should flip to negative');
    
    // Third minus should flip back
    const event3 = { key: '-', preventDefault: () => {}, altKey: false, ctrlKey: false, shiftKey: false, metaKey: false };
    NumericInput.handleKeyDown(event3, input, config);
    assert(input.value === '5', 'Minus should flip back to positive');
  });

  TestRunner.test('Plus key prevents multiple signs', () => {
    const input = createMockInput({ sign: 'any' });
    const config = NumericInput.parseConfig(input);
    input.value = '-5';
    
    // Plus should flip negative to positive
    const event = { key: '+', preventDefault: () => {}, altKey: false, ctrlKey: false, shiftKey: false, metaKey: false };
    NumericInput.handleKeyDown(event, input, config);
    assert(input.value === '5', 'Plus should flip negative to positive');
  });

  TestRunner.test('Minus key blocked when sign=positive', () => {
    const input = createMockInput({ sign: 'positive' });
    const config = NumericInput.parseConfig(input);
    input.value = '5';
    let prevented = false;
    
    const event = { 
      key: '-', 
      preventDefault: () => { prevented = true; },
      altKey: false, 
      ctrlKey: false, 
      shiftKey: false, 
      metaKey: false 
    };
    NumericInput.handleKeyDown(event, input, config);
    assert(prevented, 'Minus key should be prevented when sign=positive');
    assert(input.value === '5', 'Value should not change');
  });

  TestRunner.test('Minus key blocked when min > 0', () => {
    const input = createMockInput({ min: '1', sign: 'any' });
    const config = NumericInput.parseConfig(input);
    input.value = '5';
    let prevented = false;
    
    const event = { 
      key: '-', 
      preventDefault: () => { prevented = true; },
      altKey: false, 
      ctrlKey: false, 
      shiftKey: false, 
      metaKey: false 
    };
    NumericInput.handleKeyDown(event, input, config);
    assert(prevented, 'Minus key should be prevented when min > 0');
  });
});

// ============================================================================
// EDGE CASE TESTS
// ============================================================================

TestRunner.suite('Edge Case Tests', () => {
  TestRunner.test('Both base and radix', () => {
    const consoleSpy = [];
    const originalWarn = console.warn;
    console.warn = (msg) => consoleSpy.push(msg);
    
    const config = NumericInput.parseConfig(createMockInput({ 
      base: '10',
      radix: '16'
    }));
    
    assertEqual(config.base, 16, 'Should use radix when both provided');
    assert(consoleSpy.length > 0, 'Should log warning');
    
    console.warn = originalWarn;
  });

  TestRunner.test('Invalid base value', () => {
    const config = NumericInput.parseConfig(createMockInput({ base: '50' }));
    assertEqual(config.base, 10, 'Should default to base 10 for invalid base');
  });

  TestRunner.test('Empty input', () => {
    const config = NumericInput.parseConfig(createMockInput({}));
    const formatted = NumericInput.formatValue('', config);
    assertEqual(formatted, '', 'Should handle empty input');
  });

  TestRunner.test('Parse configuration', () => {
    const input = createMockInput({
      'valid-increment': '5',
      min: '0',
      max: '100',
      base: '10',
    });
    const config = NumericInput.parseConfig(input);
    assertEqual(config.validIncrement, 5, 'Should parse valid-increment');
    assertEqual(config.min, 0, 'Should parse min');
    assertEqual(config.max, 100, 'Should parse max');
    assertEqual(config.base, 10, 'Should parse base');
  });
});

// ============================================================================
// LOCALE TESTS
// ============================================================================

TestRunner.suite('Locale Tests', () => {
  TestRunner.test('Locale decimal detection', () => {
    const config = NumericInput.parseConfig(createMockInput({ locale: 'en-US' }));
    const decSep = NumericInput.getDecimalSeparator(config.locale);
    assertEqual(decSep, '.', 'Should detect decimal separator for en-US');
  });

  TestRunner.test('Locale separator detection', () => {
    const config = NumericInput.parseConfig(createMockInput({ locale: 'en-US' }));
    const groupSep = NumericInput.getGroupSeparator(config.locale);
    assertEqual(groupSep, ',', 'Should detect group separator for en-US');
  });

  TestRunner.test('Indian number system uses Intl API', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      separators: 'indian',
      locale: 'en-IN'
    }));
    const formatted = NumericInput.formatValue(1234567, config);
    // Indian format should be 12,34,567
    assert(formatted.includes(','), 'Should include separators');
    // Should use Intl.NumberFormat for proper formatting
    assert(formatted === '12,34,567' || formatted.match(/\d{1,2}(,\d{2})+(,\d{3})/), 'Should follow Indian number system');
  });
});

// ============================================================================
// ARROW KEY MODIFIER TESTS
// ============================================================================

TestRunner.suite('Arrow Key Modifier Tests', () => {
  TestRunner.test('Arrow up without modifiers uses 1x key-increment', () => {
    const input = createMockInput({ 'key-increment': '10' });
    const config = NumericInput.parseConfig(input);
    input.value = '0';
    
    const event = { 
      key: 'ArrowUp', 
      preventDefault: () => {}, 
      altKey: false, 
      ctrlKey: false, 
      shiftKey: false,
      metaKey: false 
    };
    NumericInput.handleKeyDown(event, input, config);
    assert(input.value === '10', 'Should increment by 1x key-increment (10)');
  });

  TestRunner.test('Shift + Arrow up uses 2x key-increment', () => {
    const input = createMockInput({ 'key-increment': '10' });
    const config = NumericInput.parseConfig(input);
    input.value = '0';
    
    const event = { 
      key: 'ArrowUp', 
      preventDefault: () => {}, 
      altKey: false, 
      ctrlKey: false, 
      shiftKey: true,
      metaKey: false 
    };
    NumericInput.handleKeyDown(event, input, config);
    assert(input.value === '20', 'Should increment by 2x key-increment (20)');
  });

  TestRunner.test('Ctrl + Arrow up uses 5x key-increment', () => {
    const input = createMockInput({ 'key-increment': '10' });
    const config = NumericInput.parseConfig(input);
    input.value = '0';
    
    const event = { 
      key: 'ArrowUp', 
      preventDefault: () => {}, 
      altKey: false, 
      ctrlKey: true, 
      shiftKey: false,
      metaKey: false 
    };
    NumericInput.handleKeyDown(event, input, config);
    assert(input.value === '50', 'Should increment by 5x key-increment (50)');
  });

  TestRunner.test('Alt + Arrow up uses 10x key-increment', () => {
    const input = createMockInput({ 'key-increment': '10' });
    const config = NumericInput.parseConfig(input);
    input.value = '0';
    
    const event = { 
      key: 'ArrowUp', 
      preventDefault: () => {}, 
      altKey: true, 
      ctrlKey: false, 
      shiftKey: false,
      metaKey: false 
    };
    NumericInput.handleKeyDown(event, input, config);
    assert(input.value === '100', 'Should increment by 10x key-increment (100)');
  });

  TestRunner.test('Arrow down with modifiers works correctly', () => {
    const input = createMockInput({ 'key-increment': '10' });
    const config = NumericInput.parseConfig(input);
    input.value = '100';
    
    const event = { 
      key: 'ArrowDown', 
      preventDefault: () => {}, 
      altKey: false, 
      ctrlKey: true, 
      shiftKey: false,
      metaKey: false 
    };
    NumericInput.handleKeyDown(event, input, config);
    assert(input.value === '50', 'Should decrement by 5x key-increment (50)');
  });
});

// ============================================================================
// PASTE FILTERING TESTS
// ============================================================================

TestRunner.suite('Paste Filtering Tests', () => {
  TestRunner.test('Paste filters non-numeric characters', () => {
    const input = createMockInput({});
    const config = NumericInput.parseConfig(input);
    input.value = '';
    input.selectionStart = 0;
    input.selectionEnd = 0;
    
    const pasteEvent = {
      preventDefault: () => {},
      clipboardData: {
        getData: () => 'abc123def456'
      }
    };
    
    NumericInput.handlePaste(pasteEvent, input, config);
    assert(input.value.includes('123456'), 'Should filter out non-numeric characters');
    assert(!input.value.includes('abc'), 'Should not include letters');
  });

  TestRunner.test('Paste preserves decimal point', () => {
    const input = createMockInput({ decimal: '.' });
    const config = NumericInput.parseConfig(input);
    input.value = '';
    input.selectionStart = 0;
    input.selectionEnd = 0;
    
    const pasteEvent = {
      preventDefault: () => {},
      clipboardData: {
        getData: () => '12.34'
      }
    };
    
    NumericInput.handlePaste(pasteEvent, input, config);
    assert(input.value.includes('.'), 'Should preserve decimal point');
  });

  TestRunner.test('Paste preserves sign characters', () => {
    const input = createMockInput({ sign: 'any' });
    const config = NumericInput.parseConfig(input);
    input.value = '';
    input.selectionStart = 0;
    input.selectionEnd = 0;
    
    const pasteEvent = {
      preventDefault: () => {},
      clipboardData: {
        getData: () => '-123'
      }
    };
    
    NumericInput.handlePaste(pasteEvent, input, config);
    assert(input.value.includes('-'), 'Should preserve minus sign');
  });
});

// Export for use in browser and Node
if (typeof window !== 'undefined') {
  window.TestRunner = TestRunner;
  window.assert = assert;
  window.assertEqual = assertEqual;
  window.assertThrows = assertThrows;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestRunner, assert, assertEqual, assertThrows };
}
