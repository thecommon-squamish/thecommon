# The Common website redesign

This Astro repository is the review version of The Common's proposed website. The current WordPress site at `thecommon.io` and Sally's unused WordPress site at `dev.thecommon.io` remain separate. This repository does not change either of them.

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
- `/contact/` — address and inquiry form.

## Local review

```bash
npm ci
npm run dev
npm run build
```

The public GitHub Pages preview is a review copy. It does not replace `thecommon.io`.

## Before launch

1. Review the design, room descriptions, story, and community page with Peter. Confirm which monthly private offices and event bookings should be available online.
2. Confirm OfficeRnD inventory, room capacities, terms, day pass details, and the desired approval rules. Its day pass description currently contains conflicting meeting-credit amounts; the website deliberately omits that claim.
3. Decide whether the approved site will remain Astro or be rebuilt in WordPress. Either route needs a staging review, a current-site backup, and a cutover plan.
4. Inventory useful URLs from the live and dev sites. Move approved content into the new pages and redirect old URLs when the domain switches, so existing bookmarks and search links still work.
5. Check booking, contact, video, mobile layout, accessibility, and analytics on the staging domain before switching the main domain.

Source pages are in `src/pages/`, shared layout in `src/layouts/`, styles in `src/styles/`, and approved images and video in `public/`.
