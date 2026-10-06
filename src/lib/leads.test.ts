import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { features } from "@/config/site";
import { clientIpFrom, MAX_LEADS_PER_WINDOW, submitLead } from "./leads";
import { leadSchema, type Lead } from "./validation";

const lead = (overrides: Partial<Lead> = {}): Lead =>
  leadSchema.parse({
    name: "Priya Shah",
    phone: "98200 12345",
    service: "bathroom-waterproofing",
    area: "andheri",
    elapsedMs: 9000,
    submissionId: "0b6c43f4-6a1d-4b8e-9d0e-8a3f2f7c1e55",
    ...overrides,
  });

// Each test is a different visitor, so the per-visitor limit doesn't carry over.
let visitor = 0;
const nextIp = () => `203.0.113.${++visitor}`;

const reply = (status: number, body?: unknown) =>
  new Response(body === undefined ? null : JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

let fetchMock: ReturnType<typeof vi.fn>;
let errorLog: ReturnType<typeof vi.spyOn>;

beforeEach(() => {
  vi.stubEnv("LEADS_API_URL", "https://api.example.com/api/");
  vi.stubEnv("LEADS_API_KEY", "lsk_test");
  vi.stubEnv("LEAD_TEST_HOOKS", "");
  vi.stubEnv("LEAD_SUBMIT_MODE", "");
  fetchMock = vi.fn(async () => reply(201, { reference: "RW-7KQ2M9", message: "Thank you." }));
  vi.stubGlobal("fetch", fetchMock);
  errorLog = vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const sentRequest = () => {
  const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
  return { url, headers: init.headers as Record<string, string>, body: JSON.parse(init.body as string) };
};

describe("submitLead → lead API", () => {
  it("posts the enquiry with the site key, idempotency key and visitor IP", async () => {
    const ip = nextIp();
    const result = await submitLead(
      lead({ formLocation: "contact-page", sourcePage: "/contact", attribution: { utm_source: "google" } }),
      { clientIp: ip },
    );

    expect(result).toEqual({ ok: true, reference: "RW-7KQ2M9" });
    const { url, headers, body } = sentRequest();
    expect(url).toBe("https://api.example.com/api/leads/inspection-request/");
    expect(headers).toMatchObject({
      "Content-Type": "application/json",
      "X-Site-Key": "lsk_test",
      "Idempotency-Key": "0b6c43f4-6a1d-4b8e-9d0e-8a3f2f7c1e55",
      "X-Client-IP": ip,
    });
    expect(body).toMatchObject({
      name: "Priya Shah",
      phone: "98200 12345",
      service: "bathroom-waterproofing",
      serviceName: "Bathroom Waterproofing",
      area: "andheri",
      areaName: "Andheri & Jogeshwari",
      whatsappOptIn: true,
      sourcePage: "/contact",
      formLocation: "contact-page",
      attribution: { utm_source: "google" },
      photoCount: 0,
    });
  });

  it("never forwards the bot checks or the submission ID in the body", async () => {
    await submitLead(lead({ website: "" }), { clientIp: nextIp() });
    const { body } = sentRequest();
    expect(body).not.toHaveProperty("website");
    expect(body).not.toHaveProperty("elapsedMs");
    expect(body).not.toHaveProperty("submissionId");
  });

  it("asks for the customer's WhatsApp confirmation on every enquiry, whatever the contact method", async () => {
    expect(features.customerWhatsApp).toBe(true);
    await submitLead(lead({ contactMethod: "call" }), { clientIp: nextIp() });
    expect(sentRequest().body).toMatchObject({ contactMethod: "call", whatsappOptIn: true });
  });

  it("names 'Not sure' and 'Other', and sends the typed area only for 'Other'", async () => {
    await submitLead(lead({ service: "not-sure", area: "other", areaOther: "Mira Road" }), { clientIp: nextIp() });
    expect(sentRequest().body).toMatchObject({ serviceName: "Not sure — needs diagnosis", areaName: "Other", areaOther: "Mira Road" });

    fetchMock.mockClear();
    await submitLead(lead({ areaOther: "Mira Road" }), { clientIp: nextIp() });
    expect(sentRequest().body).not.toHaveProperty("areaOther");
  });

  it("makes up an idempotency key when the form didn't send one", async () => {
    await submitLead(lead({ submissionId: undefined }), { clientIp: nextIp() });
    expect(sentRequest().headers["Idempotency-Key"]).toMatch(/^[A-Za-z0-9_-]{8,64}$/);
  });

  it("treats a replayed submission (200) as a success with the first reference", async () => {
    fetchMock.mockResolvedValueOnce(reply(200, { reference: "RW-7KQ2M9" }));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toEqual({ ok: true, reference: "RW-7KQ2M9" });
  });

  it("still thanks the visitor if a saved enquiry comes back without a reference", async () => {
    fetchMock.mockResolvedValueOnce(reply(201, {}));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toEqual({ ok: true, reference: "" });
    expect(errorLog).toHaveBeenCalled();
  });

  it("puts the API's validation errors under the matching fields", async () => {
    fetchMock.mockResolvedValueOnce(reply(400, { errors: { phone: ["Enter a 10-digit mobile number."], areaOther: ["Tell us which area you're in."] } }));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toEqual({
      ok: false,
      error: "validation",
      message: "Please check the highlighted fields.",
      fieldErrors: { phone: ["Enter a 10-digit mobile number."], areaOther: ["Tell us which area you're in."] },
    });
  });

  it("treats errors the visitor can't fix (headers, hidden fields) as a server error, and logs them", async () => {
    fetchMock.mockResolvedValueOnce(reply(400, { errors: { "X-Client-IP": ["Send the visitor's IP address."] } }));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toMatchObject({ ok: false, error: "server" });
    expect(errorLog.mock.calls.flat().join(" ")).toContain("X-Client-IP");
  });

  it("passes on the API's rate limit", async () => {
    fetchMock.mockResolvedValueOnce(reply(429, { detail: "Request was throttled." }));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toMatchObject({
      ok: false,
      error: "rate-limited",
      message: expect.stringContaining("call or WhatsApp us"),
    });
  });

  it.each([401, 403, 500, 502])("shows the generic error and logs it when the API answers %i", async (status) => {
    fetchMock.mockResolvedValueOnce(reply(status, { detail: "Invalid site key." }));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toEqual({
      ok: false,
      error: "server",
      message: "We couldn't send your request just now.",
    });
    expect(errorLog).toHaveBeenCalled();
  });

  it("shows the generic error when the API is unreachable or too slow", async () => {
    fetchMock.mockRejectedValueOnce(new DOMException("The operation was aborted due to timeout", "TimeoutError"));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toMatchObject({ ok: false, error: "server" });
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    expect(await submitLead(lead(), { clientIp: nextIp() })).toMatchObject({ ok: false, error: "server" });
  });

  it("doesn't call the API without a key or a visitor IP", async () => {
    expect(await submitLead(lead(), { clientIp: null })).toMatchObject({ ok: false, error: "server" });
    vi.stubEnv("LEADS_API_KEY", "");
    expect(await submitLead(lead(), { clientIp: nextIp() })).toMatchObject({ ok: false, error: "server" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("drops likely bots with a fake success and never calls the API", async () => {
    const result = await submitLead(lead({ elapsedMs: 300 }), { clientIp: nextIp() });
    expect(result).toMatchObject({ ok: true, reference: expect.stringMatching(/^RW-/) });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it(`limits one visitor to ${MAX_LEADS_PER_WINDOW} enquiries before calling the API`, async () => {
    const ip = nextIp();
    for (let i = 0; i < MAX_LEADS_PER_WINDOW; i++) expect(await submitLead(lead(), { clientIp: ip })).toMatchObject({ ok: true });
    expect(await submitLead(lead(), { clientIp: ip })).toMatchObject({ ok: false, error: "rate-limited" });
    expect(fetchMock).toHaveBeenCalledTimes(MAX_LEADS_PER_WINDOW);
    expect(await submitLead(lead(), { clientIp: nextIp() })).toMatchObject({ ok: true });
  });

  it("simulates delivery when no API is configured", async () => {
    vi.stubEnv("LEADS_API_URL", "");
    const result = await submitLead(lead(), { clientIp: nextIp() });
    expect(result).toMatchObject({ ok: true, reference: expect.stringMatching(/^RW-[A-Z0-9]{3,12}$/) });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("clientIpFrom", () => {
  it("takes the first X-Forwarded-For address", () => {
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "198.51.100.7, 10.0.0.1" }))).toBe("198.51.100.7");
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "2001:db8::1" }))).toBe("2001:db8::1");
  });

  it("falls back to X-Real-IP, and ignores anything that isn't an IP address", () => {
    expect(clientIpFrom(new Headers({ "x-real-ip": "198.51.100.8" }))).toBe("198.51.100.8");
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "unknown", "x-real-ip": "198.51.100.9" }))).toBe("198.51.100.9");
    expect(clientIpFrom(new Headers({ "x-forwarded-for": "<script>" }))).toBeNull();
    expect(clientIpFrom(new Headers())).toBeNull();
  });
});
