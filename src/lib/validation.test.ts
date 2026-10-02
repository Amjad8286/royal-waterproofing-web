import { describe, expect, it } from "vitest";
import { isValidPhone, leadSchema, OTHER_AREA } from "./validation";

const valid = {
  name: "Priya Shah",
  phone: "98200 12345",
  service: "bathroom-waterproofing",
  area: "andheri",
};

const errorsFor = (input: Record<string, unknown>) => {
  const result = leadSchema.safeParse(input);
  return result.success ? {} : Object.fromEntries(result.error.issues.map((i) => [i.path.join("."), i.message]));
};

describe("leadSchema", () => {
  it("accepts the four required fields on their own", () => {
    expect(leadSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a complete submission", () => {
    const result = leadSchema.safeParse({
      ...valid,
      email: "priya@example.com",
      propertyType: "apartment",
      message: "Damp patch on the bedroom ceiling after rain.",
      preferredDate: "2999-01-01",
      timeWindow: "morning",
      contactMethod: "whatsapp",
      website: "",
      elapsedMs: 9000,
    });
    expect(result.success).toBe(true);
  });

  it("requires a name of at least two characters", () => {
    expect(errorsFor({ ...valid, name: " " })).toHaveProperty("name");
    expect(errorsFor({ ...valid, name: "A" })).toHaveProperty("name");
  });

  it("rejects phone numbers with letters, too few digits or an impossible Indian number", () => {
    expect(errorsFor({ ...valid, phone: "call me" })).toHaveProperty("phone");
    expect(errorsFor({ ...valid, phone: "12345" })).toHaveProperty("phone");
    expect(errorsFor({ ...valid, phone: "1234567890" })).toHaveProperty("phone");
    expect(errorsFor({ ...valid, phone: "+91 98200 1234" })).toHaveProperty("phone");
    expect(errorsFor({ ...valid, phone: "+44 1234 5678 9012 34" })).toHaveProperty("phone");
  });

  it("accepts Indian mobiles and landlines in common formats", () => {
    for (const phone of ["9820012345", "+91 98200 12345", "+919820012345", "098200-12345", "91 9820012345", "022 2612 3456", "(022) 2612-3456"]) {
      expect(isValidPhone(phone), phone).toBe(true);
      expect(leadSchema.safeParse({ ...valid, phone }).success, phone).toBe(true);
    }
  });

  it("accepts numbers from other countries when they start with a country code", () => {
    for (const phone of ["+971 50 123 4567", "+1-202-555-0143", "+44 7700 900123"]) {
      expect(leadSchema.safeParse({ ...valid, phone }).success, phone).toBe(true);
    }
  });

  it("requires a service and an area", () => {
    const errors = errorsFor({ ...valid, service: "", area: "" });
    expect(errors).toHaveProperty("service");
    expect(errors).toHaveProperty("area");
  });

  it("asks which area when 'Other' is chosen", () => {
    expect(errorsFor({ ...valid, area: OTHER_AREA })).toHaveProperty("areaOther");
    expect(leadSchema.safeParse({ ...valid, area: OTHER_AREA, areaOther: "Panvel" }).success).toBe(true);
  });

  it("treats an empty email as optional but rejects a malformed one", () => {
    expect(leadSchema.safeParse({ ...valid, email: "" }).success).toBe(true);
    expect(errorsFor({ ...valid, email: "not-an-email" })).toHaveProperty("email");
  });

  it("rejects inspection dates in the past", () => {
    expect(errorsFor({ ...valid, preferredDate: "2020-01-01" })).toHaveProperty("preferredDate");
  });

  it("rejects unknown option values", () => {
    expect(errorsFor({ ...valid, propertyType: "castle" })).toHaveProperty("propertyType");
    expect(errorsFor({ ...valid, contactMethod: "pigeon" })).toHaveProperty("contactMethod");
  });

  it("fails when the honeypot field is filled", () => {
    expect(errorsFor({ ...valid, website: "https://spam.example" })).toHaveProperty("website");
  });
});
