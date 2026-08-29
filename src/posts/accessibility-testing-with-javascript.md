---
title: Accessibility testing with JavaScript
description: Using axe-core, Playwright, Jest, and Cypress to write automated accessibility tests in JavaScript that run in CI/CD pipelines.

type: guide
topics:
    - JavaScript
    - Testing
technologies:
    - JavaScript
level: intermediate

keywords:
    - accessibility testing with javascript
    - axe-core
    - playwright accessibility testing
    - jest accessibility testing
    - cypress accessibility
    - automated accessibility testing
---

Automated accessibility testing catches issues before they reach production - and unlike a manual pass with the [accessibility testing checklist](/topics/accessibility/accessibility-testing-checklist/), it runs on every commit without anyone having to remember to do it. JavaScript libraries like axe-core integrate directly into your existing test suite: unit tests, integration tests, and end-to-end tests.

## axe-core - the foundation

Most JavaScript accessibility testing tools are built on [axe-core](https://github.com/dequelabs/axe-core). It runs WCAG 2.1 checks against rendered DOM and returns structured violations.

### Standalone usage

```javascript
import axe from 'axe-core';

axe.run(document, {
    runOnly: ['wcag2a', 'wcag2aa']
}).then(results => {
    if (results.violations.length > 0) {
        results.violations.forEach(violation => {
            console.error(`[${violation.impact}] ${violation.description}`);
            violation.nodes.forEach(node => {
                console.error(`  Element: ${node.html}`);
                console.error(`  Fix: ${node.failureSummary}`);
            });
        });
    }
});
```

### Running on specific elements

```javascript
axe.run(document.getElementById('login-form'), {
    rules: {
        'color-contrast': { enabled: true },
        'label': { enabled: true },
        'autocomplete-valid': { enabled: true }
    }
}).then(results => {
    console.log(`${results.violations.length} violations found`);
});
```

## Jest + jest-axe

Add accessibility checks to your React, Vue, or Angular component tests:

```bash
npm install --save-dev jest-axe
```

```javascript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('LoginForm', () => {
    it('should have no accessibility violations', async () => {
        const { container } = render(<LoginForm />);
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
```

### Testing specific rules

```javascript
it('should have proper form labels', async () => {
    const { container } = render(<ContactForm />);
    const results = await axe(container, {
        rules: {
            'label': { enabled: true },
            'input-button-name': { enabled: true }
        }
    });
    expect(results).toHaveNoViolations();
});
```

### Testing dynamic states

```javascript
it('should remain accessible after form submission error', async () => {
    const { container, getByText } = render(<LoginForm />);
    
    fireEvent.click(getByText('Submit'));
    
    await waitFor(() => {
        expect(getByText('Email is required')).toBeInTheDocument();
    });

    const results = await axe(container);
    expect(results).toHaveNoViolations();
});
```

## Playwright accessibility testing

Playwright has built-in axe-core integration through `@axe-core/playwright`:

```bash
npm install --save-dev @axe-core/playwright
```

```javascript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Homepage accessibility', () => {
    test('should not have any automatically detectable violations', async ({ page }) => {
        await page.goto('/');
        
        const results = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(results.violations).toEqual([]);
    });
});
```

### Testing specific page sections

```javascript
test('navigation should be accessible', async ({ page }) => {
    await page.goto('/');

    const results = await new AxeBuilder({ page })
        .include('nav')
        .analyze();

    expect(results.violations).toEqual([]);
});
```

### Testing keyboard navigation

```javascript
test('should navigate through cards with keyboard', async ({ page }) => {
    await page.goto('/');
    
    await page.keyboard.press('Tab');
    const skipLink = await page.locator(':focus');
    await expect(skipLink).toHaveText('Skip to main content');

    await page.keyboard.press('Tab');
    const firstCard = await page.locator(':focus');
    await expect(firstCard).toHaveAttribute('href');
});
```

### Testing focus management

This test is checking the exact pattern described in [focus management in SPAs](/topics/javascript/focus-management-in-spas/) - it's worth reading that post first if the assertion below doesn't make sense at a glance.

```javascript
test('focus should move to heading after navigation', async ({ page }) => {
    await page.goto('/');
    await page.click('a[href="/about"]');

    const focused = await page.evaluate(() => {
        return {
            tag: document.activeElement.tagName,
            text: document.activeElement.textContent
        };
    });

    expect(focused.tag).toBe('H1');
});
```

## Cypress + cypress-axe

```bash
npm install --save-dev cypress-axe
```

```javascript
import 'cypress-axe';

describe('Product page', () => {
    beforeEach(() => {
        cy.visit('/products');
        cy.injectAxe();
    });

    it('has no detectable accessibility violations', () => {
        cy.checkA11y();
    });

    it('product cards are accessible', () => {
        cy.checkA11y('.product-card');
    });

    it('remains accessible after filtering', () => {
        cy.get('#category-filter').select('Electronics');
        cy.checkA11y();
    });
});
```

### Custom violation handling

```javascript
cy.checkA11y(null, null, (violations) => {
    violations.forEach(violation => {
        cy.log(`[${violation.impact}] ${violation.id}: ${violation.description}`);
        violation.nodes.forEach(node => {
            cy.log(`  -> ${node.html}`);
        });
    });
});
```

## ESLint - catch issues at write time

Catch accessibility issues in JSX/TSX as you type:

```bash
npm install --save-dev eslint-plugin-jsx-a11y
```

```json
{
    "plugins": ["jsx-a11y"],
    "extends": ["plugin:jsx-a11y/recommended"],
    "rules": {
        "jsx-a11y/anchor-is-valid": "error",
        "jsx-a11y/alt-text": "error",
        "jsx-a11y/label-has-associated-control": "error",
        "jsx-a11y/no-autofocus": "warn"
    }
}
```

This catches errors like missing `alt` attributes and invalid ARIA props before the code even runs.

## CI/CD integration

Add accessibility checks to your pipeline:

```yaml
name: Accessibility Tests
on: [push, pull_request]

jobs:
  a11y:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - run: npx serve -l 3000 dist &
      - run: npx wait-on http://localhost:3000
      - run: npm run test:a11y
```

## What automated tests catch vs miss

| Catches | Misses |
|---------|--------|
| Missing alt text | Whether alt text is meaningful |
| Missing form labels | Whether labels make sense |
| Color contrast ratios | Contrast in custom themes or hover states |
| Missing ARIA attributes | Whether ARIA is used correctly in context |
| Duplicate IDs | Logical tab order |
| Empty links/buttons | Whether content updates are announced |

> **Rule of thumb:** Automated tests cover ~40% of WCAG criteria. Always supplement with manual screen reader testing.

## Resources

- [axe-core GitHub](https://github.com/dequelabs/axe-core)
- [jest-axe documentation](https://github.com/nickcolley/jest-axe)
- [@axe-core/playwright](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright)
- [eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
