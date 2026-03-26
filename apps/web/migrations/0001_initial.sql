CREATE TABLE IF NOT EXISTS site_pages (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  seo_title TEXT NOT NULL,
  seo_description TEXT NOT NULL,
  hero TEXT NOT NULL,
  sections_json TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 0 CHECK (published IN (0, 1)),
  seo_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_projects (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  summary TEXT NOT NULL,
  story TEXT NOT NULL,
  featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
  published_at TEXT NOT NULL,
  seo_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio_images (
  id TEXT PRIMARY KEY,
  project_slug TEXT NOT NULL,
  image_id TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_slug) REFERENCES portfolio_projects(slug) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_portfolio_images_project_slug_sort_order
  ON portfolio_images(project_slug, sort_order);

CREATE TABLE IF NOT EXISTS blog_posts (
  slug TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  content TEXT NOT NULL,
  tags_json TEXT NOT NULL,
  published_at TEXT NOT NULL,
  seo_json TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('contact', 'booking')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT NOT NULL,
  event_date TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('new', 'contacted', 'qualified', 'closed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_status_created_at
  ON leads(status, created_at DESC);

CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
