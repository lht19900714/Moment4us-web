import { parseLead, type Lead, type LeadType } from "@moment4us/content";
import { parseISODateString, type ISODateString } from "@moment4us/shared";

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

export interface CreateLeadInput {
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  eventDate?: ISODateString;
  message: string;
}

export interface LeadsRepository {
  createLead(input: CreateLeadInput): Promise<Lead>;
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
  };
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
} satisfies Record<string, string>;
