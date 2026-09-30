# DSM Atlas Design Contract

<!-- impeccable:design-schema 1 -->

## Direction

**Atlas Guiado** treats the current semester as a readable transit map. A discipline is a named colored line, each material is a station, and the filled lime station marks the point to resume. Text always accompanies the cartographic marks. The interface is an academic tool, not official Fatec material, and makes no institutional endorsement claim.

## Color

| Token | Value | Role |
|---|---:|---|
| Ink | `#18211a` | Primary text, rules, controls |
| Ink soft | `#596259` | Secondary text on paper |
| Paper | `#f5f1e5` | Main technical-paper surface |
| Paper raised | `#fffdf7` | Search, labels, detail rail |
| Paper muted | `#e9e5d9` | Browser chrome and quiet states |
| Grid | `#d6d2c6` | 32 px cartographic grid |
| Route blue | `#4f66e8` | Current semester and active route |
| Progress lime | `#d8ff57` | Progress and resume position |
| Recent coral | `#ff7550` | Recent material or attention |
| Crossing yellow | `#ffd85a` | Crossing discipline route |
| Language green | `#8dc3b0` | ING1 route |

Body copy on paper must reach WCAG AA. White text appears only on ink or route blue. Selection uses ink over paper; focus always uses a 3 px route-blue outline with a 3 px offset, independent of color scheme.

## Typography

Self-host every font in `atlas/public/fonts`; the app must make no runtime font request.

- **Archivo variable:** display headings and the DSM Atlas wordmark. Headlines are compact, weight 520–780, line-height 0.92–1, and tracking never tighter than `-0.04em`.
- **IBM Plex Sans:** body, labels with sentence casing, metadata, and controls.
- **IBM Plex Mono:** route codes, compact utilities, progress, and semester tabs. It is reserved for data-like text rather than used as decoration.
- Body measure stays within 65–75 characters. Heading levels do not skip. No eyebrow appears above a heading.

## Grid and Composition

The page uses a 32 px square grid on technical paper. The top bar and semester rail are full-width ruled bands. The opening heading is followed directly by the workspace: map on the left, selected-discipline rail on the right. At widths below 896 px, the rail follows the map. At 390 px, the first three semester tabs remain visible, search moves below the brand row, and the add-material action keeps its accessible name while showing the authored plus mark.

The map/list pair is one information model. Every named route and station in the visual map must have equivalent text in the DOM or list view. The permanent legend reads: line = discipline, station = material, filled station = current position.

## Borders and Depth

Rules are square, one or two pixels, and use ink. Controls use a 2 px maximum radius; only route rails and station markers are circular. Elevation does not define the shell. Block shadows, glow stacks, glass panels, and bordered cards under soft shadows are forbidden.

## Motion

One 820 ms entrance draws route dashes with `cubic-bezier(0.16, 1, 0.3, 1)`. The current-position label settles once. Hover and focus may change color or enlarge a station over 140 ms. Content is visible before JavaScript. Under `prefers-reduced-motion: reduce`, displacement, route drawing, smooth scrolling, and transitions become effectively instant.

## Browser Surfaces

Selection, caret, scrollbar, focus rings, underline offset, and tabular progress numerals use the palette. Keyboard focus must never depend on light or dark browser preference. A skip link is the first focusable element and becomes visible on focus.

## Forbidden Patterns

- No eyebrow or kicker above a heading.
- No generic dashboard card grid, excessive radii, gradient text, decorative blur, ambient particles, or continuous motion.
- No hard block shadows or decorative zero-offset halos.
- No emoji or Unicode glyph standing in for icons; use authored SVG or CSS geometry.
- No map-only navigation; preserve equivalent names and relationships in accessible text and the list mode.
- No invented metrics, testimonials, Fatec mark, or Fatec endorsement.
