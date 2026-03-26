import { leadStatuses, leadTypes, type ISODateString } from "@moment4us/shared";
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
export declare function parseLead(input: unknown): Lead;
export declare function isLeadType(input: string): input is LeadType;
export declare function isLeadStatus(input: string): input is LeadStatus;
