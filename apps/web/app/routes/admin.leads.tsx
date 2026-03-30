import { useFetcher, useLoaderData, type ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "react-router";

import { type LeadStatus } from "@moment4us/content";
import { leadStatuses } from "@moment4us/shared";
import { createLeadsRepository, type D1DatabaseLike } from "@moment4us/data";

interface CloudflareContext {
  cloudflare?: {
    env?: {
      DB?: D1DatabaseLike;
    };
  };
}

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone: string | undefined;
  serviceType: string;
  message: string;
  status: string;
  createdAt: string;
  eventDate: string | undefined;
}

interface LeadsLoaderData {
  leads: LeadItem[];
}

export async function loader({ context }: LoaderFunctionArgs): Promise<LeadsLoaderData> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB;

  if (!db) {
    return { leads: [] };
  }

  const repo = createLeadsRepository(db);
  const leads = await repo.listLeads();

  return {
    leads: leads.map((lead) => ({
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      serviceType: lead.serviceType,
      message: lead.message,
      status: lead.status,
      createdAt: lead.createdAt,
      eventDate: lead.eventDate,
    })),
  };
}

interface LeadActionResult {
  ok: boolean;
  error?: string;
}

export async function action({ request, context }: ActionFunctionArgs): Promise<LeadActionResult> {
  const cfContext = context as CloudflareContext;
  const db = cfContext?.cloudflare?.env?.DB;

  if (!db) {
    return { ok: false, error: "Database not configured." };
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return { ok: false, error: "Unable to process the form." };
  }

  const id = formData.get("id");
  const status = formData.get("status");

  if (typeof id !== "string" || id.length === 0) {
    return { ok: false, error: "Inquiry ID is required." };
  }

  if (typeof status !== "string" || !(leadStatuses as readonly string[]).includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const repo = createLeadsRepository(db);
  await repo.updateLeadStatus(id, status as LeadStatus);

  return { ok: true };
}

export const meta: MetaFunction = () => [{ title: "Inquiry | Admin | Moment4us" }];

function formatDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return isoDate;
  }
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: "New",
    contacted: "Contacted",
    qualified: "Qualified",
    closed: "Closed",
  };
  return labels[status] ?? status;
}

export default function AdminLeadsRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="admin-leads">
      <h1 className="admin-page-title">Inquiry</h1>
      <p className="admin-page-subtitle">{data.leads.length} total inquiries</p>

      {data.leads.length === 0 ? (
        <p className="admin-empty">No inquiries yet.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Message</th>
                <th>Preferred Date</th>
                <th>Submitted</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.leads.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LeadRow({ lead }: { lead: LeadItem }) {
  const fetcher = useFetcher<LeadActionResult>();

  return (
    <tr>
      <td>{lead.name}</td>
      <td>
        <a href={`mailto:${lead.email}`} className="admin-link">
          {lead.email}
        </a>
      </td>
      <td>{lead.phone || "—"}</td>
      <td>{lead.serviceType}</td>
      <td className="admin-leads__message">{lead.message}</td>
      <td>{lead.eventDate ? formatDate(lead.eventDate) : "—"}</td>
      <td>{formatDate(lead.createdAt)}</td>
      <td>
        <span className={`admin-badge admin-badge--${lead.status}`}>
          {statusLabel(lead.status)}
        </span>
      </td>
      <td>
        <fetcher.Form method="post">
          <input type="hidden" name="id" value={lead.id} />
          <select
            name="status"
            defaultValue={lead.status}
            onChange={(e) => {
              const form = e.currentTarget.form;
              if (form) {
                fetcher.submit(form);
              }
            }}
            className="admin-select"
          >
            {leadStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        </fetcher.Form>
      </td>
    </tr>
  );
}
