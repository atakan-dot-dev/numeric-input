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
     * Format number with separators
     */
    applySeparators(numStr, config) {
      if (config.separators === 'none' || config.separators === '') {
        return numStr;
      }

      const [intPart, decPart] = numStr.split('.');
      let separator = ',';

      if (config.separators === 'locale') {
        separator = this.getGroupSeparator(config.locale);
      } else if (config.separators !== 'indian') {
        separator = config.separators;
      }

      let formatted;
      if (config.separators === 'indian') {
        // Indian numbering: X,XX,XXX
        const reversed = intPart.split('').reverse().join('');
        const groups = [];
        groups.push(reversed.slice(0, 3));
        for (let i = 3; i < reversed.length; i += 2) {
          groups.push(reversed.slice(i, i + 2));
        }
        formatted = groups.join(separator).split('').reverse().join('');
      } else {
        // Standard grouping: XXX,XXX,XXX
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

      // Handle arrow keys
      if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();
        const direction = key === 'ArrowUp' ? 1 : -1;
        const newValue = (currentValue || 0) + (direction * config.keyIncrement);

        if (this.isValidValue(newValue, config)) {
          const formatted = this.formatValue(newValue, config);
          element.value = formatted;
          element.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return;
      }

      // Handle sign flipping
      if ((key === '-' || key === '−' || key === '–' || key === '—') && config.sign === 'any') {
        if (currentValue !== '' && currentValue !== 0) {
          event.preventDefault();
          const newValue = -currentValue;
          const formatted = this.formatValue(newValue, config);
          element.value = formatted;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
      }

      if (key === '+' && config.sign === 'any') {
        if (currentValue !== '' && currentValue < 0) {
          event.preventDefault();
          const newValue = Math.abs(currentValue);
          const formatted = this.formatValue(newValue, config);
          element.value = formatted;
          element.dispatchEvent(new Event('input', { bubbles: true }));
          return;
        }
      }
    },

    /**
     * Handle input event
     */
    handleInput(event, element, config) {
      const value = element.value;
      const parsed = this.parseValue(value, config);

      // Store cursor position
      const cursorPos = element.selectionStart;

      if (parsed !== '') {
        if (this.isValidValue(parsed, config)) {
          // Value is valid, reformat
          const formatted = this.formatValue(parsed, config);
          if (formatted !== value) {
            element.value = formatted;
            // Try to restore cursor position
            element.setSelectionRange(cursorPos, cursorPos);
          }
        } else {
          // Value is invalid, prevent change
          const oldValue = element.getAttribute('data-old-value') || '';
          element.value = oldValue;
          element.setSelectionRange(cursorPos - 1, cursorPos - 1);
        }
      }

      // Store current value as old value
      element.setAttribute('data-old-value', element.value);
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

        // Store handlers for later removal
        this._attached.set(element, {
          config,
          keydownHandler,
          inputHandler,
        });

        // Attach event listeners
        element.addEventListener('keydown', keydownHandler);
        element.addEventListener('input', inputHandler);

        // Initialize with current value
        if (element.value) {
          const parsed = this.parseValue(element.value, config);
          if (parsed !== '') {
            element.value = this.formatValue(parsed, config);
          }
        }

        // Initialize data-old-value
        element.setAttribute('data-old-value', element.value);
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
