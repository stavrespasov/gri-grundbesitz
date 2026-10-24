import { useRef, useState, type ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { ArrowDown, ArrowUpRight, Plus, Minus } from "lucide-react";
import { PROPERTY_CONTENT, PROCESS, FAQS } from "../content";
import { ActionButton, BrandMark, Reveal, SectionLabel, Star } from "./Shared";

interface HomeProps {
  onEnquire: (propertyType?: string) => void;
}

function Hero({ onEnquire }: HomeProps): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const titleX = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);
  return (
    <section className="hero" ref={ref} aria-labelledby="hero-title">
      <div className="hero-topline">
        <span>
          <span className="status-dot" />
          Wir kaufen Immobilien in NRW.
        </span>
        <span>Familiengeführt. Seit 40 Jahren.</span>
      </div>
      <h1 id="hero-title" className="hero-brand" aria-label="GRI Grundbesitz">
        <motion.span
          style={reduced ? undefined : { x: titleX }}
          aria-hidden="true"
        >
          {"GRI GRUNDBESITZ".split("").map((letter, i) => (
            <motion.span
              key={i}
              className={letter === " " ? "brand-space" : "brand-letter"}
              initial={reduced ? false : { y: "110%", rotate: 5 }}
              animate={{ y: 0, rotate: 0 }}
              transition={{
                duration: 0.95,
                delay: i * 0.035,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {letter === " " ? "\u00a0" : letter}
            </motion.span>
          ))}
        </motion.span>
      </h1>
      <div className="hero-grid">
        <div className="hero-copy">
          <Reveal delay={0.25}>
            <p className="eyebrow">Werte erkennen. Zukunft gestalten.</p>
            <h2>
              Ein guter
              <br />
              Grund für
              <br />
              <span className="serif-word">Neues.</span>
              <span className="blue-period">*</span>
            </h2>
          </Reveal>
          <Reveal delay={0.4}>
            <p className="hero-description">
              Ihre Immobilie hat Geschichte.
              <br />
              Wir geben ihr eine neue Perspektive.
              <br />
              Schnell, fair und persönlich.
            </p>
            <ActionButton onClick={() => onEnquire()}>
              Immobilie anbieten
            </ActionButton>
            <span className="button-note">Kostenlos & unverbindlich</span>
          </Reveal>
          <a
            className="hero-scroll"
            href="#ankauf"
            onClick={(e) => {
              e.preventDefault();
              document
                .getElementById("ankauf")
                ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
            }}
          >
            <span>
              <ArrowDown size={20} />
            </span>
            <span>Gute Gründe entdecken</span>
          </a>
        </div>
        <motion.div
          className="hero-image-wrap"
          initial={
            reduced ? false : { clipPath: "inset(8% 0 8% 0)", opacity: 0 }
          }
          animate={{ clipPath: "inset(0% 0 0% 0)", opacity: 1 }}
          transition={{ duration: 1.3, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.img
            src="/images/hero.webp"
            alt="Markante europäische Wohnarchitektur mit Balkonen und klaren Linien"
            className="hero-image"
            fetchPriority="high"
            width="1800"
            height="1400"
            style={reduced ? undefined : { y: imageY }}
          />
          <div className="image-shade" />
          <div className="photo-coordinate">
            <span className="crosshair">+</span>Räume mit Perspektive.
          </div>
          <div className="hero-photo-footer">
            <span>Immobilien. In guten Händen.</span>
            <span>NRW ↗</span>
          </div>
          <div className="experience-seal">
            <svg viewBox="0 0 120 120" className="seal-text" aria-hidden="true">
              <defs>
                <path
                  id="seal-circle"
                  d="M60,60m-44,0a44,44 0 1,1 88,0a44,44 0 1,1 -88,0"
                />
              </defs>
              <text>
                <textPath href="#seal-circle">
                  VIER GENERATIONEN · EIN VERSPRECHEN ·{" "}
                </textPath>
              </text>
            </svg>
            <div>
              <strong>40</strong>
              <span>JAHRE</span>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="hero-bottomline">
        <span>Ein Familienunternehmen. Ein klarer Fokus.</span>
        <span>
          Einfamilienhäuser <i /> Mehrfamilienhäuser <i /> Wohnungen <i />{" "}
          Grundstücke
        </span>
        <BrandMark />
      </div>
    </section>
  );
}

function PropertySection({ onEnquire }: HomeProps): ReactNode {
  const [active, setActive] = useState(0);
  const property = PROPERTY_CONTENT[active];
  return (
    <section
      className="property-section section-pad"
      id="ankauf"
      aria-labelledby="property-title"
    >
      <SectionLabel number="01">Unser Ankaufprofil</SectionLabel>
      <div className="section-heading-row">
        <Reveal>
          <h2 id="property-title">
            Wir sehen mehr
            <br />
            als <span className="serif-word">vier Wände.</span>
          </h2>
        </Reveal>
        <Reveal>
          <p>
            Ein neuer Lebensabschnitt beginnt oft mit einer Entscheidung. Wir
            machen Ihnen den Immobilienverkauf so einfach wie möglich.
          </p>
        </Reveal>
      </div>
      <div className="property-explorer">
        <div
          className="property-tabs"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Immobilienarten"
        >
          {PROPERTY_CONTENT.map((item, i) => (
            <button
              role="tab"
              id={`property-tab-${i}`}
              aria-selected={active === i}
              aria-controls="property-panel"
              tabIndex={active === i ? 0 : -1}
              key={item.name}
              className={`property-tab ${active === i ? "active" : ""}`}
              onClick={() => setActive(i)}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                  event.preventDefault();
                  const next =
                    (i +
                      (event.key === "ArrowDown" ? 1 : -1) +
                      PROPERTY_CONTENT.length) %
                    PROPERTY_CONTENT.length;
                  setActive(next);
                  document.getElementById(`property-tab-${next}`)?.focus();
                }
              }}
            >
              <span className="tab-number">{item.number}</span>
              <span>{item.title}</span>
              <ArrowUpRight size={25} />
            </button>
          ))}
          <div className="property-aside">
            <span className="status-dot" />
            <p>
              Mit Potenzial. Mit Charakter.
              <br />
              Auch mit Renovierungsbedarf.
            </p>
          </div>
        </div>
        <div
          className="property-panel"
          role="tabpanel"
          id="property-panel"
          aria-labelledby={`property-tab-${active}`}
        >
          <div className="property-image">
            <AnimatePresence mode="wait">
              <motion.img
                key={property.name}
                src={property.image}
                alt={`Architektur als Illustration für ${property.title}`}
                width="1200"
                height="900"
                loading="lazy"
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              />
            </AnimatePresence>
            <span className="property-image-label">{property.number} / 04</span>
          </div>
          <div className="property-detail">
            <div>
              <h3>{property.subtitle}</h3>
              <p>{property.description}</p>
            </div>
            <button
              className="round-button"
              aria-label={`${property.name} anbieten`}
              onClick={() => onEnquire(property.name)}
            >
              <ArrowUpRight size={26} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Manifesto(): ReactNode {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], ["10%", "-18%"]);
  return (
    <section className="manifesto" ref={ref}>
      <div className="manifesto-top">
        <span>Immobilien sind Vertrauenssache.</span>
        <span>Wir nehmen das persönlich.</span>
      </div>
      <motion.div
        className="manifesto-type"
        style={reduced ? undefined : { x }}
      >
        GUTER GRUND
        <Star />
        GUTES GEFÜHL
        <Star />
      </motion.div>
      <div className="manifesto-bottom">
        <p>
          Keine leeren Versprechen.
          <br />
          Sondern ein ehrliches Gespräch.
        </p>
        <a href="#/familie" className="text-link">
          Die Menschen hinter GRI
          <ArrowUpRight size={22} />
        </a>
      </div>
    </section>
  );
}

