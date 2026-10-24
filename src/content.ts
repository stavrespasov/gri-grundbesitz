export const CONTACTS = [
  {
    email: "jano.gri@gri-grundbesitz.com",
    phone: "+49 176 23288447",
    phoneHref: "+4917623288447",
    label: "Ihr direkter Kontakt",
  },
  {
    email: "m.gri@gri-grundbesitz.com",
    phone: "+49 162 7717592",
    phoneHref: "+491627717592",
    label: "Ein weiterer guter Draht",
  },
] as const;

export const PROPERTY_CONTENT = [
  {
    name: "Einfamilienhaus",
    title: "Häuser",
    subtitle: "Ein Zuhause mit Geschichte.",
    description:
      "Ob freistehend, Doppelhaushälfte oder Reihenhaus: Wir sehen uns Ihre Immobilie persönlich an. Auch dann, wenn eine Renovierung ansteht.",
    image: "/images/homes.webp",
    number: "01",
  },
  {
    name: "Mehrfamilienhaus",
    title: "Mehrfamilienhäuser",
    subtitle: "Mehr Raum. Neue Perspektiven.",
    description:
      "Wir interessieren uns für Wohngebäude unterschiedlicher Größe und Substanz. Jede Immobilie verdient einen individuellen Blick.",
    image: "/images/hero.webp",
    number: "02",
  },
  {
    name: "Eigentumswohnung",
    title: "Wohnungen",
    subtitle: "Kleine Fläche, großes Potenzial.",
    description:
      "Vermietet oder unbewohnt, gepflegt oder renovierungsbedürftig: Erzählen Sie uns von Ihrer Eigentumswohnung in NRW.",
    image: "/images/detail.webp",
    number: "03",
  },
  {
    name: "Grundstück",
    title: "Grundstücke",
    subtitle: "Hier kann Neues entstehen.",
    description:
      "Ein unbebautes Grundstück oder eine Fläche mit Bestand? Gemeinsam schauen wir auf die Möglichkeiten Ihrer Liegenschaft.",
    image: "/images/homes.webp",
    number: "04",
  },
] as const;

export const PROCESS = [
  {
    number: "01",
    title: "Erst einmal: kennenlernen.",
    body: "Sie erzählen uns von Ihrer Immobilie. Wir hören zu, klären erste Fragen und besprechen Ihre Vorstellungen. Persönlich und vertraulich.",
  },
  {
    number: "02",
    title: "Genau hinsehen.",
    body: "Wir betrachten Lage, Zustand und Potenzial individuell. Die erste Einschätzung ist für Sie kostenlos und unverbindlich.",
  },
  {
    number: "03",
    title: "Klar entscheiden.",
    body: "Wenn Ihre Immobilie zu uns passt, erhalten Sie ein faires Kaufangebot. Sie entscheiden in Ruhe und ohne Verpflichtung.",
  },
  {
    number: "04",
    title: "Gemeinsam abschließen.",
    body: "Sind wir uns einig, stimmen wir die nächsten Schritte mit Ihnen ab. Transparent, unkompliziert und mit persönlicher Begleitung bis zum Notartermin.",
  },
] as const;

export const FAQS = [
  {
    question: "Welche Immobilien kaufen Sie?",
    answer:
      "Wir interessieren uns für Einfamilienhäuser, Mehrfamilienhäuser, Eigentumswohnungen und Grundstücke in Nordrhein-Westfalen. Jede Immobilie wird individuell betrachtet.",
  },
  {
    question: "Kaufen Sie auch renovierungsbedürftige Immobilien?",
    answer:
      "Ja. Wir berücksichtigen auch Immobilien mit Renovierungs- oder Sanierungsbedarf. Entscheidend ist der individuelle Blick auf Zustand, Lage und Potenzial.",
  },
  {
    question: "Ist die erste Einschätzung wirklich kostenlos?",
    answer:
      "Ja. Die erste Einschätzung Ihrer Immobilie ist kostenlos und unverbindlich. Daraus entsteht für Sie keine Verpflichtung zum Verkauf.",
  },
  {
    question: "Sind Sie ein Makler oder kaufen Sie selbst?",
    answer:
      "Unser Schwerpunkt ist der Immobilienankauf. Diese Website richtet sich an Eigentümer, die ihre Immobilie in NRW verkaufen möchten. Wir bieten hier keine Immobilien zum Verkauf an.",
  },
] as const;
