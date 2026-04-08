# NumericInput.js — Monorepo

A framework-agnostic JavaScript library for advanced numeric input handling, with framework bindings for React, Vue, and Angular.

## Packages

| Package | Description | Version |
|---------|-------------|---------|
| [`numeric-input`](./packages/numeric-input) | Core vanilla JS library | 1.0.0 |
| [`numeric-input-react`](./packages/numeric-input-react) | React component wrapper | 1.0.0 |
| [`numeric-input-vue`](./packages/numeric-input-vue) | Vue 3 component wrapper | 1.0.0 |
| [`numeric-input-angular`](./packages/numeric-input-angular) | Angular standalone component | 1.0.0 |

## Demo

Live interactive demo with full attribute documentation and a built-in test runner:
**[numeric-input.demo.app](https://numeric-input.replit.app)**

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
