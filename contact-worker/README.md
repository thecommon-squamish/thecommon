# Contact form to OfficeRnD

The Contact page keeps the existing HubSpot form until both public build variables are set. The replacement form sends inquiries through this Cloudflare Worker. The Worker checks Cloudflare Turnstile, finds or creates an OfficeRnD contact, and creates an open opportunity. The visitor's full message is saved in an OfficeRnD opportunity custom property.

## Account setup before cutover

1. In OfficeRnD, create a text custom property on opportunities for the visitor's original message. Record its API property key as `OFFICERND_MESSAGE_PROPERTY`.
2. Record The Common location ID and the open opportunity status ID. Set them as `OFFICERND_LOCATION_ID` and `OFFICERND_OPEN_STATUS_ID` in the Worker. Check that the status is the 10% open stage.
3. Create an OfficeRnD API application with only these scopes: `flex.community.members.read`, `flex.community.members.create`, and `flex.community.opportunities.create`. Store its client ID and secret as Worker secrets named `OFFICERND_CLIENT_ID` and `OFFICERND_CLIENT_SECRET`. Do not put either value in the Astro build, GitHub, or this repository.
4. Create a Cloudflare Turnstile widget for the preview and production hostnames. Store its secret as the Worker secret `TURNSTILE_SECRET_KEY`. The site key is public.
5. Deploy this Worker from `contact-worker/wrangler.toml`. Configure its allowed origins and OfficeRnD IDs for the environment. Put the Worker at a domain or route owned by The Common, such as `https://api.thecommon.io/contact`.
6. Set `PUBLIC_CONTACT_FORM_ENDPOINT` to the Worker contact URL and `PUBLIC_TURNSTILE_SITE_KEY` to the widget's public site key in the Astro build environment. When both are present, the new form replaces the HubSpot embed for that build.
7. Send a real test inquiry from the preview. Confirm the visitor sees success, the correct contact and open opportunity appear in OfficeRnD, and the complete message is readable there. Also test an invalid request and an already known email. Only then enable the new form on production and remove the HubSpot account dependency after any submissions you need are exported.

The Worker returns a failure to the browser if OfficeRnD does not confirm the opportunity. The page then tells the visitor to email `welcome@thecommon.io`; it never displays a false success. OfficeRnD notifications and the team's response workflow must be configured and verified separately. The Worker does not send an email alert by itself.

## Local checks

Run `node --test contact-worker/index.test.js` and `npm run build` from the repository root. For a visual check of the replacement form, start Astro with test build variables for the endpoint and site key. The Worker tests mock OfficeRnD and Turnstile; they do not constitute a live CRM write test.
