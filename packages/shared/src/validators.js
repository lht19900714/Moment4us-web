const ISO_DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/;
export function isISODateString(input) {
    if (typeof input !== "string" || input.trim().length === 0) {
        return false;
    }
    if (ISO_DATE_ONLY_PATTERN.test(input)) {
        return isValidDateOnly(input);
    }
    if (ISO_DATE_TIME_PATTERN.test(input)) {
        return isValidDateTime(input);
    }
    return false;
}
export function parseISODateString(input, fieldName) {
    if (!isISODateString(input)) {
        throw new Error(`${fieldName} must be a valid ISO date string`);
    }
    return input;
}
export function parseSlugSegment(input, fieldName) {
    if (typeof input !== "string") {
        throw new Error(`${fieldName} must be a single path segment`);
    }
    const normalized = input.trim().replace(/^\/+|\/+$/g, "");
    if (normalized.length === 0 || normalized.includes("/")) {
        throw new Error(`${fieldName} must be a single path segment`);
    }
    return normalized;
}
function isValidDateOnly(input) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input);
    if (match === null) {
        return false;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    if (!isIntegerInRange(year, 0, 9999)) {
        return false;
    }
    return isValidCalendarDateParts(year, month, day);
}
function isValidDateTime(input) {
    const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{3}))?(Z|[+-]\d{2}:\d{2})$/.exec(input);
    if (match === null) {
        return false;
    }
    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const hour = Number(match[4]);
    const minute = Number(match[5]);
    const second = Number(match[6]);
    const millisecond = match[7] === undefined ? undefined : Number(match[7]);
    const timezone = match[8];
    if (!isIntegerInRange(year, 0, 9999)) {
        return false;
    }
    if (!isValidCalendarDateParts(year, month, day)) {
        return false;
    }
    if (!isIntegerInRange(hour, 0, 23)) {
        return false;
    }
    if (!isIntegerInRange(minute, 0, 59)) {
        return false;
    }
    if (!isIntegerInRange(second, 0, 59)) {
        return false;
    }
    if (millisecond !== undefined && !isIntegerInRange(millisecond, 0, 999)) {
        return false;
    }
    if (timezone === undefined) {
        return false;
    }
    return isValidTimezoneOffset(timezone);
}
function isValidCalendarDateParts(year, month, day) {
    if (!isIntegerInRange(month, 1, 12) || !isIntegerInRange(day, 1, 31)) {
        return false;
    }
    const date = new Date(Date.UTC(year, month - 1, day));
    return (date.getUTCFullYear() === year &&
        date.getUTCMonth() === month - 1 &&
        date.getUTCDate() === day);
}
function isValidTimezoneOffset(timezone) {
    if (timezone === "Z") {
        return true;
    }
    const match = /^([+-])(\d{2}):(\d{2})$/.exec(timezone);
    if (match === null) {
        return false;
    }
    const offsetHours = Number(match[2]);
    const offsetMinutes = Number(match[3]);
    return isIntegerInRange(offsetHours, 0, 23) && isIntegerInRange(offsetMinutes, 0, 59);
}
function isIntegerInRange(value, min, max) {
    return Number.isInteger(value) && value >= min && value <= max;
}
