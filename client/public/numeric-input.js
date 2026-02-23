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

    parseConfig(element) {
      const rawKeyIncrement = element.getAttribute('key-increment');
      const config = {
        validIncrement: parseFloat(element.getAttribute('valid-increment')) || 0,
        keyIncrement: rawKeyIncrement !== null ? parseFloat(rawKeyIncrement) : NaN,
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
        incrementStart: undefined,
        validationTimeout: 500,
      };

      const rawValidationTimeout = element.getAttribute('validation-timeout');
      if (rawValidationTimeout !== null) {
        config.validationTimeout = parseInt(rawValidationTimeout, 10);
        if (isNaN(config.validationTimeout) || config.validationTimeout < 0) {
          config.validationTimeout = 500;
        }
      }

      if (config.radix && element.getAttribute('base') !== null) {
        console.warn('Both base and radix attributes provided. Using radix.');
      }
      if (config.radix) {
        config.base = config.radix;
      }

      if (config.base < 2 || config.base > 36) {
        console.error(`Invalid base: ${config.base}. Must be between 2 and 36. Defaulting to 10.`);
        config.base = 10;
      }

      if (config.integer && config.validIncrement === 0) {
        config.validIncrement = 1;
      } else if (config.integer && config.validIncrement < 1) {
        config.validIncrement = Math.ceil(config.validIncrement);
      }

      if (!isNaN(config.keyIncrement) && config.validIncrement !== 0) {
        if (config.keyIncrement % config.validIncrement !== 0) {
          console.warn(`key-increment (${config.keyIncrement}) must be a multiple of valid-increment (${config.validIncrement})`);
        }
      }

      if (isNaN(config.keyIncrement)) {
        config.keyIncrement = config.validIncrement || 1;
      }

      const rawIncrementStart = element.getAttribute('increment-start');
      if (rawIncrementStart !== null) {
        config.incrementStart = parseFloat(rawIncrementStart);
      } else {
        config.incrementStart = Math.max(0, config.min ?? 0);
      }

      return config;
    },

    getDecimalSeparator(locale) {
      const parts = new Intl.NumberFormat(locale).formatToParts(1.1);
      const decimalPart = parts.find(part => part.type === 'decimal');
      return decimalPart ? decimalPart.value : '.';
    },

    getGroupSeparator(locale) {
      const parts = new Intl.NumberFormat(locale).formatToParts(1111);
      const groupPart = parts.find(part => part.type === 'group');
      return groupPart ? groupPart.value : ',';
    },

    getDecimalPlaces(num) {
      const str = String(num);
      const dotIndex = str.indexOf('.');
      if (dotIndex === -1) return 0;
      return str.length - dotIndex - 1;
    },

    roundToPrecision(value, increment) {
      const places = this.getDecimalPlaces(increment);
      if (places === 0) return value;
      const factor = Math.pow(10, places);
      return Math.round(value * factor) / factor;
    },

    applySeparatorsInt(intStr, config) {
      if (config.separators === 'none' || config.separators === '') {
        return intStr;
      }

      const number = parseFloat(intStr);
      
      if (isNaN(number)) {
        return intStr;
      }

      let formatted;
      if (config.separators === 'indian') {
        const formatter = new Intl.NumberFormat('en-IN', {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        formatted = formatter.format(Math.abs(number));
      } else if (config.separators === 'locale') {
        const formatter = new Intl.NumberFormat(config.locale, {
          useGrouping: true,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        });
        formatted = formatter.format(Math.abs(number));
      } else {
        const separator = config.separators;
        const absIntStr = intStr.replace(/^-/, '');
        const reversed = absIntStr.split('').reverse().join('');
        const groups = [];
        for (let i = 0; i < reversed.length; i += 3) {
          groups.push(reversed.slice(i, i + 3));
        }
        formatted = groups.join(separator).split('').reverse().join('');
      }

      return formatted;
    },

    formatValue(value, config) {
      if (value === '' || value === null || value === undefined) {
        return '';
      }

      let numValue = typeof value === 'string' ? parseFloat(value) : value;
      
      if (isNaN(numValue)) {
        return '';
      }

      const isNegative = numValue < 0;
      const absValue = Math.abs(numValue);

      let intFormatted, decPart;
      if (config.base === 10) {
        const str = absValue.toString();
        const dotIdx = str.indexOf('.');
        if (dotIdx === -1) {
          intFormatted = str;
          decPart = undefined;
        } else {
          intFormatted = str.substring(0, dotIdx);
          decPart = str.substring(dotIdx + 1);
        }
      } else {
        const intPart = Math.floor(absValue);
        intFormatted = intPart.toString(config.base);
        if (config.letterCase === 'upper') {
          intFormatted = intFormatted.toUpperCase();
        } else {
          intFormatted = intFormatted.toLowerCase();
        }
        decPart = undefined;
      }

      if (config.base === 10 && parseFloat(intFormatted) >= 1000) {
        intFormatted = this.applySeparatorsInt(intFormatted, config);
      }

      const decSep = this.getActiveDecimalSep(config);

      let formatted = intFormatted;
      if (decPart !== undefined) {
        formatted = intFormatted + decSep + decPart;
      }

      let sign = '';
      if (isNegative) {
        sign = '-';
      } else if (config.showPlus) {
        sign = '+';
      }

      if (config.sign === 'negative' && !isNegative) {
        sign = '-';
      }

      return sign + config.prefix + formatted + config.postfix;
    },

    parseValue(str, config) {
      if (!str) return '';

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

      const isNegative = cleaned.startsWith('-');
      if (isNegative || cleaned.startsWith('+')) {
        cleaned = cleaned.slice(1);
      }

      const separator = config.separators === 'locale' 
        ? this.getGroupSeparator(config.locale)
        : (config.separators === 'indian' ? ',' : config.separators);

      const decSep = config.decimal === 'locale'
        ? this.getDecimalSeparator(config.locale)
        : config.decimal;
      
      if (separator && separator !== decSep) {
        cleaned = cleaned.split(separator).join('');
      }
      
      if (decSep !== '.') {
        cleaned = cleaned.replace(decSep, '.');
      }

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

    isValidValue(value, config) {
      if (value === '' || value === null || value === undefined) {
        return true;
      }

      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      if (isNaN(numValue)) {
        return false;
      }

      if (config.sign === 'positive' && numValue < 0) {
        return false;
      }
      if (config.sign === 'negative' && numValue > 0) {
        return false;
      }

      if (config.min !== undefined && numValue < config.min) {
        return false;
      }
      if (config.max !== undefined && numValue > config.max) {
        return false;
      }

      if (config.validIncrement !== 0) {
        const base = config.incrementStart !== undefined ? config.incrementStart : (config.min ?? 0);
        const offset = numValue - base;
        const remainder = offset % config.validIncrement;
        if (Math.abs(remainder) > 1e-10 && Math.abs(remainder - config.validIncrement) > 1e-10) {
          return false;
        }
      }

      return true;
    },

    isValidRange(value, config) {
      if (value === '' || value === null || value === undefined) {
        return true;
      }

      const numValue = typeof value === 'string' ? parseFloat(value) : value;

      if (isNaN(numValue)) {
        return false;
      }

      if (config.sign === 'positive' && numValue < 0) {
        return false;
      }
      if (config.sign === 'negative' && numValue > 0) {
        return false;
      }

      if (config.min !== undefined && numValue < config.min) {
        return false;
      }
      if (config.max !== undefined && numValue > config.max) {
        return false;
      }

      return true;
    },

    isValidIncrement(value, config) {
      if (value === '' || value === null || value === undefined) {
        return true;
      }
      if (config.validIncrement === 0) {
        return true;
      }

      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numValue)) {
        return false;
      }

      const base = config.incrementStart !== undefined ? config.incrementStart : (config.min ?? 0);
      const offset = numValue - base;
      const remainder = offset % config.validIncrement;
      if (Math.abs(remainder) > 1e-10 && Math.abs(remainder - config.validIncrement) > 1e-10) {
        return false;
      }

      return true;
    },

    snapToIncrement(value, config) {
      if (config.validIncrement === 0) return value;

      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      if (isNaN(numValue)) return value;

      const base = config.incrementStart !== undefined ? config.incrementStart : (config.min ?? 0);
      const offset = numValue - base;
      const snapped = base + Math.round(offset / config.validIncrement) * config.validIncrement;

      const result = this.roundToPrecision(snapped, config.validIncrement);

      if (config.min !== undefined && result < config.min) {
        return base + Math.ceil((config.min - base) / config.validIncrement) * config.validIncrement;
      }
      if (config.max !== undefined && result > config.max) {
        return base + Math.floor((config.max - base) / config.validIncrement) * config.validIncrement;
      }

      return result;
    },

    _scheduleIncrementValidation(originalInput, displayInput, config, attachedData) {
      if (attachedData._validationTimer) {
        clearTimeout(attachedData._validationTimer);
        attachedData._validationTimer = null;
      }

      if (config.validIncrement === 0 || config.validationTimeout <= 0) {
        return;
      }

      attachedData._validationTimer = setTimeout(() => {
        attachedData._validationTimer = null;
        const currentParsed = this.parseValue(displayInput.value, config);
        if (currentParsed === '' || isNaN(currentParsed)) return;

        if (!this.isValidIncrement(currentParsed, config)) {
          const snapped = this.snapToIncrement(currentParsed, config);
          originalInput.value = String(snapped);
          displayInput.value = this.formatValue(snapped, config);
          displayInput.setAttribute('data-old-value', displayInput.value);
          originalInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
      }, config.validationTimeout);
    },

    getActiveDecimalSep(config) {
      if (config.decimal === 'locale') {
        return this.getDecimalSeparator(config.locale);
      }
      return config.decimal;
    },

    handleKeyDown(event, originalInput, displayInput, config) {
      const key = event.key;
      const currentValue = this.parseValue(displayInput.value, config);

      if (key === 'ArrowUp' || key === 'ArrowDown') {
        event.preventDefault();
        const direction = key === 'ArrowUp' ? 1 : -1;
        
        let multiplier = 1;
        if (event.altKey) {
          multiplier = 10;
        } else if (event.ctrlKey || event.metaKey) {
          multiplier = 5;
        } else if (event.shiftKey) {
          multiplier = 2;
        }
        
        const increment = config.keyIncrement * multiplier;
        const rawNewValue = (currentValue || 0) + (direction * increment);
        const newValue = this.roundToPrecision(rawNewValue, config.keyIncrement);

        if (this.isValidValue(newValue, config)) {
          originalInput.value = String(newValue);
          displayInput.value = this.formatValue(newValue, config);
          displayInput.setAttribute('data-old-value', displayInput.value);
          originalInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        return;
      }

      if ((key === '-' || key === '−' || key === '–' || key === '—')) {
        event.preventDefault();
        if (config.sign === 'positive' || (config.min !== undefined && config.min >= 0)) {
          return;
        }
        
        if (currentValue === '' || currentValue === 0) {
          displayInput.value = config.prefix + '-' + config.postfix;
          displayInput.setAttribute('data-old-value', displayInput.value);
          const postfixLen = config.postfix ? config.postfix.length : 0;
          const newPos = displayInput.value.length - postfixLen;
          displayInput.setSelectionRange(newPos, newPos);
        } else {
          const newValue = -currentValue;
          if (this.isValidValue(newValue, config)) {
            originalInput.value = String(newValue);
            displayInput.value = this.formatValue(newValue, config);
            displayInput.setAttribute('data-old-value', displayInput.value);
            originalInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        return;
      }

      if (key === '+') {
        event.preventDefault();
        if (config.sign === 'negative' || (config.max !== undefined && config.max < 0)) {
          return;
        }
        
        if (currentValue !== '' && currentValue < 0) {
          const newValue = Math.abs(currentValue);
          if (this.isValidValue(newValue, config)) {
            originalInput.value = String(newValue);
            displayInput.value = this.formatValue(newValue, config);
            displayInput.setAttribute('data-old-value', displayInput.value);
            originalInput.dispatchEvent(new Event('input', { bubbles: true }));
          }
        }
        return;
      }
    },

    handlePaste(event, originalInput, displayInput, config) {
      event.preventDefault();
      
      const pastedText = event.clipboardData.getData('text');
      
      let filtered = '';
      const validChars = config.base === 10 ? '0123456789' : '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      const decimalSep = this.getActiveDecimalSep(config);
      
      for (let char of pastedText) {
        if (validChars.includes(char) || char === decimalSep || char === '.' || char === '-' || char === '+') {
          filtered += char;
        }
      }
      
      const cursorPos = displayInput.selectionStart;
      const before = displayInput.value.substring(0, cursorPos);
      const after = displayInput.value.substring(displayInput.selectionEnd);
      displayInput.value = before + filtered + after;
      
      displayInput.dispatchEvent(new Event('input', { bubbles: true }));
      
      const newPos = cursorPos + filtered.length;
      displayInput.setSelectionRange(newPos, newPos);
    },

    isTrailingDecimal(rawValue, config) {
      const decSep = this.getActiveDecimalSep(config);
      if (rawValue.endsWith(decSep)) return true;
      const parts = rawValue.split(decSep);
      if (parts.length === 2 && /^0*$/.test(parts[1])) return true;
      return false;
    },

    stripFormatting(value, config) {
      let raw = value;
      if (config.prefix && raw.startsWith(config.prefix)) {
        raw = raw.slice(config.prefix.length);
      }
      if (config.postfix && raw.endsWith(config.postfix)) {
        raw = raw.slice(0, -config.postfix.length);
      }
      let sign = '';
      if (raw.startsWith('-')) { sign = '-'; raw = raw.slice(1); }
      else if (raw.startsWith('+')) { sign = '+'; raw = raw.slice(1); }
      return sign + raw;
    },

    handleInput(event, originalInput, displayInput, config) {
      const value = displayInput.value;
      
      const cursorPos = displayInput.selectionStart;
      const oldValue = displayInput.getAttribute('data-old-value') || '';
      
      if (value === '' || value === config.prefix + config.postfix) {
        originalInput.value = '';
        displayInput.setAttribute('data-old-value', value || '');
        return;
      }

      const hasFormatting = config.prefix || config.postfix || 
                           (config.separators && config.separators !== 'none') ||
                           config.base !== 10;

      const decSep = this.getActiveDecimalSep(config);
      const rawCore = this.stripFormatting(value, config);

      if (!hasFormatting) {
        let parsed = this.parseValue(value, config);
        const isTrailing = this.isTrailingDecimal(value, config);
        const isJustSign = (value === '-' || value === '+');

        if (isJustSign) {
          if (value === '-' && config.sign !== 'positive' && !(config.min !== undefined && config.min >= 0)) {
            displayInput.setAttribute('data-old-value', value);
          } else if (value === '+' && config.sign !== 'negative') {
            displayInput.setAttribute('data-old-value', value);
          } else {
            displayInput.value = oldValue;
            displayInput.setSelectionRange(Math.max(0, cursorPos - 1), Math.max(0, cursorPos - 1));
          }
          return;
        }

        if (config.sign === 'negative' && parsed !== '' && !isNaN(parsed) && parsed > 0) {
          parsed = -parsed;
          const negDisplay = '-' + value;
          displayInput.value = negDisplay;
          displayInput.setAttribute('data-old-value', negDisplay);
          if (this.isValidRange(parsed, config)) {
            originalInput.value = String(parsed);
            const attachedData = this._attached.get(originalInput);
            if (attachedData && !this.isValidIncrement(parsed, config)) {
              this._scheduleIncrementValidation(originalInput, displayInput, config, attachedData);
            }
          }
          return;
        }

        if (isTrailing && !config.integer) {
          const intPart = value.replace(new RegExp('\\' + decSep + '.*$'), '');
          const intParsed = this.parseValue(intPart, config);
          if (intParsed !== '' && !isNaN(intParsed)) {
            originalInput.value = String(intParsed);
            displayInput.setAttribute('data-old-value', value);
          }
          return;
        }

        if (parsed !== '' && !isNaN(parsed) && this.isValidRange(parsed, config)) {
          originalInput.value = String(parsed);
          displayInput.setAttribute('data-old-value', value);
          const attachedData = this._attached.get(originalInput);
          if (attachedData && !this.isValidIncrement(parsed, config)) {
            this._scheduleIncrementValidation(originalInput, displayInput, config, attachedData);
          }
        } else if (parsed !== '' && !isNaN(parsed)) {
          displayInput.value = oldValue;
          const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
          displayInput.setSelectionRange(newPos, newPos);
        } else if (value !== oldValue) {
          displayInput.value = oldValue;
          const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
          displayInput.setSelectionRange(newPos, newPos);
        }
        return;
      }
      
      const isTrailing = this.isTrailingDecimal(rawCore, config);
      const isJustSign = (rawCore === '-' || rawCore === '+');

      if (isJustSign) {
        displayInput.setAttribute('data-old-value', value);
        return;
      }

      if (isTrailing && !config.integer) {
        let parsed = this.parseValue(value, config);
        if (parsed !== '' && !isNaN(parsed)) {
          if (config.sign === 'negative' && parsed > 0) parsed = -parsed;
          originalInput.value = String(parsed);
        }
        displayInput.setAttribute('data-old-value', value);
        return;
      }

      let parsed = this.parseValue(value, config);

      if (config.sign === 'negative' && parsed !== '' && !isNaN(parsed) && parsed > 0) {
        parsed = -parsed;
      }
      
      if (parsed !== '' && !isNaN(parsed)) {
        if (this.isValidRange(parsed, config)) {
          originalInput.value = String(parsed);
          const formatted = this.formatValue(parsed, config);
          if (formatted !== value) {
            displayInput.value = formatted;
            const postfixLen = config.postfix ? config.postfix.length : 0;
            const newPos = Math.max(0, formatted.length - postfixLen);
            displayInput.setSelectionRange(newPos, newPos);
          }
          displayInput.setAttribute('data-old-value', displayInput.value);
          const attachedData = this._attached.get(originalInput);
          if (attachedData && !this.isValidIncrement(parsed, config)) {
            this._scheduleIncrementValidation(originalInput, displayInput, config, attachedData);
          }
        } else {
          displayInput.value = oldValue;
          const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
          displayInput.setSelectionRange(newPos, newPos);
        }
      } else {
        displayInput.value = oldValue;
        const newPos = Math.max(0, Math.min(oldValue.length, cursorPos - 1));
        displayInput.setSelectionRange(newPos, newPos);
      }
    },

    attach(elements) {
      const targets = elements instanceof NodeList || Array.isArray(elements)
        ? Array.from(elements)
        : [elements];

      targets.forEach(originalInput => {
        if (originalInput.type !== 'number' && originalInput.type !== 'text') {
          console.warn('NumericInput can only be attached to input elements with type="number" or type="text"');
          return;
        }

        if (this._attached.has(originalInput)) {
          return;
        }

        const config = this.parseConfig(originalInput);

        const displayInput = document.createElement('input');
        displayInput.type = 'text';
        
        const copyAttrs = ['placeholder', 'disabled', 'readonly', 'class', 'style', 'data-testid'];
        copyAttrs.forEach(attr => {
          const value = originalInput.getAttribute(attr);
          if (value !== null) {
            displayInput.setAttribute(attr, value);
          }
        });
        
        displayInput.removeAttribute('name');

        const originalId = originalInput.getAttribute('id');
        if (originalId) {
          displayInput.setAttribute('id', originalId);
          originalInput.removeAttribute('id');
          originalInput.setAttribute('id', originalId + '-numeric');
        }

        originalInput.style.position = 'absolute';
        originalInput.style.left = '-9999px';
        originalInput.style.width = '1px';
        originalInput.style.height = '1px';
        originalInput.style.opacity = '0';
        originalInput.style.pointerEvents = 'none';
        originalInput.setAttribute('tabindex', '-1');
        originalInput.setAttribute('aria-hidden', 'true');

        originalInput.parentNode.insertBefore(displayInput, originalInput.nextSibling);

        if (originalInput.value) {
          const parsed = this.parseValue(originalInput.value, config);
          if (parsed !== '' && !isNaN(parsed)) {
            originalInput.value = String(parsed);
            displayInput.value = this.formatValue(parsed, config);
          }
        }

        const keydownHandler = (e) => this.handleKeyDown(e, originalInput, displayInput, config);
        const inputHandler = (e) => this.handleInput(e, originalInput, displayInput, config);
        const pasteHandler = (e) => this.handlePaste(e, originalInput, displayInput, config);

        this._attached.set(originalInput, {
          config,
          displayInput,
          keydownHandler,
          inputHandler,
          pasteHandler,
          _validationTimer: null,
        });

        displayInput.addEventListener('keydown', keydownHandler);
        displayInput.addEventListener('input', inputHandler);
        displayInput.addEventListener('paste', pasteHandler);

        displayInput.setAttribute('data-old-value', displayInput.value);
      });
    },

    detach(elements) {
      const targets = elements instanceof NodeList || Array.isArray(elements)
        ? Array.from(elements)
        : [elements];

      targets.forEach(originalInput => {
        const data = this._attached.get(originalInput);
        if (!data) return;

        const { displayInput, keydownHandler, inputHandler, pasteHandler } = data;

        if (data._validationTimer) {
          clearTimeout(data._validationTimer);
          data._validationTimer = null;
        }

        displayInput.removeEventListener('keydown', keydownHandler);
        displayInput.removeEventListener('input', inputHandler);
        displayInput.removeEventListener('paste', pasteHandler);

        if (displayInput.parentNode) {
          displayInput.parentNode.removeChild(displayInput);
        }

        originalInput.style.position = '';
        originalInput.style.left = '';
        originalInput.style.width = '';
        originalInput.style.height = '';
        originalInput.style.opacity = '';
        originalInput.style.pointerEvents = '';
        originalInput.removeAttribute('tabindex');
        originalInput.removeAttribute('aria-hidden');
        
        const displayId = displayInput.getAttribute('id');
        if (displayId && originalInput.getAttribute('id') === displayId + '-numeric') {
          originalInput.setAttribute('id', displayId);
        }

        this._attached.delete(originalInput);
      });
    },
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NumericInput;
  } else {
    global.NumericInput = NumericInput;
  }
})(typeof window !== 'undefined' ? window : global);
