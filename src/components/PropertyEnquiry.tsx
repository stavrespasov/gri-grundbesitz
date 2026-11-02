import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronDown,
  Copy,
  House,
  LandPlot,
  Mail,
  X,
} from "lucide-react";
import {
  createEnquiryCopyText,
  createEnquiryMailto,
  PROPERTY_TYPES,
  validateEnquiry,
  type EnquiryData,
} from "../enquiry";
import { CONTACTS } from "../content";

const EMPTY: EnquiryData = {
  propertyType: "",
  location: "",
  area: "",
  condition: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
};
const ICONS = [House, Building2, Building2, LandPlot];
const CONDITIONS = [
  "Gepflegt",
  "Renovierungsbedürftig",
  "Sanierungsbedürftig",
  "Unbebaut",
];

export function PropertyEnquiry({
  initialType,
  returnFocusTo,
  onClose,
}: {
  initialType?: string;
  returnFocusTo?: HTMLElement | null;
  onClose: () => void;
}): ReactNode {
  const [data, setData] = useState<EnquiryData>({
    ...EMPTY,
    propertyType: initialType ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mailto, setMailto] = useState("");
  const [draftOpened, setDraftOpened] = useState(false);
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "manual"
  >("idle");
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const completeTitle = useRef<HTMLHeadingElement>(null);
  const furtherDetails = useRef<HTMLDetailsElement>(null);
  const copyField = useRef<HTMLTextAreaElement>(null);
  const copyRequest = useRef(0);
  const copyText = mailto ? createEnquiryCopyText(data) : "";

  useEffect(() => {
    const lastFocused =
      returnFocusTo ??
      (document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null);
    const previousOverflow = document.body.style.overflow;
    const element = dialog.current;
    element?.showModal();
    title.current?.focus({ preventScroll: true });
    document.body.style.overflow = "hidden";
    return () => {
      copyRequest.current += 1;
      element?.close();
      document.body.style.overflow = previousOverflow;
      lastFocused?.focus({ preventScroll: true });
    };
  }, [returnFocusTo]);

  useEffect(() => {
    (mailto ? completeTitle : title).current?.focus({ preventScroll: true });
    dialog.current?.scrollTo({ top: 0 });
  }, [mailto]);

  useEffect(() => {
    if (copyState !== "manual") return;
    copyField.current?.focus();
    copyField.current?.select();
  }, [copyState]);

  const copyMessage = async (): Promise<void> => {
    const request = ++copyRequest.current;
    setCopyState("copying");
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(copyText);
      if (request === copyRequest.current) setCopyState("copied");
    } catch {
      if (request === copyRequest.current) setCopyState("manual");
    }
  };

  const update = <K extends keyof EnquiryData>(
    key: K,
    value: EnquiryData[K],
  ): void => {
    setData((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    const issues = validateEnquiry(data);
    setErrors(issues);
    if (Object.keys(issues).length) {
      requestAnimationFrame(() => {
        if ((issues.area || issues.condition) && furtherDetails.current)
          furtherDetails.current.open = true;
        const invalid = dialog.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"]',
        );
        if (invalid?.tagName === "FIELDSET")
          invalid.querySelector<HTMLInputElement>("input")?.focus();
        else invalid?.focus();
      });
      return;
    }
    copyRequest.current += 1;
    setCopyState("idle");
    setDraftOpened(false);
    setMailto(createEnquiryMailto(data));
  };

  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>): void => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex="0"]',
      ),
    ).filter((element) => element.getClientRects().length > 0);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (
      (event.shiftKey && active === first) ||
      (!event.shiftKey && active === last) ||
      !focusable.includes(active as HTMLElement)
    ) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
  };

  const error = (field: keyof EnquiryData): ReactNode =>
    errors[field] ? (
      <span role="alert" className="field-error" id={`enquiry-${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  const fieldAttributes = (
    field: keyof EnquiryData,
  ): {
    "aria-invalid": boolean;
    "aria-describedby": string | undefined;
  } => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `enquiry-${field}-error` : undefined,
  });

  return (
    <dialog
      ref={dialog}
      className="enquiry-dialog"
      aria-labelledby="enquiry-title"
      aria-describedby="enquiry-intro"
      onKeyDown={trapFocus}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="enquiry-shell">
        <header className="enquiry-header">
          <div className="enquiry-top">
            <span className="enquiry-eyebrow">Ihre Immobilie</span>
            <button
              type="button"
              className="enquiry-close"
              aria-label="Anfrage schließen"
              onClick={onClose}
            >
              <X size={22} aria-hidden="true" />
            </button>
          </div>
          <h2 id="enquiry-title" ref={title} tabIndex={-1}>
            Sprechen wir darüber.
          </h2>
          <p className="enquiry-intro" id="enquiry-intro">
            Kostenlos und unverbindlich. Wir bereiten einen E-Mail-Entwurf für
            Sie vor.
          </p>
        </header>

        {mailto ? (
          <div className="enquiry-complete">
            <span className="enquiry-complete-icon" aria-hidden="true">
              <Mail size={26} strokeWidth={1.4} />
            </span>
            <h3 ref={completeTitle} tabIndex={-1}>
              Ihr E-Mail-Entwurf ist bereit.
            </h3>
            <p>
              Öffnen Sie den Entwurf in Ihrem E-Mail-Programm und senden Sie ihn
              dort ab. Hier wurde noch keine Nachricht versendet.
            </p>
            <div className="enquiry-draft-actions">
              <a
                className="action-button"
                href={mailto}
                onClick={() => setDraftOpened(true)}
              >
                <span>E-Mail-Entwurf öffnen</span>
                <ArrowUpRight size={19} aria-hidden="true" />
              </a>
              <button
                type="button"
                className="enquiry-copy-button"
                disabled={copyState === "copying"}
                onClick={copyMessage}
              >
                <Copy size={17} aria-hidden="true" />
                <span>
                  {copyState === "copying"
                    ? "Wird kopiert …"
                    : "Nachricht kopieren"}
                </span>
              </button>
            </div>
            <p className="enquiry-hint enquiry-recipient">
              Empfänger: {CONTACTS[0].email}
            </p>
            {draftOpened && copyState === "idle" ? (
              <p className="enquiry-draft-feedback" role="status">
                Hat sich kein E-Mail-Programm geöffnet? Kopieren Sie die
                Nachricht und senden Sie sie an {CONTACTS[0].email}.
              </p>
            ) : null}
            {copyState === "copied" ? (
              <p className="enquiry-draft-feedback" role="status">
                Nachricht kopiert. Fügen Sie den Text in Ihre E-Mail ein und
                senden Sie sie an {CONTACTS[0].email}.
              </p>
            ) : null}
            {copyState === "manual" ? (
              <div className="field enquiry-copy-field">
                <p
                  className="enquiry-draft-feedback"
                  id="enquiry-copy-help"
                  role="status"
                >
                  Bitte kopieren Sie den markierten Text und senden Sie ihn per
                  E-Mail an {CONTACTS[0].email}.
                </p>
                <label htmlFor="enquiry-copy-text">
                  Nachricht zum Kopieren
                </label>
                <textarea
                  ref={copyField}
                  id="enquiry-copy-text"
                  rows={8}
                  readOnly
                  value={copyText}
                  aria-describedby="enquiry-copy-help"
                />
              </div>
            ) : null}
            <dl className="enquiry-summary">
              {[
                ["Immobilienart", data.propertyType],
                ["Postleitzahl / Ort", data.location],
                ["Ihr Name", data.name],
                ["E-Mail-Adresse", data.email],
                ["Telefonnummer", data.phone],
                ["Fläche", data.area ? `${data.area} m²` : ""],
                ["Zustand", data.condition],
                ["Ihre Nachricht", data.message],
              ]
                .filter(([, value]) => value.trim())
                .map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
            </dl>
            <p className="enquiry-hint">
              Kein E-Mail-Programm eingerichtet? Rufen Sie uns an:{" "}
              <a className="text-link" href={`tel:${CONTACTS[0].phoneHref}`}>
                {CONTACTS[0].phone}
              </a>
            </p>
            <button
              className="text-link enquiry-edit"
              type="button"
              onClick={() => {
                copyRequest.current += 1;
                setMailto("");
                setDraftOpened(false);
                setCopyState("idle");
              }}
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Angaben bearbeiten
            </button>
          </div>
        ) : (
          <form className="enquiry-form" noValidate onSubmit={submit}>
            <fieldset
              className="enquiry-types"
              {...fieldAttributes("propertyType")}
            >
              <legend>
                Art der Immobilie <span>*</span>
              </legend>
              <div className="enquiry-type-options">
                {PROPERTY_TYPES.map((type, index) => {
                  const Icon = ICONS[index];
                  return (
                    <label
                      className={`enquiry-type ${data.propertyType === type ? "is-selected" : ""}`}
                      key={type}
                    >
                      <input
                        type="radio"
                        name="propertyType"
                        value={type}
                        checked={data.propertyType === type}
                        required
                        onChange={() => update("propertyType", type)}
                      />
                      <Icon size={23} strokeWidth={1.4} aria-hidden="true" />
                      <span>{type}</span>
                      <span className="enquiry-type-check" aria-hidden="true">
                        {data.propertyType === type ? (
                          <Check size={12} />
                        ) : null}
                      </span>
                    </label>
                  );
                })}
              </div>
              {error("propertyType")}
            </fieldset>
            <div className="field">
              <label htmlFor="enquiry-location">
                Postleitzahl & Ort <span>*</span>
              </label>
              <input
                id="enquiry-location"
                name="location"
                autoComplete="postal-code"
                placeholder="z. B. 40213 Düsseldorf"
                value={data.location}
                maxLength={150}
                required
                onChange={(event) => update("location", event.target.value)}
                {...fieldAttributes("location")}
              />
              {error("location")}
            </div>
            <div className="field">
              <label htmlFor="enquiry-name">
                Ihr Name <span>*</span>
              </label>
              <input
                id="enquiry-name"
                name="name"
                autoComplete="name"
                value={data.name}
                maxLength={100}
                required
                onChange={(event) => update("name", event.target.value)}
                {...fieldAttributes("name")}
              />
              {error("name")}
            </div>
            <div className="field-row">
              <div className="field">
                <label htmlFor="enquiry-email">
                  E-Mail-Adresse <span>*</span>
                </label>
                <input
                  id="enquiry-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={data.email}
                  maxLength={254}
                  required
                  onChange={(event) => update("email", event.target.value)}
                  {...fieldAttributes("email")}
                />
                {error("email")}
              </div>
              <div className="field">
                <label htmlFor="enquiry-phone">
                  Telefonnummer <small>optional</small>
                </label>
                <input
                  id="enquiry-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={data.phone}
                  maxLength={40}
                  onChange={(event) => update("phone", event.target.value)}
                  {...fieldAttributes("phone")}
                />
                {error("phone")}
              </div>
            </div>
            <div className="field">
              <label htmlFor="enquiry-message">
                Ihre Nachricht <small>optional</small>
              </label>
              <textarea
                id="enquiry-message"
                name="message"
                rows={3}
                value={data.message}
                maxLength={2000}
                onChange={(event) => update("message", event.target.value)}
                {...fieldAttributes("message")}
              />
              {error("message")}
            </div>
            <details ref={furtherDetails} className="enquiry-details">
              <summary>
                Weitere Angaben <small>optional</small>
                <ChevronDown size={18} aria-hidden="true" />
              </summary>
              <div className="field-row">
                <div className="field">
                  <label htmlFor="enquiry-area">Fläche in m²</label>
                  <input
                    id="enquiry-area"
                    name="area"
                    inputMode="decimal"
                    placeholder="z. B. 120"
                    value={data.area}
                    maxLength={12}
                    onChange={(event) => update("area", event.target.value)}
                    {...fieldAttributes("area")}
                  />
                  {error("area")}
                </div>
                <div className="field">
                  <label htmlFor="enquiry-condition">Zustand</label>
                  <select
                    id="enquiry-condition"
                    name="condition"
                    value={data.condition}
                    onChange={(event) =>
                      update("condition", event.target.value)
                    }
                    {...fieldAttributes("condition")}
                  >
                    <option value="">Bitte wählen</option>
                    {CONDITIONS.map((condition) => (
                      <option key={condition}>{condition}</option>
                    ))}
                  </select>
                  {error("condition")}
                </div>
              </div>
            </details>
            <div className="enquiry-consent-field">
              <label className="enquiry-consent">
                <input
                  id="enquiry-consent"
                  name="consent"
                  type="checkbox"
                  checked={data.consent}
                  required
                  onChange={(event) => update("consent", event.target.checked)}
                  {...fieldAttributes("consent")}
                />
                <span>
                  Ich möchte mit GRI Grundbesitz Kontakt aufnehmen. Meine
                  Angaben werden für einen E-Mail-Entwurf verwendet.{" "}
                  <span>*</span>
                </span>
              </label>
              {error("consent")}
            </div>
            <p className="enquiry-hint">
              Ihre Angaben werden hier nicht gespeichert oder versendet. Den
              Entwurf senden Sie selbst in Ihrem E-Mail-Programm ab.
            </p>
            <div className="enquiry-actions">
              <span className="enquiry-hint">* Pflichtangaben</span>
              <button className="action-button" type="submit">
                <span>E-Mail vorbereiten</span>
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}
