import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from "motion/react";
import { ArrowUp, ArrowUpRight, Menu, X } from "lucide-react";
import { Home } from "./components/Home";
import { Contact, Family } from "./components/InnerPages";
import { PropertyEnquiry } from "./components/PropertyEnquiry";
import { ActionButton, BrandMark, Star } from "./components/Shared";
import { CONTACTS } from "./content";

type Page = "/" | "/familie" | "/kontakt";
function readPage(): Page {
  const path = window.location.hash.replace(/^#/, "");
  return path === "/familie" || path === "/kontakt" ? path : "/";
}

function Header({
  page,
  onEnquire,
}: {
  page: Page;
  onEnquire: () => void;
}): ReactNode {
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const menuDialog = useRef<HTMLDialogElement>(null);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const previousPage = useRef(page);
  useEffect(() => {
    if (previousPage.current !== page) {
      setMenuOpen(false);
      previousPage.current = page;
    }
  }, [page]);
  useEffect(() => {
    if (!menuOpen) return;
    const previousOverflow = document.body.style.overflow;
    const triggerElement = menuTrigger.current;
    const dialogElement = menuDialog.current;
    document.body.style.overflow = "hidden";
    menuDialog.current?.showModal();
    closeRef.current?.focus();
    return () => {
      dialogElement?.close();
      document.body.style.overflow = previousOverflow;
      triggerElement?.focus();
    };
  }, [menuOpen]);
  return (
    <header className="header">
      <a href="#/" className="logo" aria-label="GRI Grundbesitz Startseite">
        <BrandMark />
        <span>
          <strong>GRI</strong>
          <span>GRUNDBESITZ</span>
        </span>
      </a>
      <span className="nav-tagline">
        Werte erkennen.
        <br />
        Zukunft gestalten.
      </span>
      <nav className="desktop-nav" aria-label="Hauptnavigation">
        <a href="#/" aria-current={page === "/" ? "page" : undefined}>
          Ankauf
        </a>
        <a
          href="#/familie"
          aria-current={page === "/familie" ? "page" : undefined}
        >
          Über uns
        </a>
        <a
          href="#/kontakt"
          aria-current={page === "/kontakt" ? "page" : undefined}
        >
          Kontakt
        </a>
      </nav>
      <button className="nav-cta" onClick={onEnquire}>
        Immobilie anbieten
        <ArrowUpRight size={18} />
      </button>
      <button
        ref={menuTrigger}
        className="mobile-menu-toggle"
        aria-label="Menü öffnen"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => setMenuOpen(true)}
      >
        <Menu />
      </button>
      <AnimatePresence>
        {menuOpen ? (
          <motion.dialog
            ref={menuDialog}
            onCancel={(event) => {
              event.preventDefault();
              setMenuOpen(false);
            }}
            aria-label="Hauptnavigation"
            id="mobile-menu"
            className="mobile-menu"
            initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={reduced ? { opacity: 1 } : { clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: reduced ? 0 : 0.4 }}
            onKeyDown={(event) => {
              if (event.key === "Escape") setMenuOpen(false);
              if (event.key === "Tab") {
                const elements = Array.from(
                  event.currentTarget.querySelectorAll<HTMLElement>(
                    "a, button",
                  ),
                );
                const first = elements[0];
                const last = elements[elements.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last?.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first?.focus();
                }
              }
            }}
          >
            <div className="mobile-menu-top">
              <span>GRI GRUNDBESITZ</span>
              <button
                className="round-button"
                ref={closeRef}
                aria-label="Menü schließen"
                onClick={() => setMenuOpen(false)}
              >
                <X />
              </button>
            </div>
            <nav aria-label="Mobile Hauptnavigation">
              {[
                { url: "/", label: "Ankauf" },
                { url: "/familie", label: "Über uns" },
                { url: "/kontakt", label: "Kontakt" },
              ].map((link, i) => (
                <a
                  href={`#${link.url}`}
                  key={link.url}
                  onClick={() => setMenuOpen(false)}
                >
                  <small>0{i + 1}</small>
                  {link.label}
                  <ArrowUpRight />
                </a>
              ))}
            </nav>
            <button
              className="action-button is-light"
              onClick={() => {
                setMenuOpen(false);
                onEnquire();
              }}
            >
              Immobilie anbieten
              <ArrowUpRight />
            </button>
            <a
              href={`tel:${CONTACTS[0].phoneHref}`}
              className="mobile-menu-phone"
            >
              {CONTACTS[0].phone}
            </a>
          </motion.dialog>
        ) : null}
      </AnimatePresence>
    </header>
  );
}

