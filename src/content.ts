export const CONTACTS = [
  {
    label: "Direkter Kontakt",
    email: "jano.gri@gri-grundbesitz.com",
    phone: "0162 7717592",
    phoneHref: "+491627717592",
  },
  {
    label: "Marcellino",
    email: "m.gri@gri-grundbesitz.com",
    phone: "0176 23288447",
    phoneHref: "+4917623288447",
  },
] as const;

export const NAVIGATION = [
  { id: "ankauf", label: "Ankauf" },
  { id: "familie", label: "Familie" },
  { id: "region", label: "Region" },
  { id: "kontakt", label: "Kontakt" },
] as const;

export const PROPERTIES = [
  {
    type: "Einfamilienhaus",
    title: "Einfamilienhäuser",
    note: "Ein Zuhause. Neue Möglichkeiten.",
    number: "01",
  },
  {
    type: "Mehrfamilienhaus",
    title: "Mehrfamilienhäuser",
    note: "Raum für die nächste Geschichte.",
    number: "02",
  },
  {
    type: "Eigentumswohnung",
    title: "Eigentumswohnungen",
    note: "Vermietet oder unbewohnt.",
    number: "03",
  },
  {
    type: "Grundstück",
    title: "Grundstücke",
    note: "Potenzial beginnt mit einem Grund.",
    number: "04",
  },
] as const;

export const PROCESS = [
  {
    title: "Kontakt aufnehmen",
    text: "Sie erzählen uns von Ihrer Immobilie. Wir hören zu.",
  },
  {
    title: "Prüfen & besprechen",
    text: "Wir schauen genau hin und machen bei Interesse ein faires Kaufangebot.",
  },
  {
    title: "Gemeinsam abschließen",
    text: "Wir stimmen die nächsten Schritte persönlich mit Ihnen ab.",
  },
] as const;

// City-centre coordinates; used for a schematic geographic map, not office locations.
export const CITIES = [
  {
    name: "Mönchengladbach",
    lat: 51.2,
    lon: 6.433,
    dx: -17,
    dy: 27,
    anchor: "end",
  },
  {
    name: "Viersen",
    lat: 51.25611,
    lon: 6.39722,
    dx: -15,
    dy: -15,
    anchor: "end",
  },
  {
    name: "Korschenbroich",
    lat: 51.183,
    lon: 6.517,
    dx: 14,
    dy: 28,
    anchor: "start",
  },
  {
    name: "Krefeld",
    lat: 51.333,
    lon: 6.567,
    dx: -15,
    dy: -15,
    anchor: "end",
  },
  {
    name: "Düsseldorf",
    lat: 51.2256,
    lon: 6.7767,
    dx: 15,
    dy: 24,
    anchor: "start",
  },
  {
    name: "Meerbusch",
    lat: 51.267,
    lon: 6.667,
    dx: 16,
    dy: -14,
    anchor: "start",
  },
  { name: "Köln", lat: 50.93639, lon: 6.95278, dx: 15, dy: 5, anchor: "start" },
] as const;
