# The Common website preview

This Astro site is a public preview of The Common's proposed simpler website. The existing WordPress site at `thecommon.io` remains live. The approved design and content will be rebuilt in WordPress so Peter can edit it there.

## Pages

- Home: routes visitors to desk booking, memberships, meeting rooms, and contact.
- Day pass & hourly: links to the matching OfficeRnD booking pages.
- Membership: lists current desk plans and links to OfficeRnD's approval-based request flow.
- Meeting rooms: links to OfficeRnD room listings; private office and event inquiries go to Contact.
- About and Contact: short introduction, business details, and the existing HubSpot inquiry form.

Prices, terms, and OfficeRnD booking details can change. Check them against OfficeRnD before using this content in the WordPress rebuild. The HubSpot form fields are configured in HubSpot, not this repository.

## Local preview

```bash
npm ci
npm run dev
```

`npm run build` creates static files in `dist/`. Every push to `main` publishes a review copy at `https://thecommon-squamish.github.io/thecommon/`. The GitHub Pages workflow adjusts internal paths for that preview and builds with `PUBLIC_SITE_PREVIEW=true` so search engines are asked not to index it and preview visits do not enter the live site's Google Analytics property.

The site source lives in `src/pages/`, with shared navigation and footer in `src/components/`, shared styling in `src/styles/global.css`, and images in `public/img/`. Archived experiments are in `_archive/` and are not part of the site.

Do not point `thecommon.io` to this preview. The WordPress launch will need its own staging review, full backup of the current site, redirects from useful old URLs, and a final check of booking and contact flows.
