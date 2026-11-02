# Asset credits

All photography is illustrative architectural imagery. The photographs are not represented as GRI-owned properties or acquisition references.

| Local file                | Photographer / location      | Original source                                                                                     |
| ------------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| public/images/hero.webp   | Aimar Gallardo, Berlin       | https://unsplash.com/photos/modern-apartment-building-with-balconies-and-glass-railings-P6UfxsQLGzU |
| public/images/detail.webp | Maximilian Bungart, Saarland | https://unsplash.com/photos/exterior-of-a-modern-apartment-building-with-balconies-1iGG6k4Ci4E      |
| public/images/homes.webp  | Tobias Reich, Heidelberg     | https://unsplash.com/photos/empty-street-between-concrete-houses-during-daytime-MEJF6mlUo4A         |

The source pages identify these photographs as free to use under the Unsplash License: https://unsplash.com/license . Files were requested as WebP with image widths of 2000px (hero) and 1400px (detail/homes), at quality 85.

## Self-hosted fonts

- Manrope variable, Latin subset: obtained from the official npm package @fontsource-variable/manrope. Local file public/fonts/manrope.woff2; license public/fonts/Manrope-LICENSE.txt.
- DM Sans variable, Latin subset: obtained from @fontsource-variable/dm-sans. Local file public/fonts/dm-sans.woff2; license public/fonts/DM-Sans-LICENSE.txt.
- Both font families are distributed under the SIL Open Font License. German characters are included in the Latin subsets.
- V2 display text uses Boska 500/700 under the ITF Free Font License. The public repository excludes the font binaries. `scripts/fetch-fonts.mjs` obtains the unmodified WOFF2 files directly from Fontshare's CDN during preparation; the website then self-hosts them for its own display. The full original licence was extracted from the [official Boska package](https://api.fontshare.com/v2/fonts/download/boska) to `public/fonts/Boska-LICENSE.txt`. [Fontshare family page](https://www.fontshare.com/fonts/boska). SilberBerg supplied the typography reference, not a redistribution licence.

The original geometric GRI mark, star motif, and stylized NRW map remain in V1 history. V2 uses a typographic wordmark and a custom regional SVG. Interface icons use lucide-react (ISC license).

## V2 photography and map

`public/images/v2-hero.webp` is a separately downloaded 2200 × 1350 WebP rendition of the Tobias Reich Heidelberg photograph listed above, using the Unsplash image service. `hero.webp`, by Aimar Gallardo, supplies the framed family-section image of a modern Berlin apartment building. It replaces the weathered Saarland building formerly shown there. Locations are illustrative, not claimed acquisition areas or company holdings.

Regional city coordinates were checked against the linked city reference pages on 1 November 2026. The SVG uses these coordinates with a schematic projection; the Rhine path is approximate. All labels also appear in an accessible HTML list. Markers represent cities, not GRI offices.

| City            | Latitude | Longitude | Reference                                          |
| --------------- | -------- | --------- | -------------------------------------------------- |
| Mönchengladbach | 51.200   | 6.433     | https://en.wikipedia.org/wiki/M%C3%B6nchengladbach |
| Viersen         | 51.25611 | 6.39722   | https://en.wikipedia.org/wiki/Viersen              |
| Korschenbroich  | 51.183   | 6.517     | https://en.wikipedia.org/wiki/Korschenbroich       |
| Krefeld         | 51.333   | 6.567     | https://en.wikipedia.org/wiki/Krefeld              |
| Düsseldorf      | 51.2256  | 6.7767    | https://en.wikipedia.org/wiki/D%C3%BCsseldorf      |
| Meerbusch       | 51.267   | 6.667     | https://en.wikipedia.org/wiki/Meerbusch            |
| Köln            | 50.93639 | 6.95278   | https://en.wikipedia.org/wiki/Cologne              |
