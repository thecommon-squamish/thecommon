# The Common theme integration review

## Creative audit and research

The existing site already has the right architecture: rooms, desks, memberships, events, story, community, help, and direct booking paths. Its strongest visual assets are photographs of the actual space, the view toward Cleveland Avenue, Peter's local story, and the vintage keycap artwork. The weak point was the connection between these elements. Photo treatments, panels, dividers, and labels varied by page, and keycaps were being applied to reading links and FAQ questions as if every interaction had the same weight.

The Common's current site describes a community built around connections between people and organizations, with flexible memberships and a downtown Squamish location. The Downtown Squamish BIA describes it as a boutique space with a varied local professional community. Nearby Aligned Collective likewise speaks to freelancers, independent owners, and newcomers who need a place to work. Working From_ by The Hoxton demonstrates how a workspace can present comfort and productivity together. These are reference principles, not content or designs to copy. No amenities, prices, availability, or testimonials were inferred from them.

Sources: [The Common](https://www.thecommon.io/), [Downtown Squamish BIA](https://www.downtownsquamish.com/explore/the-common/), [Aligned Collective](https://www.alignedcollective.ca/), [Working From_](https://workingfrom.com/faqs/).

## Design direction

The digital workspace uses three recurring elements: warm paper surfaces, compact office index labels with a small terracotta marker, and the established photographed keycaps for decisions. Fir green ties the details to the existing brand. Light rules organize information like a desk directory. Body copy remains ordinary sans serif. Monospace appears only in labels, data, and keycap legends. Real photographs remain the visual center, with softer and more consistent shadows. There are no new illustrations, generic mountain graphics, stock imagery, or dependencies.

Keycaps mean “take action.” Plain reading links are underlined. FAQ questions are numbered directory rows. Hover and focus feedback remain clear; reduced motion removes nonessential transitions. The Squamish connection comes from the actual address, local story, community images, and existing landscape photograph rather than adventure graphics.

## Page audit and implementation priority

| Page | Purpose and audience | Existing strength | Issue and theme response | Priority |
| --- | --- | --- | --- | --- |
| Home | Help first-time visitors choose a booking route | Hero, real workspace, four direct routes | Shared label, rule, and photo system; keep decisions prominent | Essential |
| Rooms | Compare bookable spaces | Large room photos and direct OfficeRnD links | Fir rule and consistent photo depth; preserve room scale and copy | Essential |
| Desks | Explain day and hourly use | Direct desk path | Apply shared heading, labels, and action hierarchy | Essential |
| Memberships | Explain regular desks and private offices | Plans and office feature | Paper-like plan surface and clearer labels; no invented availability | Essential |
| Events | Invite group inquiries | Event photography and inquiry path | Shared office labels and photo depth; preserve lively collage | Supporting |
| Our story | Explain Peter's motivation | Local voice and history | Shared typography and section structure; keep narrative dominant | Supporting |
| Community | Show local relationships | Original programs and stories | Same visual system without decorative overload | Supporting |
| FAQs | Answer practical questions | Useful content and booking links | Replace oversized keycap questions with numbered directory rows | Essential |
| Contact | Help visitors find and reach the space | Address and clean storefront image | Shared heading, photo, and action language | Essential |
| First weeks | Preserve original writing | Historic narrative | Let prose lead; shared labels and colours only | Supporting |
| Community programs | Preserve original writing | Historic narrative | Let prose lead; shared labels and colours only | Supporting |

Optional later work: a separate content and asset provenance review for event imagery and a photo by photo art direction pass. These are separate from the theme's shared visual system.

## Implementation and validation

The theme is implemented in `src/styles/theme.css`, imported last by `src/layouts/Base.astro`. This leaves page architecture and the keycap artwork intact and makes the change easy to revert. The stylesheet updates shared colours, section rules, labels, card and plan surfaces, dropdowns, photo shadows, reading links, and FAQ rows. No JavaScript or package dependency was added. Booking destinations and business copy were left intact.

Validation: Astro built all 11 routes. Browser inspection covered the homepage at desktop, tablet, and mobile widths, plus Rooms, Memberships, Events, and FAQs on mobile. No horizontal overflow or broken loaded images appeared in those checks. The mobile menu opened, and the bookable room links remained present. The FAQ refinement was visually checked after implementation. The full site still needs normal editorial review and a production launch check before replacing `www.thecommon.io`.
