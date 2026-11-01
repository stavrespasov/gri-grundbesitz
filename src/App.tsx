import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";
import { Home } from "./components/Home";
import { PropertyEnquiry } from "./components/PropertyEnquiry";
import { Wordmark } from "./components/Shared";
import { CONTACTS, NAVIGATION } from "./content";

function Header({ onEnquire }: { onEnquire: () => void }): ReactNode {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const element = dialog.current;
    const menuTrigger = trigger.current;
    const previousOverflow = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previousOverflow;
      menuTrigger?.focus({ preventScroll: true });
    };
  }, [open]);
  return (
    <header className="site-header">
      <a className="skip-link" href="#main">
        Zum Inhalt
      </a>
      <a
        className="brand"
        href="#start"
        aria-label="GRI Grundbesitz – Startseite"
      >
        <Wordmark />
      </a>
      <nav className="desktop-nav" aria-label="Hauptnavigation">
        {NAVIGATION.map(({ id, label }) => (
          <a key={id} href={`#${id}`}>
            {label}
          </a>
        ))}
      </nav>
      <button className="header-enquire" onClick={onEnquire}>
        Immobilie anbieten <ArrowUpRight size={16} />
      </button>
      <button
        ref={trigger}
        className="menu-trigger"
        aria-label="Menü öffnen"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
      >
        <Menu size={24} />
      </button>
      {open ? (
        <dialog
          ref={dialog}
          id="mobile-menu"
          className="mobile-menu"
          aria-labelledby="menu-title"
          onCancel={(event) => {
            event.preventDefault();
            setOpen(false);
          }}
        >
          <div className="mobile-menu-top">
            <span id="menu-title">GRI Grundbesitz</span>
            <button
              className="icon-button"
              aria-label="Menü schließen"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>
          <nav aria-label="Mobile Hauptnavigation">
            {NAVIGATION.map(({ id, label }, index) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
                <span>0{index + 1}</span>
                {label}
                <ArrowUpRight size={22} />
              </a>
            ))}
          </nav>
          <a
            className="mobile-menu-phone"
            href={`tel:${CONTACTS[0].phoneHref}`}
          >
            <Phone size={18} />
            {CONTACTS[0].phone}
          </a>
        </dialog>
      ) : null}
    </header>
  );
}

function MobileActions({
  hidden,
  onEnquire,
}: {
  hidden: boolean;
  onEnquire: () => void;
}): ReactNode {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    let heroVisible = true;
    let contactVisible = false;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target.id === "start") heroVisible = entry.isIntersecting;
        if (entry.target.id === "kontakt")
          contactVisible = entry.isIntersecting;
      });
      setVisible(!heroVisible && !contactVisible);
    });
    ["start", "kontakt"].forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, []);
  return visible ? (
    <aside
      className="mobile-actions"
      hidden={hidden}
      aria-label="Direkter Kontakt"
    >
      <a href={`tel:${CONTACTS[0].phoneHref}`}>
        <Phone size={17} />
        Anrufen
      </a>
      <button onClick={onEnquire}>
        Immobilie anbieten
        <ArrowUpRight size={17} />
      </button>
    </aside>
  ) : null;
}

export default function App(): ReactNode {
  const [enquiry, setEnquiry] = useState<{
    propertyType?: string;
    returnFocusTo: HTMLElement | null;
  } | null>(null);
  const openEnquiry = (propertyType?: string): void => {
    setEnquiry({
      propertyType,
      returnFocusTo:
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null,
    });
  };
  useEffect(() => {
    const legacy = (): void => {
      const aliases: Record<string, string> = {
        "#/": "start",
        "#/familie": "familie",
        "#/kontakt": "kontakt",
      };
      const id = aliases[window.location.hash];
      if (!id) return;
      history.replaceState(null, "", `#${id}`);
      requestAnimationFrame(() => {
        const section = document.getElementById(id);
        section?.scrollIntoView({ behavior: "instant" });
        section?.focus({ preventScroll: true });
      });
    };
    legacy();
    window.addEventListener("hashchange", legacy);
    return () => window.removeEventListener("hashchange", legacy);
  }, []);
  return (
    <>
      <Header onEnquire={() => openEnquiry()} />
      <main id="main" tabIndex={-1}>
        <Home onEnquire={openEnquiry} />
      </main>
      <footer className="site-footer">
        <div className="footer-top">
          <a href="#start" aria-label="Zurück zum Anfang">
            <Wordmark />
          </a>
          <span>
            Immobilienankauf.
            <br />
            Von Mensch zu Mensch.
          </span>
          <a className="footer-up" href="#start">
            Nach oben <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="footer-wordmark" aria-hidden="true">
          GRUNDBESITZ
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} GRI Grundbesitz</span>
          <span>Niederrhein & Rheinland</span>
          <span>Familiengeführt. Seit 40 Jahren.</span>
        </div>
      </footer>
      <MobileActions
        hidden={enquiry !== null}
        onEnquire={() => openEnquiry()}
      />
      {enquiry ? (
        <PropertyEnquiry
          initialType={enquiry.propertyType}
          returnFocusTo={enquiry.returnFocusTo}
          onClose={() => setEnquiry(null)}
        />
      ) : null}
    </>
  );
}
