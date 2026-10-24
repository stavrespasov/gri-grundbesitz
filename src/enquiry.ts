export interface EnquiryData {
  propertyType: string;
  location: string;
  area: string;
  condition: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
}

export const PROPERTY_TYPES = [
  "Einfamilienhaus",
  "Mehrfamilienhaus",
  "Eigentumswohnung",
  "Grundstück",
] as const;
const CONDITIONS = [
  "Gepflegt",
  "Renovierungsbedürftig",
  "Sanierungsbedürftig",
  "Unbebaut",
];
const RECIPIENTS = [
  "jano.gri@gri-grundbesitz.com",
  "m.gri@gri-grundbesitz.com",
];
const text = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

export function validateEnquiryStep(
  data: EnquiryData,
  step: number,
): Record<string, string> {
  const errors: Record<string, string> = {};
  if (step === 0) {
    if (
      !(PROPERTY_TYPES as readonly string[]).includes(text(data?.propertyType))
    )
      errors.propertyType = "Bitte wählen Sie eine Immobilienart.";
  } else if (step === 1) {
    const location = text(data?.location);
    const area = text(data?.area);
    const condition = text(data?.condition);
    if (location.length > 150 || !/^\d{5}(?:[ \t]+[^\r\n]+)?$/.test(location))
      errors.location =
        "Bitte geben Sie eine fünfstellige Postleitzahl und optional den Ort ein.";
    if (
      area &&
      (!/^\d+(?:[.,]\d+)?$/.test(area) ||
        !Number.isFinite(Number(area.replace(",", "."))) ||
        Number(area.replace(",", ".")) <= 0)
    )
      errors.area = "Bitte geben Sie eine Fläche größer als 0 ein.";
    if (condition && !CONDITIONS.includes(condition))
      errors.condition = "Bitte wählen Sie einen gültigen Zustand.";
  } else if (step === 2) {
    const name = text(data?.name);
    const email = text(data?.email);
    const phone = text(data?.phone);
    if (name.length < 2 || name.length > 100)
      errors.name = "Bitte geben Sie Ihren Namen ein (2–100 Zeichen).";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse ein.";
    if (
      phone &&
      (phone.length > 40 ||
        !/^[+\d\s()./-]+$/.test(phone) ||
        /[\r\n]/.test(phone) ||
        !/\d/.test(phone))
    )
      errors.phone = "Bitte geben Sie eine gültige Telefonnummer ein.";
    if (typeof data?.message === "string" && data.message.length > 2000)
      errors.message = "Bitte verwenden Sie maximal 2.000 Zeichen.";
    if (data?.consent !== true)
      errors.consent = "Bitte stimmen Sie der Kontaktaufnahme zu.";
  } else {
    errors.step = "Dieser Schritt ist ungültig.";
  }
  return errors;
}

export function createEnquiryMailto(
  data: EnquiryData,
  recipient: string = RECIPIENTS[0],
): string {
  if (!RECIPIENTS.includes(recipient)) throw new Error("Ungültiger Empfänger.");
  if (
    [0, 1, 2].some(
      (step) => Object.keys(validateEnquiryStep(data, step)).length > 0,
    )
  )
    throw new Error("Bitte vervollständigen Sie Ihre Angaben.");
  const subject = `Immobilienangebot: ${text(data.propertyType)} in ${text(data.location)}`;
  const body = [
    "Guten Tag GRI Grundbesitz,",
    "",
    "ich möchte Ihnen folgende Immobilie anbieten:",
    "",
    `Immobilienart: ${text(data.propertyType)}`,
    `Postleitzahl / Ort: ${text(data.location)}`,
    `Fläche: ${text(data.area) ? `${text(data.area)} m²` : "Keine Angabe"}`,
    `Zustand: ${text(data.condition) || "Keine Angabe"}`,
    "",
    `Name: ${text(data.name)}`,
    `E-Mail: ${text(data.email)}`,
    `Telefon: ${text(data.phone) || "Keine Angabe"}`,
    "",
    "Nachricht:",
    text(data.message) || "Keine weitere Nachricht.",
    "",
    "Ich stimme der Kontaktaufnahme zu meiner Immobilienanfrage zu.",
  ].join("\n");
  return `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
