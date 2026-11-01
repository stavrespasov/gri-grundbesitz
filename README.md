# GRI Grundbesitz — V2

German-language, frontend-only property acquisition website for a family business focused on Mönchengladbach, Viersen, Korschenbroich, Krefeld, Düsseldorf, Meerbusch and Köln. React, TypeScript, Vite and Motion.

## Versions

| Version        | Git branch    | Vercel project       | Address                               |
| -------------- | ------------- | -------------------- | ------------------------------------- |
| Original       | `main`        | `gri-grundbesitz`    | https://gri-grundbesitz.vercel.app    |
| Forest & Ivory | `redesign/v2` | `gri-grundbesitz-v2` | https://gri-grundbesitz-v2.vercel.app |

V2 has a separate working checkout and Vercel link. Never deploy this branch through the original project's local link or merge it into `main` without a separate release decision. The original design's baseline commit is `65c0a27220067dad655a29a4e1545dfab7185665`.

## Development

```sh
npm ci
npm run dev -- --port 5188
```

Node 22.14 or newer is required. The build generates static files in `dist/`.
The development/build hooks fetch Boska directly from Fontshare when it is absent. Font binaries stay out of the public repository under Fontshare's licence. Subsequent local runs reuse the downloaded files; a fresh checkout needs network access for this preparation step. The resulting website serves the fonts locally.

```sh
npm run build
npm run typecheck
npm run lint
npm test
npm run test:e2e -- --workers=2
```

Browser checks use Playwright Chromium. Install the browser with `npx playwright install chromium` when necessary. Set `E2E_BASE_URL` to verify a running or deployed site; otherwise Playwright starts a local Vite server at port 5188. Screenshots and traces are written outside the application checkout in `../artifacts/`.

## Design and behavior

- One page: photo-led opening, buying profile and process, family, regional focus, direct contact.
- Forest `#142E28`, ivory `#F3F0E8`, limestone `#DED7CB`, bronze `#B69A71`, ink `#202621`.
- Self-hosted Boska headings and Manrope body text; architectural frame motif, restrained once-only reveals, native scrolling and reduced-motion support.
- Native mobile menu and enquiry dialogs, keyboard focus management, and mobile contact actions that hide at the opening/contact section and during an enquiry.
- All four property categories are visible; category actions preselect the enquiry type.
- `#/familie`, `#/kontakt` and `#/` remain compatible with the corresponding new page anchors.
- The map illustrates city centres and an approximate Rhine course. It does not identify office locations or a fixed purchasing radius.

## Enquiries

The compact form validates property type, location, name, email and acknowledgement. Telephone, message, area and condition are optional. Additional property details can be expanded. A valid submission shows an editable summary and prepares an encoded email draft addressed to a supplied business email.

**The visitor opens and sends the email in their own email application.** There is no backend, automatic sending, storage, upload or analytics. The interface never claims a message was sent. Telephone and direct email links provide alternatives. Helper tests cover validation, recipient allowlisting, Unicode, boundaries and encoding; browser tests exercise the complete draft journey without sending an email.

## Content and assets

Contacts and regional content are in `src/content.ts`. Photography is illustrative and is not presented as GRI-owned inventory. Font/photo credits and map sources are in `ASSETS.md`. Business history uses only the supplied facts: 40 years and four generations, without an inferred founding year.

The business address, full legal company details and approved legal/privacy copy have not been provided. Add the final client-approved content for the eventual business launch. The V2 review site is deliberately marked `noindex, nofollow`; remove that directive only for an agreed public launch.

## Deployment

Vercel builds with `npm ci`, `npm run build`, and output directory `dist`. The V2 project's production branch is `redesign/v2`; the original project continues to track `main`. Confirm the linked project name and ID before any CLI deployment. Local `.vercel/` metadata and `.env*` files are ignored and must never be committed. V2 needs no application environment variables.
