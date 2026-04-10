# NumericInput.js — Monorepo

A framework-agnostic JavaScript library for advanced numeric input handling, with framework bindings for React, Vue, and Angular.

## Packages

| Package | Description | npm |
|---------|-------------|-----|
| [`numeric-input`](./packages/numeric-input) | Core vanilla JS library | [![npm](https://img.shields.io/npm/v/numeric-input.svg)](https://www.npmjs.com/package/numeric-input) |
| [`numeric-input-react`](./packages/numeric-input-react) | React component wrapper | [![npm](https://img.shields.io/npm/v/numeric-input-react.svg)](https://www.npmjs.com/package/numeric-input-react) |
| [`numeric-input-vue`](./packages/numeric-input-vue) | Vue 3 component wrapper | [![npm](https://img.shields.io/npm/v/numeric-input-vue.svg)](https://www.npmjs.com/package/numeric-input-vue) |
| [`numeric-input-angular`](./packages/numeric-input-angular) | Angular standalone component | [![npm](https://img.shields.io/npm/v/numeric-input-angular.svg)](https://www.npmjs.com/package/numeric-input-angular) |

## Demo

Live interactive demo with full attribute documentation and a built-in test runner:
**[numeric-input.demo.app](https://atakan-dot-dev.github.io/numeric-input)**

## What is NumericInput.js?

NumericInput.js enhances plain `<input>` elements with locale-aware number formatting, keystroke filtering, range enforcement, multi-base display (hex, binary, octal…), value algebra transformations, percentage shorthands, smart paste, and configurable arrow-key increment controls — all without any framework dependency.

## Repository structure

```
packages/
  numeric-input/            Core library (vanilla JS, no dependencies)
  numeric-input-react/      React binding
  numeric-input-vue/        Vue 3 binding
  numeric-input-angular/    Angular 16+ binding
client/                     Demo application (React + Vite)
```

## Development

This repo uses pnpm workspaces. Install with:

```bash
pnpm install
```

Run the demo app:

```bash
npm run dev
```

Run the core library tests with Node:

```bash
npm --prefix packages/numeric-input test
```
