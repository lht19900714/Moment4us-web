export type D1Value = string | number | null;

export interface D1RunResult {
  success: boolean;
}

export interface D1PreparedStatementLike {
  bind(...values: D1Value[]): D1PreparedStatementLike;
  first<T = Record<string, unknown>>(): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] } | T[]>;
  run(): Promise<D1RunResult>;
}

export interface D1DatabaseLike {
  prepare(query: string): D1PreparedStatementLike;
}

export interface D1Client {
  first<T>(query: string, params?: readonly D1Value[]): Promise<T | null>;
  all<T>(query: string, params?: readonly D1Value[]): Promise<T[]>;
  run(query: string, params?: readonly D1Value[]): Promise<D1RunResult>;
}

export function createD1Client(database: D1DatabaseLike): D1Client {
  return {
    async first<T>(query: string, params: readonly D1Value[] = []): Promise<T | null> {
      return bind(database.prepare(query), params).first<T>();
    },
    async all<T>(query: string, params: readonly D1Value[] = []): Promise<T[]> {
      const result = await bind(database.prepare(query), params).all<T>();
      return Array.isArray(result) ? result : result.results;
    },
    run(query: string, params: readonly D1Value[] = []): Promise<D1RunResult> {
      return bind(database.prepare(query), params).run();
    },
  };
}

export function ensureD1Client(input: D1Client | D1DatabaseLike): D1Client {
  return isD1Client(input) ? input : createD1Client(input);
}

function isD1Client(input: D1Client | D1DatabaseLike): input is D1Client {
  return "first" in input && "all" in input && "run" in input;
}

function bind(
  statement: D1PreparedStatementLike,
  params: readonly D1Value[],
): D1PreparedStatementLike {
  return params.length === 0 ? statement : statement.bind(...params);
}
