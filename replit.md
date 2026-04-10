# NumericInput.js - Advanced Numeric Input Library Demo

## Overview
This project showcases `NumericInput.js`, a powerful, framework-agnostic JavaScript library designed for advanced numeric input handling. It supports diverse features such as multiple number bases (2-36), locale-aware formatting, intelligent real-time validation, safe value-algebra transformations, and comprehensive keyboard interactions. The demo application, built with React and TypeScript, provides interactive examples, comprehensive attribute documentation, and integrated framework bindings to illustrate the library's capabilities. The project aims to offer a robust and flexible solution for numeric input, enhancing user experience and data integrity across various applications.

## User Preferences
I prefer detailed explanations and thorough documentation. I appreciate clear architectural decisions and well-structured code. I like interactive examples that allow real-time experimentation with features.

## System Architecture

### Core Library (`public/numeric-input.js` and `client/public/numeric-input.js`)
- **Framework Agnostic**: Developed in Vanilla JavaScript to ensure compatibility with any frontend framework.
- **Dual-Input Design**: Utilizes a hidden input for raw numeric or algebra-transformed values and a visible input for formatted display.
- **Configurable**: Attributes from HTML elements are parsed for easy configuration.
- **Event-Driven**: Manages `keydown`, `input`, and `paste` events for dynamic behavior.
- **Feature-Rich**: Includes multi-base support (2-36), locale-aware formatting via `Intl` API, real-time smart validation, and a safe expression parser for value algebra.

### Demo Application (React + TypeScript)
- **UI/UX**: Features a sidebar for navigation, dark/light mode theming, and syntax highlighting for code blocks. The design uses a developer tool aesthetic (Linear/Vercel inspired color palette), Inter for UI typography, and JetBrains Mono for code.
- **Interactive Examples**: 12 configurable examples (Basic Number, Range & Increments, Currency, Percentage, Decimal Keys, Smart Paste, Number Base, Display Options, Locale & Format, Value Algebra, Precision, Full Config Playground) each with live controls that update the input behavior in real-time. Positive-only numeric controls (increment, timeout) use the React binding component to enforce the `sign="positive"` constraint.
- **Documentation**: Comprehensive attribute reference across five categories (Validation, Formatting, Display, Locale, Advanced). Includes `value-algebra`, `percentage`, and `percentage-prefix` attributes.
- **Integrated Test Runner**: 105 tests across 21 suites, with per-suite pass/fail badges and aggregated run status.
- **Favicon**: Custom code-editor icon (PNG) in `client/public/favicon.png`.

### Framework Bindings (`public/bindings/`)
- **Modular Components**: Provides dedicated components for React, Vue, and Angular, with `numeric-input` as a peer dependency.
- **Documentation-only Patterns**: Includes examples for Svelte, Solid, Qwik, and Astro.

### Key Features
- **Smart Behaviors**: Keystroke filtering, sign flipping, arrow key value adjustment, range enforcement, increment validation with debouncing, and precision preservation during increments.
- **Value Algebra**: A safe recursive descent parser enables transformation of display values to stored values (e.g., `x*0.01`), supporting arithmetic, parentheses, `x` variable, and functions like `floor()`, `ceil()`, `round()`. Limited to 5 operations and 100 characters for security.
- **Custom Arrow Buttons**: Configurable increment/decrement buttons with `always`/`never`/`focus` visibility options.
- **Smart Paste**: Automatically detects and normalizes pasted number formats across different locales.

### Attribute Naming (v0.9.0 — clean breaks, no backward compat)
- `decimal-separator` (was `decimal`): config object key is `decimalSeparator`
- `snap-origin` (was `increment-start`): config object key is `snapOrigin`
- `accuracy="N"`: shorthand that sets `valid-increment` to `10^(-N)` (only when valid-increment not already set)
- Version is `0.9.0` across all packages and the core library
- Live demo: https://atakan-dot-dev.github.io/numeric-input/
- GitHub repo: https://github.com/atakan-dot-dev/numeric-input

## External Dependencies
- **Intl API**: Utilized for locale-aware number formatting.
- **Shadcn UI**: Used as the component library for the demo application.