import {
  leadStatuses,
  leadTypes,
  parseISODateString,
  type ISODateString,
} from "@moment4us/shared";
import { parseEmail, parseRecord, parseString } from "./parsers.js";

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
