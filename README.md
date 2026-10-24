# GRI Grundbesitz

A German-language, frontend-only website for a family property acquisition business in Nordrhein-Westfalen. Built with React, TypeScript, Vite, Motion, and custom CSS.

## Local development

```sh
npm install
npm run dev
```

## Checks

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Node 22.14 or newer is required for the TypeScript test runner. Production files are generated in `dist/`. The site can be served from any static host. Hash-based navigation supports all three pages without a server rewrite.

## Pages and interactions

- Startseite: animated brand entrance, architectural parallax, interactive property tabs, benefits, process, illustrative NRW map, and FAQ.
- Über uns: four-generation family history and 40 years of experience, using only the supplied business facts.
- Kontakt: both supplied email addresses and telephone numbers.
- Property enquiry: three validated steps followed by an email draft. No backend, data storage, file upload, analytics, or automatic sending. Visitors must open and send the message from their own email client.

The site respects `prefers-reduced-motion`. Fonts and photos are hosted locally. Asset details are in `ASSETS.md`. Photos illustrate architectural subject matter and are not presented as GRI-owned properties.

## Content handover

Contact information is centralized in `src/content.ts`. The enquiry recipient allowlist is in `src/enquiry.ts`. Complete business registration details, a business address, and approved legal text were not supplied; add the final legal notice and privacy text before a public company launch. The Sites preview is initially owner-private.

## Design research

The original design uses editorial architectural composition, oversized typography, cobalt transitions, guided scrolling, and restrained copy. Current reference: [Webflow's 2026 design trends](https://webflow.com/blog/web-design-trends-2026). Animation API usage was checked against the [official Motion documentation](https://motion.dev/docs/react-use-scroll).

## Verification

- Production build, TypeScript and ESLint pass.
- 25 enquiry unit tests pass. Helper coverage: 100% lines/functions and 90.24% branches.
- Browser checked at 375, 768, 1024 and 1440 pixels: no horizontal page overflow and full wordmark visibility.
- Verified all three pages, navigation focus, native mobile-menu focus isolation/restoration, property preselection, and the full enquiry-to-email-draft journey with Unicode and decimal-comma areas.
- Verified rapid back/forward form clicks cannot skip steps and required-field errors focus the appropriate control.
- Both supplied telephone and email links are present. Email clients must be configured separately by the visitor; no test email was sent.
- Reduced motion is implemented with MotionConfig and CSS media queries; the browser test environment did not expose a motion-preference emulation control.
- Code and security reviews approved the implementation.