export function Home({ onEnquire }: HomeProps): ReactNode {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <>
      <Hero onEnquire={onEnquire} />
      <PropertySection onEnquire={onEnquire} />
      <Manifesto />
      <section
        className="values-section section-pad"
        aria-labelledby="values-title"
      >
        <SectionLabel number="02">Gute Gründe für GRI</SectionLabel>
        <div className="values-grid">
          <Reveal>
            <h2 id="values-title">
              Weniger Aufwand.
              <br />
              <span className="serif-word">Mehr Vertrauen.</span>
            </h2>
            <p className="values-intro">
              Ein Verkauf ist mehr als eine Unterschrift. Deshalb begleiten wir
              Sie so, wie wir selbst begleitet werden möchten.
            </p>
            <a href="#/familie" className="text-link">
              Unser Familienunternehmen
              <ArrowUpRight size={22} />
            </a>
          </Reveal>
          <div className="value-list">
            {[
              {
                title: "Fair von Anfang an.",
                body: "Eine kostenlose, unverbindliche Ersteinschätzung und ein ehrlicher Blick auf den Wert Ihrer Immobilie.",
              },
              {
                title: "Persönlich. Und diskret.",
                body: "Sie sprechen direkt mit uns. Ihre Situation, Ihre Fragen und Ihre Immobilie behandeln wir vertraulich.",
              },
              {
                title: "Kompetenz mit Substanz.",
                body: "40 Jahre Familiengeschichte im Immobiliengeschäft. Erfahrung, die weitergegeben wird.",
              },
              {
                title: "Einfach weiterkommen.",
                body: "Klare Absprachen und ein unkomplizierter Ablauf. Damit aus einer großen Entscheidung ein guter nächster Schritt wird.",
              },
            ].map((v, i) => (
              <Reveal key={v.title} delay={i * 0.05}>
                <article className="value-item">
                  <span className="value-number">0{i + 1}</span>
                  <div>
                    <h3>{v.title}</h3>
                    <p>{v.body}</p>
                  </div>
                  <Plus size={21} />
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
      <section
        className="process-section section-pad"
        id="ablauf"
        aria-labelledby="process-title"
      >
        <SectionLabel number="03">So einfach geht’s</SectionLabel>
        <div className="section-heading-row">
          <Reveal>
            <h2 id="process-title">
              Von Ihrem ersten Hallo.
              <br />
              Bis zum <span className="serif-word">guten Gefühl.</span>
            </h2>
          </Reveal>
          <p>
            Vier Schritte. Ein direkter Kontakt.
            <br />
            Und Sie wissen immer, woran Sie sind.
          </p>
        </div>
        <div className="process-grid">
          {PROCESS.map((step, i) => (
            <Reveal key={step.number} delay={i * 0.1}>
              <article className="process-card">
                <span className="process-number">{step.number}</span>
                <div className="process-line">
                  <span />
                  <ArrowUpRight size={19} />
                </div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="region-section section-pad">
        <div className="region-grid">
          <div>
            <SectionLabel number="04">Hier sind wir zu Hause</SectionLabel>
            <Reveal>
              <h2>
                Unsere Region.
                <br />
                Unser <span className="serif-word">Fundament.</span>
              </h2>
              <p>
                Nordrhein-Westfalen ist voller Möglichkeiten. Wir kaufen
                Immobilien im gesamten Bundesland – vom Rheinland bis nach
                Westfalen, von der Stadt bis aufs Land.
              </p>
              <div className="city-list">
                <span>Düsseldorf</span>
                <span>Köln</span>
                <span>Essen</span>
                <span>Dortmund</span>
                <span>Bonn</span>
                <span>Münster</span>
                <span>und ganz NRW</span>
              </div>
            </Reveal>
          </div>
          <NRWMap />
        </div>
      </section>
      <section className="faq-section section-pad">
        <SectionLabel number="05">Kurz geklärt</SectionLabel>
        <div className="faq-grid">
          <Reveal>
            <h2>
              Gute Fragen.
              <br />
              <span className="serif-word">Klare Antworten.</span>
            </h2>
            <p>
              Noch etwas offen?
              <br />
              <a href="#/kontakt" className="text-link">
                Sprechen wir darüber
                <ArrowUpRight size={20} />
              </a>
            </p>
          </Reveal>
          <div className="faq-list">
            {FAQS.map((faq, i) => (
              <div
                className={`faq-item ${openFaq === i ? "open" : ""}`}
                key={faq.question}
              >
                <h3>
                  <button
                    aria-expanded={openFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    {faq.question}
                    {openFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                  </button>
                </h3>
                <div
                  className="faq-answer"
                  id={`faq-answer-${i}`}
                  hidden={openFaq !== i}
                >
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function NRWMap(): ReactNode {
  return (
    <div className="nrw-map">
      <span className="map-caption">51° N / 7° O</span>
      <svg
        viewBox="0 0 420 420"
        role="img"
        aria-label="Stilisierte Karte von Nordrhein-Westfalen mit Städten im Rheinland und in Westfalen"
      >
        <defs>
          <pattern
            id="map-grid"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M22 0H0V22"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              opacity="0.15"
            />
          </pattern>
        </defs>
        <rect width="420" height="420" fill="url(#map-grid)" />
        <path
          className="map-shape"
          d="M260 34 286 45 288 67 325 77 329 102 357 121 341 146 360 169 340 195 311 196 306 219 278 239 284 268 252 275 234 301 206 299 189 325 165 316 149 349 126 337 113 366 89 345 79 318 56 299 74 272 57 247 76 221 67 202 91 185 90 162 115 150 128 124 156 133 181 113 196 82 224 78 231 50Z"
        />
        <g className="map-cities">
          {[
            { x: 125, y: 246, label: "Düsseldorf", dx: -76, dy: 20 },
            { x: 140, y: 283, label: "Köln", dx: 10, dy: 5 },
            { x: 149, y: 218, label: "Essen", dx: -45, dy: -13 },
            { x: 204, y: 211, label: "Dortmund", dx: 12, dy: 5 },
            { x: 235, y: 140, label: "Münster", dx: 12, dy: 5 },
          ].map((c) => (
            <g key={c.label}>
              <circle cx={c.x} cy={c.y} r="4" />
              <text x={c.x + c.dx} y={c.y + c.dy}>
                {c.label}
              </text>
            </g>
          ))}
        </g>
        <text className="map-nrw" x="268" y="333">
          NRW
        </text>
        <path d="M370 30v25m-5-20 5-5 5 5" fill="none" stroke="currentColor" />
        <text x="366" y="22" fontSize="11" fill="currentColor">
          N
        </text>
      </svg>
      <span className="map-footer">
        <span className="status-dot" />
        Unser Fokus: ganz Nordrhein-Westfalen.
      </span>
    </div>
  );
}
