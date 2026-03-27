# Contact Inquiry Form with Turnstile and Email Notification

## Goal

Replace the static contact page shell with a functional lead-capture inquiry form. The form collects client intent (name, email, event details, message), validates with Cloudflare Turnstile anti-spam, stores the lead in D1, and sends an email notification to the studio.

## Requirements

- Build a multi-field inquiry form on the `/contact` route
- Fields: name (required), email (required), phone (optional), event type (select), preferred date (optional), message (required)
- Client-side validation for required fields and email format
- Cloudflare Turnstile widget for spam protection
- React Router `action` handler to process form submission server-side
- Store submitted leads in D1 database (new `leads` table)
- Send email notification to studio email via Cloudflare Email Workers `send_email` binding
- Show success/error feedback after submission
- Accessible form with proper labels, error messages, and focus management
- Responsive design consistent with existing warm CSS design system

## Acceptance Criteria

- [ ] Contact page renders a styled inquiry form matching the site's visual language
- [ ] All required fields are validated client-side and server-side
- [ ] Turnstile widget renders and token is verified server-side before processing
- [ ] Valid submissions are persisted to D1 `leads` table
- [ ] Email notification is dispatched (graceful degradation if email binding is unavailable)
- [ ] User sees a success confirmation after valid submission
- [ ] User sees inline errors for invalid fields
- [ ] Form works without JavaScript (progressive enhancement via React Router action)
- [ ] Mobile-responsive layout
- [ ] No regression in existing routes

## Technical Notes

- Event types: Wedding, Family, Maternity, Newborn, Portrait, Branding, Other
- The `leads` table schema should align with `packages/content/src/lead.ts` type
- Turnstile site key should come from env (`TURNSTILE_SITE_KEY`), secret key from env (`TURNSTILE_SECRET_KEY`)
- Email recipient from env (`STUDIO_EMAIL`)
- For local dev without Turnstile/email bindings, form should still work (skip verification, skip email)
- Use existing `content-page` CSS patterns for form layout; add form-specific styles

## Out of Scope

- Admin dashboard to view/manage leads
- Auto-reply email to the submitter
- File upload (photos/mood boards)
- Calendar integration