function Footer({ onEnquire }: { onEnquire: () => void }): ReactNode {
  const reduced = useReducedMotion();
  return (
    <footer className="footer">
      <div className="footer-top">
        <span className="eyebrow">Gute Immobilien. Gute Gespräche.</span>
        <Star />
      </div>
      <div className="footer-invite">
        <h2>
          Ein guter Grund,
          <br />
          <span className="serif-word">in Kontakt zu kommen.</span>
        </h2>
        <ActionButton light onClick={onEnquire}>
          Immobilie anbieten
        </ActionButton>
      </div>
      <div className="footer-contact-row">
        <p>
          Wir kaufen Immobilien in NRW.
          <br />
          Schnell. Kompetent. Seriös.
        </p>
        {CONTACTS.map((c) => (
          <div className="footer-contact" key={c.email}>
            <a href={`tel:${c.phoneHref}`}>
              {c.phone}
              <ArrowUpRight size={16} />
            </a>
            <a href={`mailto:${c.email}`}>
              {c.email}
              <ArrowUpRight size={16} />
            </a>
          </div>
        ))}
      </div>
      <div className="footer-wordmark" aria-hidden="true">
        GRI GRUNDBESITZ
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} GRI Grundbesitz</span>
        <span>Vier Generationen. Ein Versprechen.</span>
        <button
          onClick={() =>
            window.scrollTo({
              top: 0,
              behavior: reduced ? "instant" : "smooth",
            })
          }
        >
          Zurück nach oben
          <ArrowUp size={15} />
        </button>
      </div>
    </footer>
  );
}

export default function App(): ReactNode {
  const [page, setPage] = useState<Page>(readPage);
  const [enquiry, setEnquiry] = useState<{ propertyType?: string } | null>(
    null,
  );
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30 });
  const pageRef = useRef(page);
  const mainRef = useRef<HTMLElement>(null);
  const attachMain = useCallback((node: HTMLElement | null): void => {
    mainRef.current = node;
    node?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const onHash = (): void => {
      const next = readPage();
      if (next !== pageRef.current) {
        pageRef.current = next;
        setPage(next);
      }
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    const titles: Record<Page, string> = {
      "/": "GRI Grundbesitz — Immobilien. In guten Händen.",
      "/familie": "Vier Generationen — GRI Grundbesitz",
      "/kontakt": "Kontakt — GRI Grundbesitz",
    };
    document.title = titles[page];
  }, [page]);
  const openEnquiry = (propertyType?: string): void =>
    setEnquiry({ propertyType });
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Zum Inhalt springen
      </a>
      <motion.div className="scroll-progress" style={{ scaleX }} />
      <Header page={page} onEnquire={() => openEnquiry()} />
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      >
        <motion.main
          id="main-content"
          tabIndex={-1}
          ref={attachMain}
          key={page}
          className="main-content"
          initial={reduced ? false : { opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -30 }}
          transition={{
            duration: reduced ? 0 : 0.35,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {page === "/" ? (
            <Home onEnquire={openEnquiry} />
          ) : page === "/familie" ? (
            <Family />
          ) : (
            <Contact onEnquire={() => openEnquiry()} />
          )}
          <Footer onEnquire={() => openEnquiry()} />
        </motion.main>
      </AnimatePresence>
      <AnimatePresence>
        {!reduced ? (
          <motion.div
            key={`wipe-${page}`}
            className="page-wipe"
            aria-hidden="true"
            initial={{ scaleY: 1, originY: 0 }}
            animate={{ scaleY: 0, originY: 0 }}
            exit={{ scaleY: 1, originY: 1 }}
            transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
          >
            <BrandMark />
          </motion.div>
        ) : null}
      </AnimatePresence>
      {enquiry !== null ? (
        <PropertyEnquiry
          initialType={enquiry.propertyType}
          onClose={() => setEnquiry(null)}
        />
      ) : null}
    </>
  );
}
