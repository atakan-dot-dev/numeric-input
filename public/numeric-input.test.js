/**
 * NumericInput.js Test Suite
 * Comprehensive tests for all library functionality
 */

if (typeof window !== 'undefined' && window.TestRunner) {
  window.TestRunner.reset();
}

var TestRunner = (typeof window !== 'undefined' && window.TestRunner) || {
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

function createMockInput(attributes = {}) {
  const input = {
    type: attributes.type || 'number',
    value: '',
    selectionStart: 0,
    selectionEnd: 0,
    _attributes: { ...attributes },
    _listeners: {},
    style: {},
    
    getAttribute(name) {
      return this._attributes[name] !== undefined ? this._attributes[name] : null;
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

function createMockEvent(key, modifiers = {}) {
  return {
    key,
    preventDefault: () => {},
    altKey: modifiers.altKey || false,
    ctrlKey: modifiers.ctrlKey || false,
    shiftKey: modifiers.shiftKey || false,
    metaKey: modifiers.metaKey || false,
  };
}

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
      'increment-start': '0'
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
    assert(formatted.includes('12345') || formatted.includes('12,345'), 'Should format decimal number correctly');
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
    const originalInput = createMockInput({ 'key-increment': '5' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0';
    displayInput.setAttribute('data-old-value', '0');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(parseFloat(originalInput.value), 5, 'Should increment by key-increment amount');
  });

  TestRunner.test('Arrow key decrement', () => {
    const originalInput = createMockInput({ 'key-increment': '5' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '10';
    displayInput.setAttribute('data-old-value', '10');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowDown'), originalInput, displayInput, config);
    assertEqual(parseFloat(originalInput.value), 5, 'Should decrement by key-increment amount');
  });

  TestRunner.test('Allow sign without number', () => {
    const config = NumericInput.parseConfig(createMockInput({ sign: 'any' }));
    const parsed = NumericInput.parseValue('-', config);
    assert(parsed === '' || parsed === '-', 'Should allow standalone sign');
  });

  TestRunner.test('Sign flipping: basic with minus key', () => {
    const originalInput = createMockInput({ sign: 'any' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    originalInput.value = '5';
    displayInput.value = '5';
    displayInput.setAttribute('data-old-value', '5');
    
    NumericInput.handleKeyDown(createMockEvent('-'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '-5', 'Minus should flip to negative');
    
    displayInput.value = originalInput.value;
    NumericInput.handleKeyDown(createMockEvent('-'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '5', 'Minus should flip back to positive');
  });

  TestRunner.test('Sign flipping: blocked when min > 0', () => {
    const originalInput = createMockInput({ min: '1', sign: 'any' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    originalInput.value = '5';
    displayInput.value = '5';
    
    NumericInput.handleKeyDown(createMockEvent('-'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '5', 'Value should not change when min > 0');
  });

  TestRunner.test('Sign flipping: blocked when sign=positive', () => {
    const originalInput = createMockInput({ sign: 'positive' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    originalInput.value = '5';
    displayInput.value = '5';
    
    NumericInput.handleKeyDown(createMockEvent('-'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '5', 'Value should not change when sign=positive');
  });

  TestRunner.test('Sign flipping: blocked when min=0', () => {
    const originalInput = createMockInput({ min: '0', sign: 'any' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    originalInput.value = '5';
    displayInput.value = '5';
    
    NumericInput.handleKeyDown(createMockEvent('-'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '5', 'Value should not change when min=0');
  });

  TestRunner.test('Plus key flips negative to positive', () => {
    const originalInput = createMockInput({ sign: 'any' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    originalInput.value = '-5';
    displayInput.value = '-5';
    displayInput.setAttribute('data-old-value', '-5');
    
    NumericInput.handleKeyDown(createMockEvent('+'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '5', 'Plus should flip negative to positive');
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
    const originalError = console.error;
    console.error = () => {};
    const config = NumericInput.parseConfig(createMockInput({ base: '50' }));
    assertEqual(config.base, 10, 'Should default to base 10 for invalid base');
    console.error = originalError;
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
    assert(formatted.includes(','), 'Should include separators');
    assert(formatted === '12,34,567' || formatted.match(/\d{1,2}(,\d{2})+(,\d{3})/), 'Should follow Indian number system');
  });
});

// ============================================================================
// ARROW KEY MODIFIER TESTS
// ============================================================================

TestRunner.suite('Arrow Key Modifier Tests', () => {
  TestRunner.test('Arrow up without modifiers uses 1x key-increment', () => {
    const originalInput = createMockInput({ 'key-increment': '10' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0';
    displayInput.setAttribute('data-old-value', '0');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '10', 'Should increment by 1x key-increment (10)');
  });

  TestRunner.test('Shift + Arrow up uses 2x key-increment', () => {
    const originalInput = createMockInput({ 'key-increment': '10' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0';
    displayInput.setAttribute('data-old-value', '0');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp', { shiftKey: true }), originalInput, displayInput, config);
    assertEqual(originalInput.value, '20', 'Should increment by 2x key-increment (20)');
  });

  TestRunner.test('Ctrl + Arrow up uses 5x key-increment', () => {
    const originalInput = createMockInput({ 'key-increment': '10' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0';
    displayInput.setAttribute('data-old-value', '0');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp', { ctrlKey: true }), originalInput, displayInput, config);
    assertEqual(originalInput.value, '50', 'Should increment by 5x key-increment (50)');
  });

  TestRunner.test('Alt + Arrow up uses 10x key-increment', () => {
    const originalInput = createMockInput({ 'key-increment': '10' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0';
    displayInput.setAttribute('data-old-value', '0');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp', { altKey: true }), originalInput, displayInput, config);
    assertEqual(originalInput.value, '100', 'Should increment by 10x key-increment (100)');
  });

  TestRunner.test('Arrow down with modifiers works correctly', () => {
    const originalInput = createMockInput({ 'key-increment': '10' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '100';
    displayInput.setAttribute('data-old-value', '100');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowDown', { ctrlKey: true }), originalInput, displayInput, config);
    assertEqual(originalInput.value, '50', 'Should decrement by 5x key-increment (50)');
  });
});

// ============================================================================
// PASTE FILTERING TESTS
// ============================================================================

TestRunner.suite('Paste Filtering Tests', () => {
  TestRunner.test('Paste filters non-numeric characters', () => {
    const originalInput = createMockInput({});
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '';
    displayInput.selectionStart = 0;
    displayInput.selectionEnd = 0;
    
    const pasteEvent = {
      preventDefault: () => {},
      clipboardData: {
        getData: () => 'abc123def456'
      }
    };
    
    NumericInput.handlePaste(pasteEvent, originalInput, displayInput, config);
    assert(displayInput.value.includes('123456'), 'Should filter out non-numeric characters');
    assert(!displayInput.value.includes('abc'), 'Should not include letters');
  });

  TestRunner.test('Paste preserves decimal point', () => {
    const originalInput = createMockInput({ decimal: '.' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '';
    displayInput.selectionStart = 0;
    displayInput.selectionEnd = 0;
    
    const pasteEvent = {
      preventDefault: () => {},
      clipboardData: {
        getData: () => '12.34'
      }
    };
    
    NumericInput.handlePaste(pasteEvent, originalInput, displayInput, config);
    assert(displayInput.value.includes('.'), 'Should preserve decimal point');
  });

  TestRunner.test('Paste preserves sign characters', () => {
    const originalInput = createMockInput({ sign: 'any' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '';
    displayInput.selectionStart = 0;
    displayInput.selectionEnd = 0;
    
    const pasteEvent = {
      preventDefault: () => {},
      clipboardData: {
        getData: () => '-123'
      }
    };
    
    NumericInput.handlePaste(pasteEvent, originalInput, displayInput, config);
    assert(displayInput.value.includes('-'), 'Should preserve minus sign');
  });
});

// ============================================================================
// FLOATING POINT PRECISION TESTS
// ============================================================================

TestRunner.suite('Floating Point Precision Tests', () => {
  TestRunner.test('0.01 increments do not accumulate drift', () => {
    const originalInput = createMockInput({ 'key-increment': '0.01', 'valid-increment': '0.01' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '4.01';
    displayInput.setAttribute('data-old-value', '4.01');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '4.02', 'Should be exactly 4.02 not 4.019999...');
    
    displayInput.value = originalInput.value;
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '4.03', 'Should be exactly 4.03');
  });

  TestRunner.test('Valid increment check handles floating point', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'valid-increment': '0.01',
      'increment-start': '0'
    }));
    assert(NumericInput.isValidValue(0.01, config), '0.01 should be valid');
    assert(NumericInput.isValidValue(0.02, config), '0.02 should be valid');
    assert(NumericInput.isValidValue(0.03, config), '0.03 should be valid');
    assert(NumericInput.isValidValue(1.99, config), '1.99 should be valid');
  });

  TestRunner.test('Price increments past 0.02', () => {
    const originalInput = createMockInput({ 
      prefix: '$', 'valid-increment': '0.01', 'key-increment': '0.01', min: '0' 
    });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    
    displayInput.value = '$0.02';
    displayInput.setAttribute('data-old-value', '$0.02');
    originalInput.value = '0.02';
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '0.03', 'Should increment to 0.03');
    
    displayInput.value = NumericInput.formatValue(0.03, config);
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '0.04', 'Should increment to 0.04');
  });
});

// ============================================================================
// INCREMENT START TESTS
// ============================================================================

TestRunner.suite('Increment Start Tests', () => {
  TestRunner.test('increment-start defaults to max(0, min)', () => {
    const config1 = NumericInput.parseConfig(createMockInput({ min: '5' }));
    assertEqual(config1.incrementStart, 5, 'Should default to min when min > 0');
    
    const config2 = NumericInput.parseConfig(createMockInput({ min: '-10' }));
    assertEqual(config2.incrementStart, 0, 'Should default to 0 when min < 0');
    
    const config3 = NumericInput.parseConfig(createMockInput({}));
    assertEqual(config3.incrementStart, 0, 'Should default to 0 when no min');
  });

  TestRunner.test('increment-start can be explicitly set', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'increment-start': '3',
      'valid-increment': '5'
    }));
    assertEqual(config.incrementStart, 3, 'Should use explicit increment-start');
    assert(NumericInput.isValidValue(3, config), '3 should be valid (start)');
    assert(NumericInput.isValidValue(8, config), '8 should be valid (3+5)');
    assert(NumericInput.isValidValue(13, config), '13 should be valid (3+10)');
    assert(!NumericInput.isValidValue(5, config), '5 should be invalid');
  });

  TestRunner.test('Increment validation uses incrementStart not min', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'valid-increment': '5',
      'increment-start': '0',
      min: '-100'
    }));
    assert(NumericInput.isValidValue(0, config), '0 should be valid');
    assert(NumericInput.isValidValue(5, config), '5 should be valid');
    assert(NumericInput.isValidValue(-5, config), '-5 should be valid');
    assert(!NumericInput.isValidValue(3, config), '3 should be invalid');
  });
});

// ============================================================================
// NON-BASE-10 INCREMENT TESTS
// ============================================================================

TestRunner.suite('Non-Base-10 Increment Tests', () => {
  TestRunner.test('Hex increment with arrow keys', () => {
    const originalInput = createMockInput({ base: '16', prefix: '0x', 'letter-case': 'upper' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0xFF';
    displayInput.setAttribute('data-old-value', '0xFF');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    const newVal = parseInt(originalInput.value);
    assertEqual(newVal, 256, 'Should increment hex value by 1 (FF -> 100)');
  });

  TestRunner.test('Binary increment with arrow keys', () => {
    const originalInput = createMockInput({ base: '2', prefix: '0b' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0b101';
    displayInput.setAttribute('data-old-value', '0b101');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    const newVal = parseInt(originalInput.value);
    assertEqual(newVal, 6, 'Should increment binary value by 1 (101 -> 110)');
  });

  TestRunner.test('Octal increment with arrow keys', () => {
    const originalInput = createMockInput({ base: '8', prefix: '0o' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '0o7';
    displayInput.setAttribute('data-old-value', '0o7');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    const newVal = parseInt(originalInput.value);
    assertEqual(newVal, 8, 'Should increment octal value by 1 (7 -> 10)');
  });

  TestRunner.test('keyIncrement defaults to 1 when not specified', () => {
    const config = NumericInput.parseConfig(createMockInput({ base: '16' }));
    assertEqual(config.keyIncrement, 1, 'Should default keyIncrement to 1');
  });
});

// ============================================================================
// POSTFIX DISPLAY TESTS
// ============================================================================

TestRunner.suite('Postfix Display Tests', () => {
  TestRunner.test('Postfix applied after arrow key increment', () => {
    const originalInput = createMockInput({ postfix: '%' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '50%';
    displayInput.setAttribute('data-old-value', '50%');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assert(displayInput.value.endsWith('%'), 'Display should show postfix after increment');
    assertEqual(originalInput.value, '51', 'Original should store numeric value');
  });

  TestRunner.test('Prefix applied after arrow key increment', () => {
    const originalInput = createMockInput({ prefix: '$' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '$10';
    displayInput.setAttribute('data-old-value', '$10');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assert(displayInput.value.startsWith('$'), 'Display should show prefix after increment');
    assertEqual(originalInput.value, '11', 'Original should store numeric value');
  });

  TestRunner.test('formatValue always includes postfix', () => {
    const config = NumericInput.parseConfig(createMockInput({ postfix: '°C', 'show-plus': '' }));
    const formatted = NumericInput.formatValue(25, config);
    assert(formatted.endsWith('°C'), 'Should end with postfix');
    assert(formatted.startsWith('+'), 'Should start with plus sign');
    assertEqual(formatted, '+25°C', 'Full formatted value should be correct');
  });
});

// ============================================================================
// RANGE CONSTRAINT TESTS
// ============================================================================

TestRunner.suite('Range Constraint Tests', () => {
  TestRunner.test('Range 0-100 blocks negative sign flip', () => {
    const originalInput = createMockInput({ min: '0', max: '100' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    originalInput.value = '50';
    displayInput.value = '50';
    
    NumericInput.handleKeyDown(createMockEvent('-'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '50', 'Should not flip to negative when min=0');
  });

  TestRunner.test('Negative-only mode formats with minus sign', () => {
    const config = NumericInput.parseConfig(createMockInput({ sign: 'negative' }));
    const formatted = NumericInput.formatValue(-5, config);
    assert(formatted.startsWith('-'), 'Should show minus sign');
    assert(formatted.includes('5'), 'Should show the value');
  });
});

// ============================================================================
// EUROPEAN FORMAT TESTS
// ============================================================================

TestRunner.suite('European Format Tests', () => {
  TestRunner.test('European format increments with arrow keys', () => {
    const originalInput = createMockInput({ decimal: ',', separators: '.', locale: 'de-DE' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '5';
    displayInput.setAttribute('data-old-value', '5');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '6', 'Should increment European format by 1');
  });

  TestRunner.test('European format parses comma decimal', () => {
    const config = NumericInput.parseConfig(createMockInput({ decimal: ',', separators: '.', locale: 'de-DE' }));
    const parsed = NumericInput.parseValue('1,5', config);
    assertEqual(parsed, 1.5, 'Should parse comma as decimal separator');
  });

  TestRunner.test('European format formats with comma decimal', () => {
    const config = NumericInput.parseConfig(createMockInput({ decimal: ',', separators: '.', locale: 'de-DE' }));
    const formatted = NumericInput.formatValue(1.5, config);
    assert(formatted.includes(','), 'Should use comma as decimal separator');
    assert(!formatted.includes('.'), 'Should not use dot as decimal separator');
  });
});

// ============================================================================
// PRECISION PRESERVATION TESTS
// ============================================================================

TestRunner.suite('Precision Preservation Tests', () => {
  TestRunner.test('Arrow increment preserves typed decimal places', () => {
    const originalInput = createMockInput({ 'key-increment': '1' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '1.5';
    displayInput.setAttribute('data-old-value', '1.5');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '2.5', 'Should preserve decimal: 1.5 + 1 = 2.5, not 3');
  });

  TestRunner.test('Arrow increment still fixes FP drift for decimal increments', () => {
    const originalInput = createMockInput({ 'key-increment': '0.01', 'valid-increment': '0.01' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '4.01';
    displayInput.setAttribute('data-old-value', '4.01');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowUp'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '4.02', 'Should still fix FP drift: 4.01 + 0.01 = 4.02');
  });

  TestRunner.test('Arrow decrement preserves typed decimal places', () => {
    const originalInput = createMockInput({ 'key-increment': '1' });
    const displayInput = createMockInput({});
    const config = NumericInput.parseConfig(originalInput);
    displayInput.value = '5.7';
    displayInput.setAttribute('data-old-value', '5.7');
    
    NumericInput.handleKeyDown(createMockEvent('ArrowDown'), originalInput, displayInput, config);
    assertEqual(originalInput.value, '4.7', 'Should preserve decimal: 5.7 - 1 = 4.7, not 5');
  });
});

// ============================================================================
// VALIDATION TIMEOUT TESTS
// ============================================================================

TestRunner.suite('Validation Timeout Tests', () => {
  TestRunner.test('snapToIncrement rounds to nearest valid value', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'valid-increment': '5',
      'increment-start': '0'
    }));
    assertEqual(NumericInput.snapToIncrement(12, config), 10, '12 should snap to 10');
    assertEqual(NumericInput.snapToIncrement(13, config), 15, '13 should snap to 15');
    assertEqual(NumericInput.snapToIncrement(0, config), 0, '0 should snap to 0');
    assertEqual(NumericInput.snapToIncrement(7.5, config), 10, '7.5 should snap to 10');
  });

  TestRunner.test('isValidRange checks sign/min/max but not increment', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'valid-increment': '5',
      'increment-start': '0',
      min: '0',
      max: '100'
    }));
    assert(NumericInput.isValidRange(12, config), '12 should pass range check even though not multiple of 5');
    assert(NumericInput.isValidRange(0, config), '0 should pass range check');
    assert(NumericInput.isValidRange(100, config), '100 should pass range check');
    assert(!NumericInput.isValidRange(-1, config), '-1 should fail range check (below min)');
    assert(!NumericInput.isValidRange(101, config), '101 should fail range check (above max)');
  });

  TestRunner.test('isValidIncrement checks only increment constraint', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'valid-increment': '5',
      'increment-start': '0'
    }));
    assert(NumericInput.isValidIncrement(10, config), '10 should be valid increment');
    assert(NumericInput.isValidIncrement(15, config), '15 should be valid increment');
    assert(!NumericInput.isValidIncrement(12, config), '12 should not be valid increment');
    assert(NumericInput.isValidIncrement(0, config), '0 should be valid increment');
  });

  TestRunner.test('validationTimeout defaults to 500', () => {
    const config = NumericInput.parseConfig(createMockInput({}));
    assertEqual(config.validationTimeout, 500, 'Should default validationTimeout to 500ms');
  });

  TestRunner.test('validationTimeout can be configured', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'validation-timeout': '1000' }));
    assertEqual(config.validationTimeout, 1000, 'Should use configured validationTimeout');
  });

  TestRunner.test('snapToIncrement respects min/max bounds', () => {
    const config = NumericInput.parseConfig(createMockInput({ 
      'valid-increment': '10',
      'increment-start': '0',
      min: '5',
      max: '95'
    }));
    const snapped = NumericInput.snapToIncrement(2, config);
    assert(snapped >= 5, 'Snapped value should not be below min');
  });
});

// ============================================================================
// VALUE ALGEBRA TESTS
// ============================================================================

TestRunner.suite('Value Algebra Tests', () => {
  TestRunner.test('Basic multiplication: x*0.01', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'x*0.01' }));
    assert(config.valueAlgebra !== null, 'Should parse x*0.01');
    const result = NumericInput.applyAlgebra(50, config);
    assertEqual(result, 0.5, 'x*0.01 with display 50 should store 0.5');
  });

  TestRunner.test('Basic subtraction: x-1', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'x-1' }));
    assert(config.valueAlgebra !== null, 'Should parse x-1');
    const result = NumericInput.applyAlgebra(5, config);
    assertEqual(result, 4, 'x-1 with display 5 should store 4');
  });

  TestRunner.test('Complex expression with function: ceil(x/100)', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'ceil(x/100)' }));
    assert(config.valueAlgebra !== null, 'Should parse ceil(x/100)');
    const result = NumericInput.applyAlgebra(250, config);
    assertEqual(result, 3, 'ceil(250/100) should store 3');
  });

  TestRunner.test('Nested parentheses: (x+1)*(x-1)', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': '(x+1)*(x-1)' }));
    assert(config.valueAlgebra !== null, 'Should parse (x+1)*(x-1)');
    const result = NumericInput.applyAlgebra(5, config);
    assertEqual(result, 24, '(5+1)*(5-1) = 6*4 = 24');
  });

  TestRunner.test('Parenthesized grouping order: (x+10)/2', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': '(x+10)/2' }));
    assert(config.valueAlgebra !== null, 'Should parse (x+10)/2');
    const result = NumericInput.applyAlgebra(20, config);
    assertEqual(result, 15, '(20+10)/2 = 15');
  });

  TestRunner.test('Floor function: floor(x/3)', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'floor(x/3)' }));
    assert(config.valueAlgebra !== null, 'Should parse floor(x/3)');
    const result = NumericInput.applyAlgebra(10, config);
    assertEqual(result, 3, 'floor(10/3) = 3');
  });

  TestRunner.test('Round function: round(x*0.1)', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'round(x*0.1)' }));
    assert(config.valueAlgebra !== null, 'Should parse round(x*0.1)');
    const result = NumericInput.applyAlgebra(15, config);
    assertEqual(result, 2, 'round(15*0.1) = round(1.5) = 2');
  });

  TestRunner.test('Max operations boundary: exactly 5 operations accepted', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'ceil(5*(x+1)/100)-0.1' }));
    assert(config.valueAlgebra !== null, 'Expression with exactly 5 operations (ceil, *, +, /, -) should be accepted');
  });

  TestRunner.test('Operation count exceeded: 6 operations rejected', () => {
    const originalError = console.error;
    const errors = [];
    console.error = (msg) => errors.push(msg);
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'ceil(5*(x+1)/100)-0.1+2' }));
    assertEqual(config.valueAlgebra, null, 'Expression with 6 operations should be rejected');
    console.error = originalError;
  });

  TestRunner.test('Expression length limit: 101 chars rejected', () => {
    const originalError = console.error;
    const errors = [];
    console.error = (msg) => errors.push(msg);
    const longExpr = 'x' + '+1'.repeat(50);
    assert(longExpr.length > 100, 'Test expression should exceed 100 chars');
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': longExpr }));
    assertEqual(config.valueAlgebra, null, 'Expression exceeding 100 chars should be rejected');
    console.error = originalError;
  });

  TestRunner.test('Invalid expression syntax ignored without crash', () => {
    const originalError = console.error;
    console.error = () => {};
    const config1 = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'x**2' }));
    assertEqual(config1.valueAlgebra, null, 'x**2 should be rejected');
    const config2 = NumericInput.parseConfig(createMockInput({ 'value-algebra': 'x;alert(1)' }));
    assertEqual(config2.valueAlgebra, null, 'x;alert(1) should be rejected');
    console.error = originalError;
  });

  TestRunner.test('Code injection attempt rejected', () => {
    const originalError = console.error;
    console.error = () => {};
    const config = NumericInput.parseConfig(createMockInput({ 'value-algebra': "constructor.constructor('alert(1)')" }));
    assertEqual(config.valueAlgebra, null, 'Code injection should be rejected');
    console.error = originalError;
  });

  TestRunner.test('No algebra: config without value-algebra has no impact', () => {
    const config = NumericInput.parseConfig(createMockInput({}));
    assertEqual(config.valueAlgebra, null, 'Should have no valueAlgebra');
    const result = NumericInput.applyAlgebra(42, config);
    assertEqual(result, 42, 'Without algebra, value should pass through unchanged');
  });
});

