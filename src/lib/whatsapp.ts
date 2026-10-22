export interface EnquiryData {
  name: string;
  email: string;
  phone?: string | null;
  business_name: string;
  website_type: string;
  pages?: string | null;
  budget?: string | null;
  details: string;
}

export const DEFAULT_WHATSAPP_NUMBER = "919463737763";

export const DEFAULT_WHATSAPP_GREETING =
  "Hello! I visited your website and I'm interested in getting a custom website built for my business. Please share the details and pricing.";

/**
 * Builds the exact message requested:
 * "Hello! I just submitted the inquiry form on your website and I'm interested in getting a custom website built. Please share the details and pricing."
 * along with all user-filled form details formatted cleanly.
 */
export function buildEnquiryWhatsAppMessage(data: EnquiryData): string {
  const lines: string[] = [
    "Hello! I just submitted the inquiry form on your website and I'm interested in getting a custom website built. Please share the details and pricing.",
    "",
    "📋 *My Project & Inquiry Details:*",
    `• *Name:* ${data.name.trim()}`,
    `• *Business / Brand:* ${data.business_name.trim()}`,
    `• *Email:* ${data.email.trim()}`,
  ];

  if (data.phone && data.phone.trim()) {
    lines.push(`• *Phone / WhatsApp:* ${data.phone.trim()}`);
  }

  lines.push(`• *Website Type:* ${data.website_type.trim()}`);

  if (data.pages && data.pages.trim()) {
    lines.push(`• *Estimated Pages:* ${data.pages.trim()}`);
  }

  if (data.budget && data.budget.trim()) {
    lines.push(`• *Budget Range:* ${data.budget.trim()}`);
  }

  if (data.details && data.details.trim()) {
    lines.push(`• *Project Requirements:* ${data.details.trim()}`);
  }

  return lines.join("\n");
}

/**
 * Creates a valid https://wa.me/ URL with the encoded message
 */
export function buildWhatsAppUrl(
  message: string,
  phoneNumber: string = DEFAULT_WHATSAPP_NUMBER
): string {
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

/**
 * Persists the last inquiry data into sessionStorage so floating button can use it
 */
export function saveLastEnquiry(data: EnquiryData): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem("webnoura_last_enquiry", JSON.stringify(data));
    window.dispatchEvent(new CustomEvent("webnoura_enquiry_submitted", { detail: data }));
  } catch {
    // Ignore storage errors
  }
}

/**
 * Retrieves the last inquiry data if any was submitted in the session
 */
export function getLastEnquiry(): EnquiryData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem("webnoura_last_enquiry");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
