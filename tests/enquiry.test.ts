import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createEnquiryMailto,
  PROPERTY_TYPES,
  validateEnquiryStep,
} from "../src/enquiry.ts";
import type { EnquiryData } from "../src/enquiry.ts";
const valid = (changes: Partial<EnquiryData> = {}): EnquiryData => ({
  propertyType: "Einfamilienhaus",
  location: "40213 Düsseldorf",
  area: "125,5",
  condition: "Gepflegt",
  name: "Müller & Söhne",
  email: "seller@example.de",
  phone: "+49 (176) 23288447",
  message: "Eine Immobilie in NRW.",
  consent: true,
  ...changes,
});
describe("validateEnquiryStep", () => {
  it("accepts the supported property types", () => {
    for (const propertyType of PROPERTY_TYPES)
      assert.deepEqual(validateEnquiryStep(valid({ propertyType }), 0), {});
  });
  it("rejects missing and unknown property types", () => {
    for (const propertyType of ["", "Büro"])
      assert.ok(validateEnquiryStep(valid({ propertyType }), 0).propertyType);
  });
  it("handles null and undefined data without throwing", () => {
    for (const data of [null, undefined])
      assert.ok(
        validateEnquiryStep(data as unknown as EnquiryData, 0).propertyType,
      );
  });
  it("rejects steps outside the supported range", () => {
    for (const step of [-1, 3, NaN])
      assert.ok(Object.keys(validateEnquiryStep(valid(), step)).length);
  });
  it("accepts postal codes with or without a Unicode city", () => {
    for (const location of ["40213", "40213 Düsseldorf", "01067 Dresden"])
      assert.deepEqual(validateEnquiryStep(valid({ location }), 1), {});
  });
  it("rejects missing malformed and oversized locations", () => {
    for (const location of [
      "",
      "Düsseldorf",
      "4021",
      "402130",
      "40213\nBcc: evil@example.de",
      `40213 ${"x".repeat(150)}`,
    ])
      assert.ok(validateEnquiryStep(valid({ location }), 1).location);
  });
  it("accepts empty optional area and condition", () => {
    assert.deepEqual(
      validateEnquiryStep(valid({ area: "", condition: "" }), 1),
      {},
    );
  });
  it("accepts positive area with a decimal point or comma", () => {
    for (const area of ["1", "0.1", "125,5"])
      assert.deepEqual(validateEnquiryStep(valid({ area }), 1), {});
  });
  it("rejects nonpositive and malformed area", () => {
    for (const area of ["0", "-1", "Infinity", "1,2,3", "125 m²"])
      assert.ok(validateEnquiryStep(valid({ area }), 1).area);
  });
  it("accepts each supported condition", () => {
    for (const condition of [
      "Gepflegt",
      "Renovierungsbedürftig",
      "Sanierungsbedürftig",
      "Unbebaut",
    ])
      assert.deepEqual(validateEnquiryStep(valid({ condition }), 1), {});
  });
  it("rejects unknown conditions", () => {
    assert.ok(
      validateEnquiryStep(valid({ condition: "Unknown" }), 1).condition,
    );
  });
  it("accepts Unicode names and empty optional contact fields", () => {
    assert.deepEqual(
      validateEnquiryStep(valid({ name: "Éva 李", phone: "", message: "" }), 2),
      {},
    );
  });
  it("rejects names outside the two to one hundred character range", () => {
    for (const name of ["", "A", "A".repeat(101)])
      assert.ok(validateEnquiryStep(valid({ name }), 2).name);
  });
  it("accepts names at both length boundaries", () => {
    for (const name of ["Ab", "A".repeat(100)])
      assert.deepEqual(validateEnquiryStep(valid({ name }), 2), {});
  });
  it("rejects malformed oversized and injected emails", () => {
    for (const email of [
      "",
      "seller",
      "seller@",
      "seller@example",
      "seller@example.de\r\nBcc: evil@example.de",
      `${"x".repeat(250)}@example.de`,
    ])
      assert.ok(validateEnquiryStep(valid({ email }), 2).email);
  });
  it("rejects malformed and oversized phone numbers", () => {
    for (const phone of ["call me", "+49\nBcc: evil", "1".repeat(41), "++++++"])
      assert.ok(validateEnquiryStep(valid({ phone }), 2).phone);
  });
  it("requires consent", () => {
    assert.ok(validateEnquiryStep(valid({ consent: false }), 2).consent);
  });
  it("accepts a message at the maximum length", () => {
    assert.deepEqual(
      validateEnquiryStep(valid({ message: "ä".repeat(2000) }), 2),
      {},
    );
  });
  it("rejects a message above the maximum length", () => {
    assert.ok(
      validateEnquiryStep(valid({ message: "ä".repeat(2001) }), 2).message,
    );
  });
  it("handles null fields as missing values", () => {
    assert.ok(
      validateEnquiryStep(valid({ email: null as unknown as string }), 2).email,
    );
  });
});
describe("createEnquiryMailto", () => {
  it("uses the first business email by default", () => {
    assert.ok(
      createEnquiryMailto(valid()).startsWith(
        "mailto:jano.gri@gri-grundbesitz.com?",
      ),
    );
  });
  it("allows the second business email", () => {
    assert.ok(
      createEnquiryMailto(valid(), "m.gri@gri-grundbesitz.com").startsWith(
        "mailto:m.gri@gri-grundbesitz.com?",
      ),
    );
  });
  it("rejects arbitrary or injected recipients", () => {
    for (const recipient of [
      "",
      "evil@example.de",
      "jano.gri@gri-grundbesitz.com?bcc=evil@example.de",
    ])
      assert.throws(() => createEnquiryMailto(valid(), recipient));
  });
  it("encodes Unicode and line breaks as email body data", () => {
    const message = "Straße & Hof\nBcc: nur Text\nGrüße #1?";
    const result = createEnquiryMailto(valid({ message }));
    const query = new URLSearchParams(result.slice(result.indexOf("?") + 1));
    assert.equal(query.size, 2);
    assert.ok(query.get("subject")?.includes("Einfamilienhaus"));
    assert.ok(query.get("body")?.includes(message));
    assert.ok(query.get("body")?.includes("Müller & Söhne"));
    assert.ok(!result.includes("\n"));
  });
  it("rejects an enquiry with any invalid step", () => {
    for (const changes of [
      { propertyType: "" },
      { location: "" },
      { consent: false },
    ])
      assert.throws(() => createEnquiryMailto(valid(changes)));
  });
});
