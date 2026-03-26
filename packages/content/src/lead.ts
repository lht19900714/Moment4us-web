import {
  leadStatuses,
  leadTypes,
  parseISODateString,
  type ISODateString,
} from "@moment4us/shared";

export type LeadStatus = (typeof leadStatuses)[number];
export type LeadType = (typeof leadTypes)[number];

export interface Lead {
  id: string;
  type: LeadType;
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  eventDate?: ISODateString;
  message: string;
  status: LeadStatus;
  createdAt: ISODateString;
}

export function parseLead(input: unknown): Lead {
  const value = parseRecord(input, "lead");
  const type = parseString(value.type, "lead.type");
  const status = parseString(value.status, "lead.status");

  if (!isLeadType(type)) {
    throw new Error(`lead.type must be one of: ${leadTypes.join(", ")}`);
  }

  if (!isLeadStatus(status)) {
    throw new Error(`lead.status must be one of: ${leadStatuses.join(", ")}`);
  }

  const lead: Lead = {
    id: parseString(value.id, "lead.id"),
    type,
    name: parseString(value.name, "lead.name"),
    email: parseEmail(value.email, "lead.email"),
    serviceType: parseString(value.serviceType, "lead.serviceType"),
    message: parseString(value.message, "lead.message"),
    status,
    createdAt: parseISODateString(value.createdAt, "lead.createdAt"),
  };

  if (value.phone !== undefined) {
    lead.phone = parseString(value.phone, "lead.phone");
  }

  if (value.eventDate !== undefined) {
    lead.eventDate = parseISODateString(value.eventDate, "lead.eventDate");
  }

  return lead;
}

export function isLeadType(input: string): input is LeadType {
  return (leadTypes as readonly string[]).includes(input);
}

export function isLeadStatus(input: string): input is LeadStatus {
  return (leadStatuses as readonly string[]).includes(input);
}

function parseRecord(input: unknown, fieldName: string): Record<string, unknown> {
  if (typeof input !== "object" || input === null || Array.isArray(input)) {
    throw new Error(`${fieldName} must be an object`);
  }

  return input as Record<string, unknown>;
}

function parseString(input: unknown, fieldName: string): string {
  if (typeof input !== "string" || input.trim().length === 0) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }

  return input;
}

function parseEmail(input: unknown, fieldName: string): string {
  const value = parseString(input, fieldName);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value)) {
    throw new Error(`${fieldName} must be a valid email`);
  }

  return value;
}
