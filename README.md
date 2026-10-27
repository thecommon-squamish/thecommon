# The Common website redesign

This Astro repository is the review version of The Common's proposed website. The current WordPress site at `thecommon.io` and Sally's unused WordPress site at `dev.thecommon.io` remain separate. This repository does not change either of them. Both WordPress installations were inventoried on 2026-10-27 through the existing CanSpace session and their published pages were compared with this site.

## Direction

- Lead with booking: room, desk, then ongoing membership or private office.
- Use the approved photography and walkthrough video to show the real space.
- Keep the story of The Common, its Squamish community, and its social capital roots on dedicated pages.
- Send visitors to the matching OfficeRnD resource page for each bookable room. The indoor phone booth is for short calls; it is not sold as a room.
- Treat OfficeRnD as the source of truth for live availability and prices. Membership requests may still require approval.

## Pages

- `/` — direct booking choices, an introduction to the space, and the walkthrough.
- `/spaces/` — Micro Office, Trailer, and Small Conference Room, each linked to its own OfficeRnD listing.
- `/day-pass/` — day pass and hourly desk links.
- `/membership/` — monthly desk plans and a private office inquiry route.
- `/about/` and `/community/` — the original site's purpose, people, and community work.
- `/event-space/` — an inquiry path for larger gatherings, using the dev site's event intent without its stale pricing.
- `/faq/` — booking, arrival, calls, dogs, kitchen, and invoices, based on the live site's visitor guidance.
- `/contact/` — address and inquiry form.

## Source integration

- **Live WordPress:** Six published pages and five historical posts were inventoried. The booking and visitor guidance, 2017 founding story, community programs, events history, and practical amenities have been incorporated where they still help visitors. The site's 2018 contest, April Fools outdoor-office page, old upgrade log, and older promotions are historical material, not current offers.
- **Dev WordPress:** Ten published pages were inventoried. Its custom theme uses a black/white base, coral accent, Squamish landscape imagery, and four intent-led routes. The site now uses its local imagery, visual accent, community line, and direct routes for work, meetings, events, and help. Several dev inner pages contain placeholder text; its 2022 pricing form is out of date and is not carried over.
- **Current booking system:** Direct OfficeRnD links remain the operational source for room and desk availability. Do not replace them with dev WordPress form links.
- **Measurement:** The production site will record clicks from Astro into OfficeRnD as `booking_click` events in the existing Google Analytics property. Preview traffic is excluded. Completed bookings require a separate OfficeRnD/analytics integration and are not inferred from clicks.

### Proposed redirects at cutover

| Old path | New path |
| --- | --- |
| `/faqs-meeting-rooms-dogs/` and `/frequently-asked-questions/` | `/faq/` |
| `/community_grant/` | `/community/` |
| `/drop-in-bookings/` | `/day-pass/` |
| `/individual-memberships/`, `/membership-teams/`, `/memberships/` | `/membership/` |
| `/event-venue/` | `/event-space/` |
| `/about-the-common/` | `/about/` |
| `/contact-us/` | `/contact/` |

Preserve the five old `/news/` URLs in a dated archive or redirect them only after Peter decides whether those historical stories should remain public. The live `/jobs/` posting also needs a current hiring decision before cutover. Do not redirect the April Fools `/outdoors/` page to a bookable outdoor office.

## Local review

```bash
npm ci
npm run dev
npm run build
```

The public GitHub Pages preview is a review copy. It does not replace `thecommon.io`.

## Before launch

1. Review the design, room descriptions, story, and community page with Peter. Confirm which monthly private offices and event bookings should be available online, and whether the historical grant programs or job post are active.
2. Confirm OfficeRnD inventory, room capacities, terms, day pass details, and the desired approval rules. Its day pass description currently contains conflicting meeting-credit amounts; the website deliberately omits that claim.
3. Review the Astro preview as the proposed replacement, then take a current-site backup and prepare the domain cutover. If Peter requests WordPress instead, the approved design can be implemented there after review.
4. Implement and test the URL redirects when the domain switches, so existing bookmarks and search links still work.
5. Check booking, contact, video, mobile layout, accessibility, and analytics on the staging domain before switching the main domain.

Source pages are in `src/pages/`, shared layout in `src/layouts/`, styles in `src/styles/`, and approved images and video in `public/`.
