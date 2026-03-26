interface LeadNotificationInput {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  eventDate?: string;
  message: string;
}

export function formatLeadNotificationText(input: LeadNotificationInput): string {
  const lines = [
    "New Contact Inquiry",
    "===================",
    "",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
  ];

  if (input.phone) {
    lines.push(`Phone: ${input.phone}`);
  }

  lines.push(`Service Type: ${input.serviceType}`);

  if (input.eventDate) {
    lines.push(`Preferred Date: ${input.eventDate}`);
  }

  lines.push("", "Message:", input.message);

  return lines.join("\n");
}
