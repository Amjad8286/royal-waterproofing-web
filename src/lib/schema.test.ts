import { describe, expect, it } from "vitest";
import { site } from "@/config/site";
import { areas } from "@/content/areas";
import { services } from "@/content/services";
import { BUSINESS_ID, businessJsonLd, serviceJsonLd, websiteJsonLd } from "./schema";

const liveAreas = areas.filter((area) => !area.placeholder);

describe("structured data", () => {
  it("names the cities covered without placing Thane or Navi Mumbai inside Mumbai", () => {
    const served = businessJsonLd(liveAreas, services).areaServed;
    const names = served.map((place) => place.name);
    for (const city of site.market.cities) {
      expect(served).toContainEqual({ "@type": "City", name: city });
      expect(site.market.serviceRegion, "serviceRegion names every city").toContain(city);
    }
    for (const area of liveAreas) expect(names, area.slug).toContain(area.name);
    expect(names.filter((name) => /, (Mumbai|Thane)$/.test(name))).toEqual([]);
    expect(new Set(names).size).toBe(names.length);
  });

  it("only states confirmed business facts", () => {
    const business = businessJsonLd(liveAreas, services);
    const json = JSON.stringify(business);
    expect(json).not.toMatch(/aggregateRating|"review"|ratingValue/i);
    if (!site.hours) expect(business).not.toHaveProperty("openingHoursSpecification");
    if (!site.contact.geo) expect(business).not.toHaveProperty("geo");
    if (site.social.length === 0) expect(business).not.toHaveProperty("sameAs");
    expect(business.logo).toMatch(/\.png$/);
  });

  it("links the website and each service to the business", () => {
    expect(websiteJsonLd()).toMatchObject({ "@type": "WebSite", name: site.name, url: `${site.url}/`, publisher: { "@id": BUSINESS_ID } });
    for (const service of services) {
      const data = serviceJsonLd(service);
      expect(data.provider).toEqual({ "@id": BUSINESS_ID });
      expect(data.areaServed).toEqual(site.market.cities.map((name) => ({ "@type": "City", name })));
    }
  });
});
