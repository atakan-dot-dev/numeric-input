<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';

declare global {
  interface Window {
    NumericInput: {
      attach(el: HTMLElement): void;
      detach(el: HTMLElement): void;
    };
  }
}

export interface NumericInputProps {
  id?: string;
  placeholder?: string;
  prefix?: string;
  postfix?: string;
  integer?: boolean;
  sign?: 'any' | 'positive' | 'negative';
  showPlus?: boolean;
  base?: number;
  letterCase?: 'upper' | 'lower';
  separators?: string;
  decimalSeparator?: string;
  locale?: string;
  min?: number;
  max?: number;
  validIncrement?: number;
  keyIncrement?: number;
  snapOrigin?: number;
  validationTimeout?: number;
  valueAlgebra?: string;
  percentage?: boolean;
  percentagePrefix?: boolean;
}

const props = withDefaults(defineProps<NumericInputProps>(), {});
const emit = defineEmits<{
  storedValueChange: [value: string];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
let attached = false;
let currentNumericEl: HTMLInputElement | null = null;
let currentHandler: (() => void) | null = null;

const ATTR_MAP: Record<string, string> = {
  showPlus: 'show-plus',
  letterCase: 'letter-case',
  decimalSeparator: 'decimal-separator',
  validIncrement: 'valid-increment',
  keyIncrement: 'key-increment',
  snapOrigin: 'snap-origin',
  validationTimeout: 'validation-timeout',
  valueAlgebra: 'value-algebra',
  percentagePrefix: 'percentage-prefix',
};

const CONFIG_KEYS = [
  'prefix', 'postfix', 'integer', 'sign', 'showPlus', 'base',
  'letterCase', 'separators', 'decimalSeparator', 'locale', 'min', 'max',
  'validIncrement', 'keyIncrement', 'snapOrigin', 'validationTimeout',
  'valueAlgebra', 'percentage', 'percentagePrefix',
] as const;

function cleanupListener() {
  if (currentNumericEl && currentHandler) {
    currentNumericEl.removeEventListener('input', currentHandler);
    currentNumericEl = null;
    currentHandler = null;
  }
}

function applyConfig() {
  const el = inputRef.value;
  if (!el || !window.NumericInput) return;

  cleanupListener();

  if (attached) {
    window.NumericInput.detach(el);
    attached = false;
  }

  const allAttrs = CONFIG_KEYS.map(k => ATTR_MAP[k] || k);
  allAttrs.forEach(attr => el.removeAttribute(attr));

  for (const key of CONFIG_KEYS) {
    const value = props[key];
    if (value === undefined || value === null || value === false || value === '') continue;
    const attrName = ATTR_MAP[key] || key;
    if (value === true) {
      el.setAttribute(attrName, '');
    } else {
      el.setAttribute(attrName, String(value));
    }
  }

  const originalId = el.id;
  window.NumericInput.attach(el);
  attached = true;

  const numericId = originalId ? `${originalId}-numeric` : null;
  const numericEl = numericId
    ? (document.getElementById(numericId) as HTMLInputElement)
    : null;

  if (numericEl) {
    currentNumericEl = numericEl;
    currentHandler = () => {
      emit('storedValueChange', numericEl.value);
    };
    numericEl.addEventListener('input', currentHandler);
  }
}

onMounted(() => applyConfig());

watch(() => [
  props.prefix, props.postfix, props.integer, props.sign,
  props.showPlus, props.base, props.letterCase, props.separators,
  props.decimalSeparator, props.locale, props.min, props.max,
  props.validIncrement, props.keyIncrement, props.snapOrigin,
  props.validationTimeout, props.valueAlgebra, props.percentage,
  props.percentagePrefix,
], () => applyConfig());

onUnmounted(() => {
  cleanupListener();
  const el = inputRef.value;
  if (el && attached) {
    window.NumericInput.detach(el);
    attached = false;
  }
});

const needsTextType = !!(
  props.prefix || props.postfix || props.percentage || props.percentagePrefix ||
  (props.separators && props.separators !== 'none' && props.separators !== 'locale') ||
  (props.base && props.base !== 10)
);
</script>

<template>
  <input
    ref="inputRef"
    :id="id"
    :type="needsTextType ? 'text' : 'number'"
    inputmode="numeric"
    :placeholder="placeholder"
  />
</template>
