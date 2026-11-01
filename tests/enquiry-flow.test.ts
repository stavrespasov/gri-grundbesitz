import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateEnquiry, type EnquiryData } from "../src/enquiry.ts";

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
