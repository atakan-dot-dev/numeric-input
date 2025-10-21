# Design Guidelines: Numeric Input Library Demo

## Design Approach: Developer Tool System
**Selected Framework:** Modern Developer Tool Pattern (Linear/Vercel/Stripe Docs inspired)  
**Rationale:** This is a technical library requiring clarity, functionality, and ease of testing. The interface must prioritize information density while maintaining visual hierarchy for different configuration examples.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 222 10% 10%
- Surface: 222 10% 15%
- Border: 222 10% 25%
- Text Primary: 0 0% 95%
- Text Secondary: 0 0% 65%
- Accent Blue: 217 91% 60%
- Success Green: 142 71% 45%
- Error Red: 0 84% 60%
- Warning Amber: 38 92% 50%

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Border: 220 13% 91%
- Text Primary: 222 47% 11%
- Text Secondary: 215 16% 47%
- Same accent colors with adjusted opacity

### B. Typography
- **Primary Font:** Inter or System UI (-apple-system, BlinkMacSystemFont, "Segoe UI")
- **Monospace:** 'JetBrains Mono', 'Fira Code', Consolas, monospace
- **Headings:** 600-700 weight, tight tracking
- **Body:** 400 weight, 1.6 line-height
- **Code/Input:** Monospace, 500 weight

### C. Layout System
**Spacing Units:** Tailwind units of 2, 3, 4, 6, 8, 12, 16 (p-2, gap-4, mt-8, etc.)
- Consistent 4-6 unit gutters between sections
- 8-12 unit padding for major containers
- 2-3 unit internal component spacing

### D. Component Library

**Page Structure:**
- **Header:** Fixed top navigation with library name, GitHub link, version badge
- **Sidebar:** Sticky navigation listing all attribute categories and test runner access
- **Main Content:** Two-column responsive grid (config examples | live previews)
- **Test Panel:** Collapsible bottom panel or separate page for test execution

**Core Components:**

1. **Example Cards**
   - White/dark surface with subtle border
   - Title describing the configuration
   - Code block showing attributes
   - Live input demonstration below
   - Current value display in monospace

2. **Input Showcase Grid**
   - 2-column layout on desktop (configuration | demo)
   - Auto-grid for multiple related examples
   - Each cell contains: label, configured input, output display

3. **Configuration Panel**
   - Organized by attribute type (Validation, Formatting, Display, Locale)
   - Accordion or tab-based sections
   - Each attribute has: name, description, possible values, example

4. **Test Runner Interface**
   - Suite selector dropdown
   - Run All/Run Selected buttons
   - Real-time progress indicator
   - Results list: passed (green checkmark), failed (red X), pending (gray)
   - Expandable test details with assertion output
   - Summary stats: X passed, Y failed, Z total

5. **Code Display**
   - Syntax-highlighted attribute examples
   - Copy button in top-right corner
   - Dark theme matching overall aesthetic
   - Inline documentation comments

**Navigation:**
- Left sidebar categories: Getting Started, Attributes (sub-sections), Examples, Tests, API Reference
- Smooth scroll to anchor links
- Active section indicator in sidebar

**Interactive Elements:**
- Input fields with immediate visual feedback
- Toggle switches for boolean attributes (integer, show-plus)
- Dropdowns for enum values (sign, letter-case, base)
- Number inputs for numeric attributes (min, max, increment)
- Real-time value updates as configurations change

### E. Visual Hierarchy

**Information Architecture:**
1. **Hero Section:** Minimal, text-focused with library name, tagline, quick install snippet
2. **Quick Start:** 3-step guide with code examples
3. **Attribute Reference:** Comprehensive list organized by category
4. **Live Examples Grid:** 6-8 common use cases in cards
5. **Advanced Examples:** Edge cases and complex configurations
6. **Test Suite:** Integrated test runner interface
7. **Footer:** Links to GitHub, npm, documentation

**Layout Proportions:**
- Sidebar: 280px fixed width
- Main content: Flexible with max-width of 1400px
- Code blocks: 60% of card width
- Live demos: 40% of card width

### F. Interaction Patterns

**Demo Interactions:**
- Click any example input to focus and test
- Hover over configuration labels shows tooltips with full attribute documentation
- Click "Edit" icon to open configuration playground
- Toggle "Show Attributes" to display/hide code for each example

**Test Runner:**
- Click suite name to expand/collapse tests
- Click individual test to see details
- "Watch mode" toggle for continuous testing
- Filter buttons: All, Passed, Failed, Pending

**No Animations:** Functional transitions only (collapse/expand: 150ms ease)

## Images
**No hero image required.** This is a technical library where code examples and functionality take precedence. Use:
- Icon/logo in header (geometric, minimal SVG)
- Syntax highlighting for visual interest
- Color-coded test results
- Charts/graphs for test coverage if applicable

## Page Sections

1. **Header** - Library name, navigation links, GitHub star count
2. **Installation** - Package manager commands in tabs (npm, yarn, pnpm)
3. **Attribute Reference** - Comprehensive table/cards of all attributes
4. **Example Gallery** - Grid of 10-12 pre-configured examples
5. **Interactive Playground** - Build custom configuration live
6. **Test Suite Panel** - Run and view all tests
7. **API Documentation** - attach(), detach(), core methods
8. **Footer** - Minimal links and version info