import type { ReactNode } from "react";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { CONTACTS } from "../content";
import { ActionButton, Reveal, SectionLabel, Star } from "./Shared";

export function Family(): ReactNode {
  const generations = [
    {
      number: "01",
      who: "Die Urgroßmutter.",
      title: "Jede Geschichte braucht einen Anfang.",
      body: "Mit unserer Urgroßmutter beginnt die Geschichte unseres Familienunternehmens. Sie legte den Grundstein für das, was GRI Grundbesitz heute ist.",
      word: "Der Anfang.",
    },
    {
      number: "02",
      who: "Der Großvater.",
      title: "Wissen, das weitergegeben wird.",
      body: "Unser Großvater übernahm das Immobiliengeschäft und führte die Arbeit seiner Mutter fort. Aus dem Anfang wurde eine Tradition.",
      word: "Das Vertrauen.",
    },
    {
      number: "03",
      who: "Der Vater.",
      title: "Verantwortung bleibt in der Familie.",
      body: "Die nächste Generation führte das Unternehmen weiter: unser Vater. Mit ihm gingen Erfahrung und Verantwortung erneut in vertraute Hände über.",
      word: "Die Haltung.",
    },
    {
      number: "04",
      who: "Die Brüder.",
      title: "Die Geschichte geht weiter. Mit uns.",
      body: "Heute führen mein Bruder und ich das Familiengeschäft weiter. Mit dem Wissen von vier Generationen und einem klaren Blick nach vorn. Wir kaufen Immobilien in NRW – persönlich, kompetent und seriös.",
      word: "Die Zukunft.",
    },
  ];
  return (
    <>
      <section className="inner-hero family-hero section-pad">
        <SectionLabel number="GRI">Unser Familienunternehmen</SectionLabel>
        <div className="family-headline">
          <Reveal>
            <h1>
              Mit Herkunft.
              <br />
              Mit Haltung.
              <br />
              <span className="serif-word">Mit Zukunft.</span>
              <span className="blue-period">*</span>
            </h1>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="family-years">
              <strong>40</strong>
              <span>
                Jahre Familiengeschichte.
                <br />
                Vier Generationen. Ein guter Grund.
              </span>
            </div>
          </Reveal>
        </div>
        <div className="family-hero-bottom">
          <p>
            Immobilien wechseln den Besitzer.
            <br />
            Unsere Werte bleiben in der Familie.
          </p>
          <Star className="family-star" />
        </div>
      </section>
      <div className="family-photo">
        <img
          src="/images/homes.webp"
          alt="Europäische Wohnhäuser mit gewachsener Bausubstanz"
          width="1800"
          height="1100"
        />
        <div className="family-photo-caption">Was bleibt, ist Vertrauen.</div>
      </div>
      <section className="generation-section section-pad">
        <div className="generation-intro">
          <SectionLabel number="01–04">
            Von Generation zu Generation
          </SectionLabel>
          <h2>
            Gute Werte
            <br />
            haben <span className="serif-word">Bestand.</span>
          </h2>
          <p>
            Vier Generationen haben unser Familienunternehmen geprägt. Jede hat
            etwas weitergegeben, das man nicht in Quadratmetern messen kann.
          </p>
          <a href="#/kontakt" className="text-link">
            Lernen wir uns kennen
            <ArrowUpRight size={22} />
          </a>
        </div>
        <div className="generation-list">
          {generations.map((g) => (
            <Reveal className="generation-card" key={g.number}>
              <span className="generation-number">{g.number}</span>
              <div className="generation-who">{g.who}</div>
              <h3>{g.title}</h3>
              <p>{g.body}</p>
              <span className="generation-word">{g.word}</span>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="family-statement">
        <Star />
        <Reveal>
          <p>
            Wir kaufen Immobilien.
            <br />
            <span className="serif-word">Und übernehmen Verantwortung.</span>
          </p>
          <span>GRI GRUNDBESITZ · NORDRHEIN-WESTFALEN</span>
        </Reveal>
      </section>
    </>
  );
}

export function Contact({ onEnquire }: { onEnquire: () => void }): ReactNode {
  return (
    <>
      <section className="inner-hero contact-hero section-pad">
        <SectionLabel number="HALLO">Ihr nächster Schritt</SectionLabel>
        <Reveal>
          <h1>
            Eine Immobilie.
            <br />
            Eine Frage.
            <br />
            <span className="serif-word">Einfach melden.</span>
            <span className="blue-period">↗</span>
          </h1>
        </Reveal>
        <div className="contact-hero-bottom">
          <p>
            Manchmal beginnt etwas Gutes mit einem kurzen Gespräch.
            <br />
            Wir freuen uns darauf, von Ihnen und Ihrer Immobilie zu hören.
          </p>
          <ActionButton onClick={onEnquire}>Immobilie anbieten</ActionButton>
        </div>
      </section>
      <section className="contact-detail-section section-pad">
        <SectionLabel number="01">Direkt. Persönlich. Für Sie da.</SectionLabel>
        <div className="contact-cards">
          {CONTACTS.map((c, i) => (
            <Reveal key={c.email} delay={i * 0.1}>
              <article className="contact-card">
                <div className="contact-card-top">
                  <span>Ihr Kontakt / 0{i + 1}</span>
                  <Star />
                </div>
                <a className="contact-phone" href={`tel:${c.phoneHref}`}>
                  <Phone size={22} strokeWidth={1.5} />
                  <span>{c.phone}</span>
                  <ArrowUpRight size={26} />
                </a>
                <a className="contact-email" href={`mailto:${c.email}`}>
                  <Mail size={20} strokeWidth={1.5} />
                  <span>{c.email}</span>
                  <ArrowUpRight size={23} />
                </a>
                <p>Ihre Immobilie. Unser offenes Ohr.</p>
              </article>
            </Reveal>
          ))}
        </div>
        <div className="contact-promise">
          <span className="status-dot" />
          <p>
            Die erste Einschätzung ist kostenlos und unverbindlich.
            <br />
            Jede Anfrage behandeln wir persönlich und vertraulich.
          </p>
        </div>
      </section>
      <section className="contact-invite section-pad">
        <div>
          <p className="eyebrow">Noch keinen Überblick über alle Unterlagen?</p>
          <h2>
            Ein Anfang
            <br />
            <span className="serif-word">reicht schon.</span>
          </h2>
          <p>
            Sie müssen nicht alles vorbereitet haben. Für das erste Gespräch
            reichen ein paar Eckdaten zu Ihrer Immobilie in NRW. Den Rest
            besprechen wir gemeinsam.
          </p>
          <ActionButton onClick={onEnquire}>
            Den ersten Schritt machen
          </ActionButton>
        </div>
        <div className="contact-graphic" aria-hidden="true">
          <div className="graphic-square square-one" />
          <div className="graphic-square square-two" />
          <div className="graphic-square square-three" />
          <ArrowUpRight />
        </div>
      </section>
    </>
  );
}
