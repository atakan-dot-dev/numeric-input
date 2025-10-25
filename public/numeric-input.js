/**
 * NumericInput.js - Advanced Numeric Input Library
 * Version 1.0.0
 * A framework-agnostic library for enhanced numeric input handling
 */
(function(global) {
  'use strict';

  const NumericInput = {
    version: '1.0.0',
    _attached: new WeakMap(),

    /**
     * Parse configuration from element attributes
     */
    parseConfig(element) {
      const config = {
        validIncrement: parseFloat(element.getAttribute('valid-increment')) || 0,
        keyIncrement: parseFloat(element.getAttribute('key-increment')),
        integer: element.hasAttribute('integer'),
        sign: element.getAttribute('sign') || 'any',
        showPlus: element.hasAttribute('show-plus'),
        min: element.getAttribute('min') ? parseFloat(element.getAttribute('min')) : undefined,
        max: element.getAttribute('max') ? parseFloat(element.getAttribute('max')) : undefined,
        base: parseInt(element.getAttribute('base')) || 10,
        radix: parseInt(element.getAttribute('radix')),
        letterCase: element.getAttribute('letter-case') || 'upper',
        separators: element.getAttribute('separators') || 'locale',
        decimal: element.getAttribute('decimal') || 'locale',
        prefix: element.getAttribute('prefix') || '',
        postfix: element.getAttribute('postfix') || '',
        locale: element.getAttribute('locale') || navigator.language,
      };

      // Handle radix override
      if (config.radix && config.base !== 10) {
        console.warn('Both base and radix attributes provided. Using radix.');
      }
      if (config.radix) {
        config.base = config.radix;
      }

      // Validate base
      if (config.base < 2 || config.base > 36) {
        console.error(`Invalid base: ${config.base}. Must be between 2 and 36. Defaulting to 10.`);
        config.base = 10;
      }

      // Handle integer attribute
      if (config.integer && config.validIncrement === 0) {
        config.validIncrement = 1;
      } else if (config.integer && config.validIncrement < 1) {
        config.validIncrement = Math.ceil(config.validIncrement);
      }

      // Validate key-increment
      if (config.keyIncrement !== undefined && config.validIncrement !== 0) {
        if (config.keyIncrement % config.validIncrement !== 0) {
          console.warn(`key-increment (${config.keyIncrement}) must be a multiple of valid-increment (${config.validIncrement})`);
        }
      }

      // Default key-increment
      if (config.keyIncrement === undefined) {
        config.keyIncrement = config.validIncrement || 1;
      }

      return config;
    },

    /**
     * Get locale-specific decimal separator
     */
    getDecimalSeparator(locale) {
      const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
      const decimalPart = parts.find(part => part.type === 'decimal');
      return decimalPart ? decimalPart.value : '.';
    },

    /**
     * Get locale-specific group separator
     */
    getGroupSeparator(locale) {
      const parts = new Intl.NumberFormat(locale).formatToParts(1111);
      const groupPart = parts.find(part => part.type === 'group');
      return groupPart ? groupPart.value : ',';
    },

    /**
     * Format number with separators using Intl API
     */
    applySeparators(numStr, config) {
      if (config.separators === 'none' || config.separators === '') {
        return numStr;
      }

      const [intPart, decPart] = numStr.split('.');
      const number = parseFloat(intPart);
      
      if (isNaN(number)) {
        return numStr;
      }

      let formatted;
      if (config.separators === 'indian') {
        // Use Indian locale (en-IN) for proper Indian numbering system
        const formatter = new Intl.NumberFormat('en-IN', {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        formatted = formatter.format(number);
      } else if (config.separators === 'locale') {
        // Use the specified locale
        const formatter = new Intl.NumberFormat(config.locale, {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        formatted = formatter.format(number);
      } else {
        // Custom separator - fall back to manual grouping
        const separator = config.separators;
        const reversed = intPart.split('').reverse().join('');
        const groups = [];
        for (let i = 0; i < reversed.length; i += 3) {
          groups.push(reversed.slice(i, i + 3));
        }
        formatted = groups.join(separator).split('').reverse().join('');
      }

      return decPart !== undefined ? formatted + '.' + decPart : formatted;
    },

    /**
     * Format value for display
     */
    formatValue(value, config) {
      if (value === '' || value === null || value === undefined) {
        return '';
      }

      let numValue = typeof value === 'string' ? parseFloat(value) : value;
      
      if (isNaN(numValue)) {
        return '';
      }

      // Handle sign
      const isNegative = numValue < 0;
      const absValue = Math.abs(numValue);

      // Convert to specified base
      let formatted;
      if (config.base === 10) {
        formatted = absValue.toString();
      } else {
        // For non-decimal bases, convert integer part
        const intPart = Math.floor(absValue);
        const decPart = absValue - intPart;
        
        formatted = intPart.toString(config.base);
        
        if (config.letterCase === 'upper') {
          formatted = formatted.toUpperCase();
        } else {
          formatted = formatted.toLowerCase();
        }

        // Note: Decimal handling for non-base-10 is complex and often not needed
        // We'll keep it simple and only show integer part for bases != 10
      }

      // Apply separators (only for base 10)
      if (config.base === 10 && Math.abs(numValue) >= 1000) {
        formatted = this.applySeparators(formatted, config);
      }

      // Apply decimal separator
      if (config.decimal !== 'locale' && formatted.includes('.')) {
        formatted = formatted.replace('.', config.decimal);
      } else if (config.decimal === 'locale' && formatted.includes('.')) {
        const decSep = this.getDecimalSeparator(config.locale);
        formatted = formatted.replace('.', decSep);
      }

      // Build final string with sign, prefix, and postfix
      let sign = '';
      if (isNegative) {
        sign = '-';
      } else if (config.showPlus) {
        sign = '+';
      } else if (config.sign === 'negative' && !isNegative) {
        sign = '';
      }

      if (config.sign === 'negative' && !isNegative && numValue === 0) {
        sign = '-';
      }

      return sign + config.prefix + formatted + config.postfix;
    },

    /**
     * Parse value from formatted string
     */
    parseValue(str, config) {
      if (!str) return '';

      // Remove prefix and postfix
      let cleaned = str;
      if (config.prefix && cleaned.startsWith(config.prefix)) {
        cleaned = cleaned.slice(config.prefix.length);
      }
      if (config.prefix && cleaned.startsWith('-' + config.prefix)) {
        cleaned = '-' + cleaned.slice(config.prefix.length + 1);
      }
      if (config.prefix && cleaned.startsWith('+' + config.prefix)) {
        cleaned = '+' + cleaned.slice(config.prefix.length + 1);
      }
      if (config.postfix && cleaned.endsWith(config.postfix)) {
        cleaned = cleaned.slice(0, -config.postfix.length);
      }

      // Extract sign
      const isNegative = cleaned.startsWith('-');
      if (isNegative || cleaned.startsWith('+')) {
        cleaned = cleaned.slice(1);
      }

      // Remove separators
      const separator = config.separators === 'locale' 
        ? this.getGroupSeparator(config.locale)
        : (config.separators === 'indian' ? ',' : config.separators);
      
      if (separator && separator !== '.') {
        cleaned = cleaned.split(separator).join('');
      }

      // Handle decimal
      const decSep = config.decimal === 'locale'
        ? this.getDecimalSeparator(config.locale)
        : config.decimal;
      
      if (decSep !== '.') {
        cleaned = cleaned.replace(decSep, '.');
      }

      // Parse based on base
      let value;
      if (config.base === 10) {
        value = parseFloat(cleaned);
      } else {
        value = parseInt(cleaned, config.base);
      }

      if (isNaN(value)) {
        return '';
      }

      return isNegative ? -value : value;
    },

    /**
     * Validate if value is valid according to config
     */
    isValidValue(value, config) {
      if (value === '' || value === null || value === undefined) {
        return true;
      }

      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      if (isNaN(numValue)) {
        return false;
      }

      // Check sign
      if (config.sign === 'positive' && numValue < 0) {
        return false;
      }
      if (config.sign === 'negative' && numValue > 0) {
        return false;
      }

      // Check min/max
      if (config.min !== undefined && numValue < config.min) {
        return false;
      }
      if (config.max !== undefined && numValue > config.max) {
        return false;
      }

      // Check valid increment
      if (config.validIncrement !== 0 && config.min !== undefined) {
        const offset = numValue - config.min;
        if (offset % config.validIncrement !== 0) {
          return false;
        }
      }

      return true;
    },

    /**
     * Handle keydown event
     */
    handleKeyDown(event, element, config) {
      const key = event.key;
      const currentValue = this.parseValue(element.value, config);

      // Handle arrow keys with modifiers
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();
        const direction = key === 'ArrowUp' ? 1 : -1;
        
        // Determine multiplier based on modifiers
        let multiplier = 1;
        if (event.altKey) {
          multiplier = 10;
        } else if (event.ctrlKey || event.metaKey) {
          multiplier = 5;
        } else if (event.shiftKey) {
          multiplier = 2;
        }
        
        const increment = config.keyIncrement * multiplier;
        const newValue = (currentValue || 0) + (direction * increment);

        if (this.isValidValue(newValue, config)) {
          const formatted = this.formatValue(newValue, config);
          element.value = formatted;
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return;
      }

      // Handle sign flipping - always toggle sign, don't allow typing multiple signs
      if ((key === '-' || key === '−' || key === '–' || key === '—')) {
        // Block if sign not allowed
        if (config.sign === 'positive' || (config.min !== undefined && config.min > 0)) {
          event.preventDefault();
          return;
        }
        
        // Toggle sign for 'any' sign mode
        if (config.sign === 'any') {
          event.preventDefault();
          if (currentValue !== '' && currentValue !== 0) {
            const newValue = -currentValue;
            const formatted = this.formatValue(newValue, config);
            element.value = formatted;
            element.dispatchEvent(new Event('input', { bubbles: true }));
          }
          // If no value yet, do nothing (prevents multiple signs)
          return;
        }
      }

      if (key === '+') {
        // Block if positive sign not allowed
        if (config.sign === 'negative' || (config.max !== undefined && config.max < 0)) {
          event.preventDefault();
          return;
        }
        
        // Toggle to positive for 'any' sign mode
        if (config.sign === 'any') {
          event.preventDefault();
          if (currentValue !== '' && currentValue < 0) {
            const newValue = Math.abs(currentValue);
            const formatted = this.formatValue(newValue, config);
            element.value = formatted;
            element.dispatchEvent(new Event('input', { bubbles: true }));
          }
          // If no value yet or already positive, do nothing (prevents multiple signs)
          return;
        }
      }
    },

    /**
     * Handle paste event
     */
    handlePaste(event, element, config) {
      event.preventDefault();
      
      // Get pasted text
      const pastedText = event.clipboardData.getData('text');
      
      // Filter to keep only valid numeric characters
      let filtered = '';
      const validChars = config.base === 10 ? '0123456789' : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const decimalSep = config.decimal === 'locale' ? this.getDecimalSeparator(config.locale) : config.decimal;
      
      for (let char of pastedText) {
        if (validChars.includes(char) || char === decimalSep || char === '.' || char === '-' || char === '+') {
          filtered += char;
        }
      }
      
      // Insert filtered text at cursor position
      const cursorPos = element.selectionStart;
      const before = element.value.substring(0, cursorPos);
      const after = element.value.substring(element.selectionEnd);
      element.value = before + filtered + after;
      
      // Trigger input event to validate and format
      element.dispatchEvent(new Event('input', { bubbles: true }));
      
      // Set cursor position after pasted text
      const newPos = cursorPos + filtered.length;
      element.setSelectionRange(newPos, newPos);
    },

    /**
     * Handle input event
     */
    handleInput(event, element, config) {
      const value = element.value;
      
      // Store cursor position
      const cursorPos = element.selectionStart;
      const oldValue = element.getAttribute('data-old-value') || '';
      
      // Parse and validate
      const parsed = this.parseValue(value, config);
      
      // Allow empty values
      if (value === '' || value === config.prefix + config.postfix) {
        element.setAttribute('data-old-value', '');
        element.setAttribute('data-numeric-value', '');
        return;
      }
      
      // Store the numeric value for external reading (always set if we can parse)
      if (parsed !== '' && !isNaN(parsed)) {
        element.setAttribute('data-numeric-value', String(parsed));
      } else {
        element.setAttribute('data-numeric-value', '');
      }
      
      // For inputs without formatting (no prefix/postfix/separators), be lenient
      const hasFormatting = config.prefix || config.postfix || 
                           (config.separators && config.separators !== 'none') ||
                           config.base !== 10;
      
      if (!hasFormatting) {
        // Simple mode: just validate and store
        if (parsed !== '' && !isNaN(parsed) && this.isValidValue(parsed, config)) {
          element.setAttribute('data-old-value', value);
        } else if (parsed !== '' && !isNaN(parsed)) {
          // Valid number but violates constraints - revert
          element.value = oldValue;
          const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
          element.setSelectionRange(newPos, newPos);
        } else if (value !== oldValue) {
          // Can't parse - revert
          element.value = oldValue;
          const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
          element.setSelectionRange(newPos, newPos);
        }
        return;
      }
      
      // For formatted inputs, only reformat when complete
      if (parsed !== '' && !isNaN(parsed)) {
        // Check if this is a complete value
        const isComplete = value.trim().length > 0 && 
                          (value.endsWith(config.postfix) || config.postfix === '');
        
        if (isComplete && this.isValidValue(parsed, config)) {
          // Value is valid and complete, reformat
          const formatted = this.formatValue(parsed, config);
          if (formatted !== value) {
            element.value = formatted;
            // Restore cursor, accounting for formatting changes
            const lengthDiff = formatted.length - value.length;
            const newPos = Math.max(0, Math.min(formatted.length, cursorPos + lengthDiff));
            element.setSelectionRange(newPos, newPos);
          }
          element.setAttribute('data-old-value', formatted);
        } else if (!this.isValidValue(parsed, config)) {
          // Value is invalid, revert to old value
          element.value = oldValue;
          const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
          element.setSelectionRange(newPos, newPos);
        } else {
          // Value is valid but incomplete, keep as-is and store
          element.setAttribute('data-old-value', value);
        }
      } else {
        // Can't parse - might be intermediate input, revert to old
        element.value = oldValue;
        const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
        element.setSelectionRange(newPos, newPos);
      }
    },

    /**
     * Attach library to element(s)
     */
    attach(elements) {
      const targets = elements instanceof NodeList || Array.isArray(elements)
        ? Array.from(elements)
        : [elements];

      targets.forEach(element => {
        if (element.type !== 'number' && element.type !== 'text') {
          console.warn('NumericInput can only be attached to input elements with type="number" or type="text"');
          return;
        }

        // Parse configuration
        const config = this.parseConfig(element);

        // Create event handlers
        const keydownHandler = (e) => this.handleKeyDown(e, element, config);
        const inputHandler = (e) => this.handleInput(e, element, config);
        const pasteHandler = (e) => this.handlePaste(e, element, config);

        // Store handlers for later removal
        this._attached.set(element, {
          config,
          keydownHandler,
          inputHandler,
          pasteHandler,
        });

        // Attach event listeners
        element.addEventListener('keydown', keydownHandler);
        element.addEventListener('input', inputHandler);
        element.addEventListener('paste', pasteHandler);

        // Initialize with current value
        if (element.value) {
          const parsed = this.parseValue(element.value, config);
          if (parsed !== '' && !isNaN(parsed)) {
            element.value = this.formatValue(parsed, config);
            element.setAttribute('data-numeric-value', String(parsed));
          }
        }

        // Initialize data-old-value and data-numeric-value
        element.setAttribute('data-old-value', element.value);
        if (!element.hasAttribute('data-numeric-value')) {
          element.setAttribute('data-numeric-value', '');
        }
      });
    },

    /**
     * Detach library from element(s)
     */
    detach(elements) {
      const targets = elements instanceof NodeList || Array.isArray(elements)
        ? Array.from(elements)
        : [elements];

      targets.forEach(element => {
        const data = this._attached.get(element);
        if (!data) return;

        // Remove event listeners
        element.removeEventListener('keydown', data.keydownHandler);
        element.removeEventListener('input', data.inputHandler);
        element.removeEventListener('paste', data.pasteHandler);

        // Clean up
        element.removeAttribute('data-old-value');
        this._attached.delete(element);
      });
    },

    /**
     * Handle arrow key (for external use)
     */
    handleArrowKey(direction, currentValue, config) {
      const newValue = (currentValue || 0) + (direction * config.keyIncrement);
      return this.isValidValue(newValue, config) ? newValue : currentValue;
    },

    /**
     * Validate keystroke (for external use)
     */
    validateKeystroke(event, config) {
      return true; // Simplified for now
    },
  };

  // Export for different module systems
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumericInput;
  } else if (typeof define === 'function' && define.amd) {
    define(function() { return NumericInput; });
  } else {
    global.NumericInput = NumericInput;
  }

})(typeof window !== 'undefined' ? window : this);
