import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { whatsappMessage, whatsappUrl } from "./whatsapp";

describe("whatsappUrl", () => {
  it("strips everything except digits from the number", () => {
    expect(whatsappUrl(undefined, "+91 97020-08187")).toBe("https://wa.me/919702008187");
  });

  it("URL-encodes the pre-filled message", () => {
    const url = whatsappUrl("Hi & hello? 100%", "123");
    expect(url).toBe("https://wa.me/123?text=Hi%20%26%20hello%3F%20100%25");
    expect(new URL(url).searchParams.get("text")).toBe("Hi & hello? 100%");
  });

  it("uses the configured business number by default", () => {
    expect(whatsappUrl()).toBe(`https://wa.me/${site.contact.whatsappNumber.replace(/\D/g, "")}`);
  });
});

describe("whatsappMessage", () => {
  it("has a sensible default", () => {
    expect(whatsappMessage()).toBe(`Hi ${site.shortName}, I'd like to book a free inspection.`);
  });

  it("names the service and area the visitor was looking at", () => {
    expect(whatsappMessage({ service: "Bathroom Waterproofing", area: "Andheri & Jogeshwari" })).toBe(
      `Hi ${site.shortName}, I'd like to book a free inspection for bathroom waterproofing in Andheri & Jogeshwari.`,
    );
  });
});
