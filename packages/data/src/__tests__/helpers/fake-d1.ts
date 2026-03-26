import type {
  D1DatabaseLike,
  D1PreparedStatementLike,
  D1RunResult,
  D1Value,
} from "../../d1/client.js";

type TableName =
  | "site_pages"
  | "portfolio_projects"
  | "portfolio_images"
  | "blog_posts"
  | "leads"
  | "admin_users";

type FakeRow = Record<string, unknown>;

interface FakeDatabaseState {
  site_pages: FakeRow[];
  portfolio_projects: FakeRow[];
  portfolio_images: FakeRow[];
  blog_posts: FakeRow[];
  leads: FakeRow[];
  admin_users: FakeRow[];
}

export interface FakeD1Database extends D1DatabaseLike {
  insert(table: TableName, row: FakeRow): void;
  table<T extends FakeRow>(table: TableName): T[];
}

export function createFakeD1Database(): FakeD1Database {
  const state: FakeDatabaseState = {
    site_pages: [],
    portfolio_projects: [],
    portfolio_images: [],
    blog_posts: [],
    leads: [],
    admin_users: [],
  };

  return {
    prepare(query: string): D1PreparedStatementLike {
      return createPreparedStatement(state, query);
    },
    insert(table: TableName, row: FakeRow): void {
      upsertRow(state[table], row, primaryKeyForTable(table));
    },
    table<T extends FakeRow>(table: TableName): T[] {
      return state[table].map((row) => ({ ...row })) as T[];
    },
  };
}

function createPreparedStatement(
  state: FakeDatabaseState,
  query: string,
  boundValues: readonly D1Value[] = [],
): D1PreparedStatementLike {
  const normalizedQuery = normalizeSql(query);

  return {
    bind(...values: D1Value[]): D1PreparedStatementLike {
      return createPreparedStatement(state, query, values);
    },
    async first<T = Record<string, unknown>>(): Promise<T | null> {
      const rows = executeSelect(state, normalizedQuery, boundValues);
      return (rows[0] ?? null) as T | null;
    },
    async all<T = Record<string, unknown>>(): Promise<{ results: T[] }> {
      return {
        results: executeSelect(state, normalizedQuery, boundValues) as T[],
      };
    },
    async run(): Promise<D1RunResult> {
      executeMutation(state, normalizedQuery, boundValues);
      return { success: true };
    },
  };
}

function executeSelect(
  state: FakeDatabaseState,
  normalizedQuery: string,
  values: readonly D1Value[],
): FakeRow[] {
  if (normalizedQuery.includes("from site_pages") && normalizedQuery.includes("where slug = ?")) {
    const slug = values[0];
    return state.site_pages.filter(
      (row) => row.slug === slug && Number(row.published ?? 0) === 1,
    );
  }

  if (
    normalizedQuery.includes("from portfolio_projects") &&
    normalizedQuery.includes("where featured = 1")
  ) {
    const limit = Number(values[0] ?? 0);
    return [...state.portfolio_projects]
      .filter((row) => Number(row.featured ?? 0) === 1)
      .sort((left, right) => String(right.published_at).localeCompare(String(left.published_at)))
      .slice(0, limit);
  }

  if (
    normalizedQuery.includes("from portfolio_projects") &&
    normalizedQuery.includes("where slug = ?")
  ) {
    const slug = values[0];
    return state.portfolio_projects.filter((row) => row.slug === slug).slice(0, 1);
  }

  if (
    normalizedQuery.includes("from portfolio_images") &&
    normalizedQuery.includes("where project_slug = ?")
  ) {
    const slug = values[0];
    return [...state.portfolio_images]
      .filter((row) => row.project_slug === slug)
      .sort((left, right) => Number(left.sort_order ?? 0) - Number(right.sort_order ?? 0))
      .map((row) => ({ image_id: row.image_id }));
  }

  if (normalizedQuery.includes("from blog_posts") && normalizedQuery.includes("where slug = ?")) {
    const slug = values[0];
    return state.blog_posts.filter((row) => row.slug === slug).slice(0, 1);
  }

  if (normalizedQuery.includes("from blog_posts") && normalizedQuery.includes("order by published_at desc")) {
    const limit = Number(values[0] ?? 0);
    return [...state.blog_posts]
      .sort((left, right) => String(right.published_at).localeCompare(String(left.published_at)))
      .slice(0, limit);
  }

  throw new Error(`Unsupported fake D1 SELECT query: ${normalizedQuery}`);
}

function executeMutation(
  state: FakeDatabaseState,
  normalizedQuery: string,
  values: readonly D1Value[],
): void {
  if (normalizedQuery.startsWith("insert or replace into site_pages")) {
    upsertRow(
      state.site_pages,
      {
        slug: values[0],
        title: values[1],
        seo_title: values[2],
        seo_description: values[3],
        hero: values[4],
        sections_json: values[5],
        published: values[6],
        seo_json: values[7],
        created_at: values[8],
        updated_at: values[9],
      },
      "slug",
    );
    return;
  }

  if (normalizedQuery.startsWith("insert into leads")) {
    insertRow(state.leads, {
      id: values[0],
      type: values[1],
      name: values[2],
      email: values[3],
      phone: values[4],
      service_type: values[5],
      event_date: values[6],
      message: values[7],
      status: values[8],
      created_at: values[9],
      updated_at: values[10],
    });
    return;
  }

  throw new Error(`Unsupported fake D1 mutation query: ${normalizedQuery}`);
}

function normalizeSql(query: string): string {
  return query.trim().replace(/\s+/g, " ").toLowerCase();
}

function upsertRow(rows: FakeRow[], row: FakeRow, primaryKey: string): void {
  const index = rows.findIndex((candidate) => candidate[primaryKey] === row[primaryKey]);

  if (index === -1) {
    rows.push({ ...row });
    return;
  }

  rows[index] = { ...row };
}

function insertRow(rows: FakeRow[], row: FakeRow): void {
  const id = row.id;

  if (rows.some((candidate) => candidate.id === id)) {
    throw new Error("UNIQUE constraint failed: leads.id");
  }

  rows.push({ ...row });
}

function primaryKeyForTable(table: TableName): string {
  switch (table) {
    case "site_pages":
    case "portfolio_projects":
    case "blog_posts":
      return "slug";
    case "portfolio_images":
      return "id";
    case "leads":
    case "admin_users":
      return "id";
  }
}
