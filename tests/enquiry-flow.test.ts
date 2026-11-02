import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  createEnquiryCopyText,
  validateEnquiry,
  type EnquiryData,
} from "../src/enquiry.ts";

const valid = (changes: Partial<EnquiryData> = {}): EnquiryData => ({
  propertyType: "Einfamilienhaus",
  location: "40213 Düsseldorf",
  area: "",
  condition: "",
  name: "Éva Müller",
  email: "eva@example.de",
  phone: "",
  message: "",
  consent: true,
  ...changes,
});

describe("validateEnquiry", () => {
  it("reports required fields from all former steps in one submission", () => {
    assert.deepEqual(
      Object.keys(
        validateEnquiry(
          valid({
            propertyType: "",
            location: "",
            name: "",
            email: "",
            consent: false,
          }),
        ),
      ),
      ["propertyType", "location", "name", "email", "consent"],
    );
  });

  it("accepts a complete enquiry with all optional fields empty", () => {
    assert.deepEqual(validateEnquiry(valid()), {});
  });

  it("reports invalid optional data alongside required data", () => {
    const errors = validateEnquiry(
      valid({
        location: "",
        area: "0",
        condition: "Unknown",
        phone: "call me",
        message: "ä".repeat(2001),
      }),
    );
    assert.deepEqual(Object.keys(errors), [
      "location",
      "area",
      "condition",
      "phone",
      "message",
    ]);
  });

  it("reports every missing required field for null or undefined data", () => {
    for (const data of [null, undefined]) {
      assert.deepEqual(
        Object.keys(validateEnquiry(data as unknown as EnquiryData)),
        ["propertyType", "location", "name", "email", "consent"],
      );
    }
  });
});

describe("createEnquiryCopyText", () => {
  it("creates readable recipient, subject and body text without URL encoding", () => {
    const copyText = createEnquiryCopyText(
      valid({
        area: "120,5",
        message:
          "Grüße & Rückfragen + Unterlagen: 50%\nBitte nach 18 Uhr anrufen.",
      }),
    );
    assert.ok(
      copyText.startsWith(
        "An: jano.gri@gri-grundbesitz.com\nBetreff: Immobilienangebot: Einfamilienhaus in 40213 Düsseldorf\n\nGuten Tag GRI Grundbesitz,",
      ),
    );
    assert.ok(copyText.includes("Name: Éva Müller"));
    assert.ok(copyText.includes("Fläche: 120,5 m²"));
    assert.ok(
      copyText.includes(
        "Grüße & Rückfragen + Unterlagen: 50%\nBitte nach 18 Uhr anrufen.",
      ),
    );
    assert.ok(!copyText.includes("%C3"));
  });

  it("supports the second approved business recipient", () => {
    assert.ok(
      createEnquiryCopyText(valid(), "m.gri@gri-grundbesitz.com").startsWith(
        "An: m.gri@gri-grundbesitz.com\n",
      ),
    );
  });

  it("rejects invalid enquiries and unapproved recipients", () => {
    assert.throws(() => createEnquiryCopyText(valid({ consent: false })));
    assert.throws(() => createEnquiryCopyText(valid(), "other@example.com"));
  });
});