// ============================================================================
// PERCENTAGE TESTS
// ============================================================================

TestRunner.suite('Percentage Tests', () => {
  TestRunner.test('percentage attribute sets postfix and valueAlgebra', () => {
    const config = NumericInput.parseConfig(createMockInput({ percentage: '' }));
    assertEqual(config.postfix, '%', 'Should set postfix to %');
    assert(config.valueAlgebra !== null, 'Should set valueAlgebra');
    const result = NumericInput.applyAlgebra(50, config);
    assertEqual(result, 0.5, 'Should apply x*0.01 algebra');
  });

  TestRunner.test('percentage-prefix sets prefix and valueAlgebra', () => {
    const config = NumericInput.parseConfig(createMockInput({ 'percentage-prefix': '' }));
    assertEqual(config.prefix, '%', 'Should set prefix to %');
    assert(config.valueAlgebra !== null, 'Should set valueAlgebra');
    const result = NumericInput.applyAlgebra(50, config);
    assertEqual(result, 0.5, 'Should apply x*0.01 algebra');
  });

  TestRunner.test('Explicit postfix overrides percentage default', () => {
    const config = NumericInput.parseConfig(createMockInput({ percentage: '', postfix: ' pct' }));
    assertEqual(config.postfix, ' pct', 'Explicit postfix should override percentage default');
    assert(config.valueAlgebra !== null, 'Should still set valueAlgebra');
    const result = NumericInput.applyAlgebra(50, config);
    assertEqual(result, 0.5, 'Should still apply x*0.01 algebra');
  });
});

TestRunner.suite('Arrow Button Tests', () => {
  TestRunner.test('arrows defaults to always', () => {
    const config = NumericInput.parseConfig(createMockInput({}));
    assertEqual(config.arrows, 'always', 'Default arrows should be always');
  });

  TestRunner.test('arrows=never hides arrows', () => {
    const config = NumericInput.parseConfig(createMockInput({ arrows: 'never' }));
    assertEqual(config.arrows, 'never', 'Should parse arrows=never');
  });

  TestRunner.test('arrows=focus shows arrows on focus only', () => {
    const config = NumericInput.parseConfig(createMockInput({ arrows: 'focus' }));
    assertEqual(config.arrows, 'focus', 'Should parse arrows=focus');
  });

  TestRunner.test('invalid arrows value defaults to always', () => {
    const config = NumericInput.parseConfig(createMockInput({ arrows: 'invalid' }));
    assertEqual(config.arrows, 'always', 'Invalid value should default to always');
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
