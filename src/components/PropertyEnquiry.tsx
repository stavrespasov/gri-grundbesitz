import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  House,
  LandPlot,
  Mail,
  X,
} from "lucide-react";
import {
  createEnquiryMailto,
  PROPERTY_TYPES,
  validateEnquiryStep,
  type EnquiryData,
} from "../enquiry";
import { BrandMark } from "./Shared";

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
const TITLES = [
  "Was dürfen wir kennenlernen?",
  "Ein paar gute Eckdaten.",
  "Wie erreichen wir Sie?",
  "Ein guter Anfang.",
] as const;
const ICONS = [House, Building2, Building2, LandPlot];

export function PropertyEnquiry({
  initialType,
  onClose,
}: {
  initialType?: string;
  onClose: () => void;
}): ReactNode {
  const [data, setData] = useState<EnquiryData>({
    ...EMPTY,
    propertyType: initialType ?? "",
  });
  const [step, setStep] = useState(initialType ? 1 : 0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [mailto, setMailto] = useState("");
  const [draftOpened, setDraftOpened] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const stepTitle = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const lastFocused =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    const element = dialog.current;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      lastFocused?.focus();
    };
  }, []);
  useEffect(() => {
    stepTitle.current?.focus({ preventScroll: true });
    dialog.current?.scrollTo({ top: 0 });
  }, [step]);
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
    const issues = validateEnquiryStep(data, step);
    setErrors(issues);
    if (Object.keys(issues).length) {
      requestAnimationFrame(() => {
        const invalid = dialog.current?.querySelector<HTMLElement>(
          '[aria-invalid="true"]',
        );
        if (invalid?.tagName === "FIELDSET")
          invalid.querySelector<HTMLInputElement>("input")?.focus();
        else invalid?.focus();
      });
      return;
    }
    if (step === 2) setMailto(createEnquiryMailto(data));
    setStep(step + 1);
  };
  const error = (field: string): ReactNode =>
    errors[field] ? (
      <span role="alert" className="field-error" id={`${field}-error`}>
        {errors[field]}
      </span>
    ) : null;
  const fieldAttributes = (
    field: string,
  ): { "aria-invalid": boolean; "aria-describedby": string | undefined } => ({
    "aria-invalid": Boolean(errors[field]),
    "aria-describedby": errors[field] ? `${field}-error` : undefined,
  });
  return (
    <dialog
      ref={dialog}
      className="enquiry-dialog"
      aria-labelledby="enquiry-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === dialog.current) onClose();
      }}
    >
      <div className="enquiry-shell">
        <div className="enquiry-sidebar">
          <a
            href="#/"
            onClick={(event) => event.preventDefault()}
            className="enquiry-brand"
            tabIndex={-1}
          >
            <BrandMark />
            GRI GRUNDBESITZ
          </a>
          <div className="enquiry-sidebar-copy">
            <span>
              Der erste Schritt
              <br />
              ist der <i>leichteste.</i>
            </span>
            <p>
              Ihre Immobilie in guten Händen.
              <br />
              Kostenlos. Unverbindlich. Persönlich.
            </p>
          </div>
          <div className="enquiry-sidebar-bottom">
            <span className="status-dot" />
            Immobilienankauf in NRW
          </div>
        </div>
        <div className="enquiry-main">
          <div className="enquiry-top">
            <span>
              {step < 3
                ? `IMMOBILIE ANBIETEN / 0${step + 1}`
                : "IHR E-MAIL-ENTWURF"}
            </span>
            <button
              className="round-button"
              aria-label="Anfrage schließen"
              onClick={onClose}
            >
              <X size={22} />
            </button>
          </div>
          <div
            className="enquiry-progress"
            aria-label={`Schritt ${Math.min(step + 1, 3)} von 3`}
          >
            {[0, 1, 2].map((n) => (
              <span key={n} className={n <= step ? "done" : ""} />
            ))}
          </div>
          <h2 id="enquiry-title" ref={stepTitle} tabIndex={-1}>
            {TITLES[step]}
          </h2>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={reduced ? false : { opacity: 0, x: 22 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.2 }}
            >
              {step < 3 ? (
                <form noValidate onSubmit={submit}>
                  {step === 0 ? (
                    <>
                      <p className="enquiry-intro">
                        Wählen Sie die Art Ihrer Immobilie in NRW.
                      </p>
                      <fieldset
                        className="type-options"
                        {...fieldAttributes("propertyType")}
                      >
                        <legend className="sr-only">Art der Immobilie</legend>
                        {PROPERTY_TYPES.map((type, i) => {
                          const Icon = ICONS[i];
                          return (
                            <label
                              className={`type-option ${data.propertyType === type ? "selected" : ""}`}
                              key={type}
                            >
                              <input
                                type="radio"
                                name="propertyType"
                                value={type}
                                checked={data.propertyType === type}
                                onChange={() => update("propertyType", type)}
                              />
                              <Icon size={30} strokeWidth={1.3} />
                              <span>{type}</span>
                              <span className="radio-check">
                                {data.propertyType === type ? (
                                  <Check size={12} />
                                ) : null}
                              </span>
                            </label>
                          );
                        })}
                      </fieldset>
                      {error("propertyType")}
                    </>
                  ) : null}
                  {step === 1 ? (
                    <>
                      <p className="enquiry-intro">
                        Nur das Wichtigste. Weitere Details klären wir
                        persönlich.
                      </p>
                      <div className="field">
                        <label htmlFor="location">
                          Postleitzahl & Ort <span>*</span>
                        </label>
                        <input
                          id="location"
                          name="location"
                          autoComplete="postal-code"
                          placeholder="z. B. 40213 Düsseldorf"
                          value={data.location}
                          maxLength={150}
                          onChange={(e) => update("location", e.target.value)}
                          {...fieldAttributes("location")}
                        />
                        {error("location")}
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label htmlFor="area">
                            Fläche in m² <small>optional</small>
                          </label>
                          <input
                            id="area"
                            name="area"
                            inputMode="decimal"
                            placeholder="z. B. 120"
                            value={data.area}
                            maxLength={12}
                            onChange={(e) => update("area", e.target.value)}
                            {...fieldAttributes("area")}
                          />
                          {error("area")}
                        </div>
                        <div className="field">
                          <label htmlFor="condition">
                            Zustand <small>optional</small>
                          </label>
                          <select
                            id="condition"
                            name="condition"
                            value={data.condition}
                            onChange={(e) =>
                              update("condition", e.target.value)
                            }
                            {...fieldAttributes("condition")}
                          >
                            <option value="">Bitte wählen</option>
                            {[
                              "Gepflegt",
                              "Renovierungsbedürftig",
                              "Sanierungsbedürftig",
                              "Unbebaut",
                            ].map((value) => (
                              <option key={value}>{value}</option>
                            ))}
                          </select>
                          {error("condition")}
                        </div>
                      </div>
                      <p className="form-hint">
                        Auch renovierungsbedürftige Immobilien sind willkommen.
                      </p>
                    </>
                  ) : null}
                  {step === 2 ? (
                    <>
                      <p className="enquiry-intro">
                        Wir freuen uns auf den Kontakt mit Ihnen.
                      </p>
                      <div className="field">
                        <label htmlFor="name">
                          Ihr Name <span>*</span>
                        </label>
                        <input
                          id="name"
                          name="name"
                          autoComplete="name"
                          value={data.name}
                          maxLength={100}
                          onChange={(e) => update("name", e.target.value)}
                          {...fieldAttributes("name")}
                        />
                        {error("name")}
                      </div>
                      <div className="field-row">
                        <div className="field">
                          <label htmlFor="email">
                            E-Mail-Adresse <span>*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            value={data.email}
                            maxLength={254}
                            onChange={(e) => update("email", e.target.value)}
                            {...fieldAttributes("email")}
                          />
                          {error("email")}
                        </div>
                        <div className="field">
                          <label htmlFor="phone">
                            Telefonnummer <small>optional</small>
                          </label>
                          <input
                            id="phone"
                            name="phone"
                            type="tel"
                            autoComplete="tel"
                            value={data.phone}
                            maxLength={40}
                            onChange={(e) => update("phone", e.target.value)}
                            {...fieldAttributes("phone")}
                          />
                          {error("phone")}
                        </div>
                      </div>
                      <div className="field">
                        <label htmlFor="message">
                          Noch etwas Wichtiges? <small>optional</small>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          rows={3}
                          value={data.message}
                          maxLength={2000}
                          onChange={(e) => update("message", e.target.value)}
                          {...fieldAttributes("message")}
                        />
                        {error("message")}
                      </div>
                      <label className="consent-label">
                        <input
                          id="consent"
                          type="checkbox"
                          checked={data.consent}
                          onChange={(e) => update("consent", e.target.checked)}
                          {...fieldAttributes("consent")}
                        />
                        <span>
                          Ich möchte mit GRI Grundbesitz Kontakt aufnehmen.
                          Meine Angaben werden für einen E-Mail-Entwurf
                          verwendet.
                        </span>
                      </label>
                      {error("consent")}
                      <p className="form-hint">
                        Ihre Angaben werden hier nicht gespeichert oder
                        versendet. Im nächsten Schritt öffnen Sie den Entwurf in
                        Ihrem E-Mail-Programm.
                      </p>
                    </>
                  ) : null}
                  <div className="enquiry-actions">
                    {step > 0 ? (
                      <button
                        type="button"
                        className="back-button"
                        onClick={() => {
                          setStep(step - 1);
                          setErrors({});
                        }}
                      >
                        <ArrowLeft size={17} />
                        Zurück
                      </button>
                    ) : (
                      <span className="form-hint">* Pflichtangaben</span>
                    )}
                    <button className="action-button" type="submit">
                      <span>
                        {step === 2 ? "E-Mail vorbereiten" : "Weiter"}
                      </span>
                      <span className="action-icon">
                        <ArrowRight size={19} />
                      </span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="enquiry-complete">
                  <div className="complete-icon">
                    <Mail size={28} strokeWidth={1.4} />
                  </div>
                  <p>
                    Ihr Entwurf ist bereit. Öffnen Sie ihn in Ihrem
                    E-Mail-Programm, prüfen Sie die Angaben und senden Sie die
                    Nachricht selbst ab.
                  </p>
                  <dl className="enquiry-summary">
                    <div>
                      <dt>Ihre Immobilie</dt>
                      <dd>{data.propertyType}</dd>
                    </div>
                    <div>
                      <dt>Standort</dt>
                      <dd>{data.location}</dd>
                    </div>
                    <div>
                      <dt>Ihr Name</dt>
                      <dd>{data.name}</dd>
                    </div>
                  </dl>
                  <a
                    className="action-button"
                    href={mailto}
                    onClick={() => setDraftOpened(true)}
                  >
                    <span>E-Mail-Entwurf öffnen</span>
                    <span className="action-icon">
                      <ArrowUpRight size={20} />
                    </span>
                  </a>
                  {draftOpened ? (
                    <p className="draft-feedback" role="status">
                      Bitte prüfen und versenden Sie die Nachricht in Ihrem
                      E-Mail-Programm. Hier wurde keine Nachricht versendet.
                    </p>
                  ) : null}
                  <p className="form-hint">
                    Kein E-Mail-Programm eingerichtet? Rufen Sie uns an:{" "}
                    <a href="tel:+4917623288447">+49 176 23288447</a>
                  </p>
                  <button
                    className="back-button"
                    onClick={() => {
                      setStep(2);
                      setDraftOpened(false);
                    }}
                  >
                    <ArrowLeft size={17} />
                    Angaben bearbeiten
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </dialog>
  );
}
