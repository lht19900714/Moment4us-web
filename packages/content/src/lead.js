import { leadStatuses, leadTypes, parseISODateString, } from "@moment4us/shared";
export function parseLead(input) {
    const value = parseRecord(input, "lead");
    const type = parseString(value.type, "lead.type");
    const status = parseString(value.status, "lead.status");
    if (!isLeadType(type)) {
        throw new Error(`lead.type must be one of: ${leadTypes.join(", ")}`);
    }
    if (!isLeadStatus(status)) {
        throw new Error(`lead.status must be one of: ${leadStatuses.join(", ")}`);
    }
    const lead = {
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
export function isLeadType(input) {
    return leadTypes.includes(input);
}
export function isLeadStatus(input) {
    return leadStatuses.includes(input);
}
function parseRecord(input, fieldName) {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
        throw new Error(`${fieldName} must be an object`);
    }
    return input;
}
function parseString(input, fieldName) {
    if (typeof input !== "string" || input.trim().length === 0) {
        throw new Error(`${fieldName} must be a non-empty string`);
    }
    return input;
}
function parseEmail(input, fieldName) {
    const value = parseString(input, fieldName);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(value)) {
        throw new Error(`${fieldName} must be a valid email`);
    }
    return value;
}
