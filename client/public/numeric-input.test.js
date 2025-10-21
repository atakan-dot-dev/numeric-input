/**
 * NumericInput.js Test Suite
 * Comprehensive tests for all library functionality
 */

// Simple test framework
// Reset TestRunner if it exists (for hot reload)
if (typeof window !== 'undefined' && window.TestRunner) {
  window.TestRunner.reset();
}

const TestRunner = window.TestRunner || {
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
});

// Export for use in browser and Node
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TestRunner, assert, assertEqual, assertThrows };
}
