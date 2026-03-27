import { parseLead, type Lead, type LeadStatus, type LeadType } from "@moment4us/content";
import { leadStatuses, parseISODateString, type ISODateString } from "@moment4us/shared";

import { ensureD1Client, type D1Client, type D1DatabaseLike } from "../d1/client.js";

const INSERT_LEAD_SQL = `
  INSERT INTO leads (
    id,
    type,
    name,
    email,
    phone,
    service_type,
    event_date,
    message,
    status,
    created_at,
    updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const SELECT_ALL_LEADS_SQL = `
  SELECT id, type, name, email, phone, service_type, event_date, message, status, created_at, updated_at
  FROM leads
  ORDER BY created_at DESC
`;

const UPDATE_LEAD_STATUS_SQL = `
  UPDATE leads
  SET status = ?, updated_at = ?
  WHERE id = ?
`;

const COUNT_LEADS_SQL = `
  SELECT COUNT(*) as total FROM leads
`;

const COUNT_LEADS_BY_STATUS_SQL = `
  SELECT status, COUNT(*) as count
  FROM leads
  GROUP BY status
`;

interface LeadRow {
  id: string;
  type: string;
  name: string;
  email: string;
  phone: string | null;
  service_type: string;
  event_date: string | null;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface LeadCountByStatusRow {
  status: string;
  count: number;
}

interface LeadCountRow {
  total: number;
}

export interface CreateLeadInput {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  eventDate?: ISODateString;
  message: string;
}

export interface LeadStatusCount {
  status: LeadStatus;
  count: number;
}

export interface LeadsRepository {
  createLead(input: CreateLeadInput): Promise<Lead>;
  listLeads(): Promise<Lead[]>;
  updateLeadStatus(id: string, status: LeadStatus): Promise<void>;
  countLeads(): Promise<number>;
  countLeadsByStatus(): Promise<LeadStatusCount[]>;
}

export interface LeadRepositoryOptions {
  createId?: () => string;
  now?: () => ISODateString;
}

export function createLeadsRepository(
  input: D1Client | D1DatabaseLike,
  options: LeadRepositoryOptions = {},
): LeadsRepository {
  const client = ensureD1Client(input);
  const createId = options.createId ?? defaultCreateId;
  const now = options.now ?? defaultNow;

  return {
    async createLead(input: CreateLeadInput): Promise<Lead> {
      const timestamp = parseISODateString(now(), "lead.createdAt");
      const leadRecord = {
        id: createId(),
        type: input.type,
        name: input.name,
        email: input.email,
        serviceType: input.serviceType,
        message: input.message,
        status: "new" as const,
        createdAt: timestamp,
      };

      if (input.phone !== undefined) {
        Object.assign(leadRecord, { phone: input.phone });
      }

      if (input.eventDate !== undefined) {
        Object.assign(leadRecord, {
          eventDate: parseISODateString(input.eventDate, "lead.eventDate"),
        });
      }

      const lead = parseLead(leadRecord);

      await client.run(INSERT_LEAD_SQL, [
        lead.id,
        lead.type,
        lead.name,
        lead.email,
        lead.phone ?? null,
        lead.serviceType,
        lead.eventDate ?? null,
        lead.message,
        lead.status,
        lead.createdAt,
        lead.createdAt,
      ]);

      return lead;
    },

    async listLeads(): Promise<Lead[]> {
      const rows = await client.all<LeadRow>(SELECT_ALL_LEADS_SQL);
      return rows.map(mapLeadRow);
    },

    async updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
      if (typeof id !== "string" || id.trim().length === 0) {
        throw new Error("lead id must be a non-empty string");
      }

      if (!(leadStatuses as readonly string[]).includes(status)) {
        throw new Error(`lead status must be one of: ${leadStatuses.join(", ")}`);
      }

      const timestamp = now();
      await client.run(UPDATE_LEAD_STATUS_SQL, [status, timestamp, id]);
    },

    async countLeads(): Promise<number> {
      const row = await client.first<LeadCountRow>(COUNT_LEADS_SQL);
      return row?.total ?? 0;
    },

    async countLeadsByStatus(): Promise<LeadStatusCount[]> {
      const rows = await client.all<LeadCountByStatusRow>(COUNT_LEADS_BY_STATUS_SQL);
      return rows
        .filter((row) => (leadStatuses as readonly string[]).includes(row.status))
        .map((row) => ({ status: row.status as LeadStatus, count: row.count }));
    },
  };
}

function mapLeadRow(row: LeadRow): Lead {
  const record: Record<string, unknown> = {
    id: row.id,
    type: row.type,
    name: row.name,
    email: row.email,
    serviceType: row.service_type,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };

  if (row.phone !== null) {
    record.phone = row.phone;
  }

  if (row.event_date !== null) {
    record.eventDate = row.event_date;
  }

  return parseLead(record);
}

function defaultCreateId(): string {
  return `lead_${createCryptographicId()}`;
}

function defaultNow(): ISODateString {
  return new Date().toISOString();
}

function createCryptographicId(): string {
  const cryptoObject = globalThis.crypto;

  if (cryptoObject?.randomUUID !== undefined) {
    return cryptoObject.randomUUID();
  }

  if (cryptoObject?.getRandomValues === undefined) {
    throw new Error("secure crypto API is required to generate lead ids");
  }

  const bytes = cryptoObject.getRandomValues(new Uint8Array(16));
  const byte6 = bytes.at(6);
  const byte8 = bytes.at(8);

  if (byte6 === undefined || byte8 === undefined) {
    throw new Error("secure crypto API returned insufficient random bytes");
  }

  bytes[6] = (byte6 & 0x0f) | 0x40;
  bytes[8] = (byte8 & 0x3f) | 0x80;

  return [
    toHex(bytes.subarray(0, 4)),
    toHex(bytes.subarray(4, 6)),
    toHex(bytes.subarray(6, 8)),
    toHex(bytes.subarray(8, 10)),
    toHex(bytes.subarray(10, 16)),
  ].join("-");
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const leadsSql = {
  insertLead: INSERT_LEAD_SQL,
  selectAllLeads: SELECT_ALL_LEADS_SQL,
  updateLeadStatus: UPDATE_LEAD_STATUS_SQL,
  countLeads: COUNT_LEADS_SQL,
  countLeadsByStatus: COUNT_LEADS_BY_STATUS_SQL,
} satisfies Record<string, string>;
