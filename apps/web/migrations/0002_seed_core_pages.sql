INSERT OR REPLACE INTO site_pages (
  slug,
  title,
  seo_title,
  seo_description,
  hero,
  sections_json,
  published,
  seo_json,
  created_at,
  updated_at
) VALUES
  (
    'home',
    'Moment4us',
    'Moment4us | Photography Studio',
    'Warm, authentic photography for real stories.',
    'Warm, authentic photography for real stories.',
    '[{"id":"featured-portfolio","heading":"Featured stories","body":"A preview of the wedding, family, and portrait stories we document."},{"id":"services-snapshot","heading":"Thoughtful coverage","body":"Photography sessions shaped around calm pacing, clear guidance, and real moments."}]',
    1,
    '{"title":"Moment4us | Photography Studio","description":"Warm, authentic photography for real stories.","canonicalPath":"/"}',
    '2026-03-26T00:00:00Z',
    '2026-03-26T00:00:00Z'
  ),
  (
    'about',
    'About',
    'About Moment4us',
    'Learn about the values and approach behind Moment4us.',
    'We document real connection with a calm, human-centered process.',
    '[{"id":"mission","heading":"Why we photograph this way","body":"We care about honest storytelling, emotional detail, and making people feel comfortable in front of the camera."}]',
    1,
    '{"title":"About Moment4us","description":"Learn about the values and approach behind Moment4us.","canonicalPath":"/about"}',
    '2026-03-26T00:00:00Z',
    '2026-03-26T00:00:00Z'
  ),
  (
    'services',
    'Services',
    'Photography Services',
    'Explore wedding, portrait, and family photography services.',
    'Coverage designed for weddings, portraits, and everyday milestones.',
    '[{"id":"offerings","heading":"Session types","body":"Wedding days, engagements, family sessions, and editorial portrait work with clear preparation and delivery."}]',
    1,
    '{"title":"Photography Services","description":"Explore wedding, portrait, and family photography services.","canonicalPath":"/services"}',
    '2026-03-26T00:00:00Z',
    '2026-03-26T00:00:00Z'
  ),
  (
    'contact',
    'Contact',
    'Contact Moment4us',
    'Start the conversation for your upcoming session or event.',
    'Tell us about your plans and we will follow up with availability and next steps.',
    '[{"id":"inquiry","heading":"Start your inquiry","body":"Share your date, location, and the kind of story you want documented."}]',
    1,
    '{"title":"Contact Moment4us","description":"Start the conversation for your upcoming session or event.","canonicalPath":"/contact"}',
    '2026-03-26T00:00:00Z',
    '2026-03-26T00:00:00Z'
  );
