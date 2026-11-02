import { useState, type ReactNode } from "react";
import { ArrowDown, ArrowUpRight, Check, Mail, Phone } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { CITIES, CONTACTS, PROCESS, PROPERTIES } from "../content";
import { ActionButton, Reveal, SectionLabel } from "./Shared";

interface HomeProps {
  onEnquire: (propertyType?: string) => void;
}

function Hero({ onEnquire }: HomeProps): ReactNode {
  const reduced = useReducedMotion();
  return (
    <section
      className="hero"
      id="start"
      tabIndex={-1}
      aria-labelledby="hero-title"
    >
      <motion.div
        className="hero-photo"
        initial={reduced ? false : { opacity: 0, scale: 1.035 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <img
          src="/images/v2-hero.webp"
          alt="Europäische Wohnarchitektur mit gewachsener Bausubstanz"
          width="2000"
          height="1300"
          fetchPriority="high"
        />
      </motion.div>
      <div className="hero-shade" />
      <div className="hero-frame" aria-hidden="true">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="hero-content">
        <p className="eyebrow hero-eyebrow">
          <span /> Immobilienankauf · Niederrhein & Rheinland
        </p>
        <h1 id="hero-title">
          Wir kaufen
          <br />
          <em>Immobilien.</em>
        </h1>
        <p className="hero-subtitle">Persönlich. In Ihrer Region.</p>
        <p className="hero-description">
          Häuser, Wohnungen und Grundstücke – auch mit Renovierungsbedarf. Wir
          sehen den Wert Ihrer Immobilie.
        </p>
        <div className="hero-actions">
          <ActionButton light onClick={() => onEnquire()}>
            Immobilie anbieten
          </ActionButton>
          <a className="hero-phone" href={`tel:${CONTACTS[0].phoneHref}`}>
            <Phone size={17} />
            Anrufen
          </a>
        </div>
        <p className="hero-note">
          <Check size={13} /> Kostenlose & unverbindliche Ersteinschätzung
        </p>
      </div>
      <div className="hero-experience">
        <span>In der Familie verwurzelt.</span>
        <strong>
          40<span>Jahre</span>
        </strong>
        <span>Mit Blick nach vorn.</span>
      </div>
      <a className="hero-discover" href="#ankauf">
        <span>Unser Ankaufprofil</span>
        <ArrowDown size={17} />
      </a>
      <span className="hero-location" aria-hidden="true">
        Ein guter Grund. Ein gutes Gespräch.
      </span>
    </section>
  );
}

function Acquisition({ onEnquire }: HomeProps): ReactNode {
  return (
    <section
      className="acquisition section-space"
      id="ankauf"
      tabIndex={-1}
      aria-labelledby="acquisition-title"
    >
      <SectionLabel number="01">Was wir kaufen</SectionLabel>
      <div className="acquisition-grid">
        <Reveal className="acquisition-intro">
          <h2 id="acquisition-title">
            Jede Immobilie.
            <br />
            <em>Ein eigener Wert.</em>
          </h2>
          <p>
            Gepflegt oder renovierungsbedürftig: Wir betrachten Ihre Immobilie
            individuell. Offen, fair und mit Erfahrung.
          </p>
          <div className="small-assurance">
            <span />
            <span>
              Wir kaufen selbst.
              <br />
              Sie sprechen direkt mit uns.
            </span>
          </div>
        </Reveal>
        <div className="property-list">
          {PROPERTIES.map((property) => (
            <button
              key={property.type}
              className="property-row"
              onClick={() => onEnquire(property.type)}
              aria-label={`${property.type} anbieten`}
            >
              <span className="property-number">{property.number}</span>
              <span className="property-row-copy">
                <span className="property-title">{property.title}</span>
                <span className="property-note">{property.note}</span>
              </span>
              <span className="property-arrow">
                <ArrowUpRight size={21} strokeWidth={1.4} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <div className="process-intro">
        <span>Ein klarer Weg.</span>
        <span>Vom ersten Gespräch bis zum Kauf.</span>
      </div>
      <div className="process-grid">
        {PROCESS.map((step, index) => (
          <Reveal key={step.title} delay={index * 0.06}>
            <article className="process-step">
              <span className="step-number">0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

function Family(): ReactNode {
  return (
    <section
      className="family"
      id="familie"
      tabIndex={-1}
      aria-labelledby="family-title"
    >
      <div className="family-image">
        <img
          src="/images/detail.webp"
          alt="Architektonisches Detail eines Wohngebäudes im Saarland"
          width="1400"
          height="1700"
          loading="lazy"
        />
        <span className="family-image-caption">Was bleibt, sind Werte.</span>
        <span className="family-image-frame" aria-hidden="true" />
      </div>
      <div className="family-content">
        <SectionLabel number="02">
          Eine Familie. Vier Generationen.
        </SectionLabel>
        <Reveal>
          <h2 id="family-title">
            Immobilien wechseln.
            <br />
            <em>Vertrauen bleibt.</em>
          </h2>
          <p>
            Was unsere Urgroßmutter begann, führten unser Großvater und unser
            Vater weiter. Heute übernehmen wir als Brüder die Verantwortung. Mit
            40 Jahren Familiengeschichte und einem persönlichen Blick auf jede
            Immobilie.
          </p>
          <div className="family-facts">
            <div>
              <strong>40</strong>
              <span>Jahre Erfahrung</span>
            </div>
            <div>
              <strong>4</strong>
              <span>Generationen</span>
            </div>
          </div>
          <a className="text-link" href="#kontakt">
            Lernen wir uns kennen
            <ArrowUpRight size={18} />
          </a>
        </Reveal>
        <div className="family-signature">Herkunft. Haltung. Zukunft.</div>
      </div>
    </section>
  );
}

// Equirectangular projection with longitude corrected at the region's central latitude.
function project(lat: number, lon: number): [number, number] {
  return [80 + (lon - 6.25) * 450, 65 + (51.42 - lat) * 700];
}

function RegionalMap({ active }: { active: string | null }): ReactNode {
  const rhine: [number, number][] = [
    [51.46, 6.69],
    [51.39, 6.72],
    [51.34, 6.68],
    [51.28, 6.73],
    [51.24, 6.76],
    [51.21, 6.73],
    [51.17, 6.83],
    [51.1, 6.84],
    [51.04, 6.91],
    [50.98, 6.98],
    [50.93, 6.97],
    [50.86, 7.02],
  ];
  const river = rhine
    .map(
      ([lat, lon], index) =>
        `${index ? "L" : "M"}${project(lat, lon).join(" ")}`,
    )
    .join(" ");
  return (
    <div className="regional-map">
      <div className="map-topline">
        <span>Niederrhein & Rheinland</span>
        <span>N ↑</span>
      </div>
      <svg
        viewBox="0 0 520 510"
        role="img"
        aria-labelledby="map-title map-description"
      >
        <title id="map-title">Unser regionaler Schwerpunkt</title>
        <desc id="map-description">
          Schematische Karte der sieben genannten Städte am Niederrhein und im
          Rheinland. Markierungen zeigen Stadtzentren, keine Bürostandorte.
        </desc>
        <defs>
          <pattern
            id="region-grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M40 0H0V40"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.08"
            />
          </pattern>
        </defs>
        <rect width="520" height="510" fill="url(#region-grid)" />
        <path d={river} className="map-river" />
        <text
          x="365"
          y="333"
          className="river-name"
          transform="rotate(67 365 333)"
        >
          Rhein
        </text>
        <path d="M80 86V65h22M439 444v21h-22" className="map-corners" />
        {CITIES.map((city) => {
          const [x, y] = project(city.lat, city.lon);
          return (
            <g
              key={city.name}
              className={`map-city ${active === city.name ? "is-active" : ""}`}
            >
              <circle className="map-city-halo" cx={x} cy={y} r="12" />
              <circle className="map-city-dot" cx={x} cy={y} r="3.8" />
              <text x={x + city.dx} y={y + city.dy} textAnchor={city.anchor}>
                {city.name}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="map-bottomline">
        <span className="map-key-dot" />
        Unser Fokus. Unsere Region.<span>NRW / DE</span>
      </div>
    </div>
  );
}

function Region(): ReactNode {
  const [active, setActive] = useState<string | null>(null);
  return (
    <section
      className="region section-space"
      id="region"
      tabIndex={-1}
      aria-labelledby="region-title"
    >
      <div className="region-grid">
        <Reveal>
          <SectionLabel number="03">Nah dran. Vor Ort.</SectionLabel>
          <h2 id="region-title">
            Hier kennen
            <br />
            <em>wir uns aus.</em>
          </h2>
          <p>
            Unser Schwerpunkt liegt am Niederrhein und im Rheinland. Mit kurzen
            Wegen und einem Gespür für die Region.
          </p>
          <ul className="city-list">
            {CITIES.map((city) => (
              <li key={city.name}>
                <button
                  aria-label={`${city.name} auf der Karte hervorheben`}
                  onMouseEnter={() => setActive(city.name)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(city.name)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive(city.name)}
                >
                  <span />
                  {city.name}
                  <ArrowUpRight size={13} />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
        <RegionalMap active={active} />
      </div>
    </section>
  );
}

function Contact({ onEnquire }: HomeProps): ReactNode {
  return (
    <section
      className="contact section-space"
      id="kontakt"
      tabIndex={-1}
      aria-labelledby="contact-title"
    >
      <SectionLabel number="04">
        Der erste Schritt ist ein Gespräch.
      </SectionLabel>
      <div className="contact-heading">
        <Reveal>
          <h2 id="contact-title">
            Ihre Immobilie.
            <br />
            <em>Unser offenes Ohr.</em>
          </h2>
          <p>
            Erzählen Sie uns, was Sie vorhaben. Wir nehmen uns Zeit für Ihre
            Fragen – persönlich und vertraulich.
          </p>
        </Reveal>
        <ActionButton light onClick={() => onEnquire()}>
          Immobilie anbieten
        </ActionButton>
      </div>
      <div className="contact-grid">
        {CONTACTS.map((contact, index) => (
          <article className="contact-person" key={contact.email}>
            <div className="contact-person-label">
              <span>
                {contact.label} / 0{index + 1}
              </span>
              <ArrowUpRight size={17} />
            </div>
            <a className="contact-phone" href={`tel:${contact.phoneHref}`}>
              <Phone size={18} strokeWidth={1.4} />
              <span>{contact.phone}</span>
            </a>
            <a className="contact-email" href={`mailto:${contact.email}`}>
              <Mail size={17} strokeWidth={1.4} />
              <span>{contact.email}</span>
            </a>
          </article>
        ))}
      </div>
      <div className="contact-footnote">
        <Check size={15} />
        <span>
          Kostenlose Ersteinschätzung. Keine Verpflichtung. Ein ehrliches
          Gespräch.
        </span>
      </div>
    </section>
  );
}

export function Home({ onEnquire }: HomeProps): ReactNode {
  return (
    <>
      <Hero onEnquire={onEnquire} />
      <Acquisition onEnquire={onEnquire} />
      <Family />
      <Region />
      <Contact onEnquire={onEnquire} />
    </>
  );
}
