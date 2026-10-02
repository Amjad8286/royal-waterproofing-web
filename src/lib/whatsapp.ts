import { site } from "@/config/site";

/** wa.me link for a number in any format; non-digits are stripped. */
export function whatsappUrl(message?: string, number: string = site.contact.whatsappNumber) {
  const digits = number.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Pre-filled message naming what the visitor was looking at. */
export function whatsappMessage({ service, area }: { service?: string; area?: string } = {}) {
  let message = `Hi ${site.shortName}, I'd like to book a${site.inspection.isFree ? " free" : "n"} inspection`;
  if (service) message += ` for ${service.toLowerCase()}`;
  if (area) message += ` in ${area}`;
  return `${message}.`;
}
