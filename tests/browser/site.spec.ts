import { expect, test, type Locator, type Page } from "@playwright/test";
import { resolve } from "node:path";

const PROPERTY_OFFERS = [
  ["Einfamilienhaus anbieten", "Einfamilienhaus"],
  ["Mehrfamilienhaus anbieten", "Mehrfamilienhaus"],
  ["Eigentumswohnung anbieten", "Eigentumswohnung"],
  ["Grundstück anbieten", "Grundstück"],
] as const;

async function expectNoHorizontalOverflow(page: Page): Promise<void> {
  await expect
    .poll(
      () =>
        page.evaluate(() => {
          const viewport = window.innerWidth;
          const scrollWidth = document.documentElement.scrollWidth;
          if (scrollWidth - viewport <= 1) return null;
          const offenders = [...document.querySelectorAll("*")]
            .filter((element) => !element.closest(".hero-photo, .skip-link"))
            .map((element) => {
              const style = getComputedStyle(element);
              const bounds = element.getBoundingClientRect();
              if (
                style.display === "none" ||
                style.visibility === "hidden" ||
                !bounds.width ||
                !bounds.height ||
                (bounds.right <= viewport + 1 && bounds.left >= -1)
              )
                return null;
              return {
                tag: element.tagName.toLowerCase(),
                class: element.getAttribute("class"),
                text: element.textContent
                  ?.trim()
                  .replace(/\s+/g, " ")
                  .slice(0, 80),
                left: Math.round(bounds.left * 100) / 100,
                right: Math.round(bounds.right * 100) / 100,
                width: Math.round(bounds.width * 100) / 100,
              };
            })
            .filter(Boolean)
            .slice(0, 20);
          return {
            viewport,
            scrollWidth,
            overflow: scrollWidth - viewport,
            offenders,
          };
        }),
      {
        message:
          "Page must fit horizontally; overflowing elements are listed below.",
      },
    )
    .toBeNull();
}

async function openEnquiry(page: Page): Promise<void> {
  await page
    .getByRole("button", { name: "Immobilie anbieten", exact: true })
    .first()
    .click();
  await expect(
    page.getByRole("dialog", { name: "Sprechen wir darüber." }),
  ).toBeVisible();
}

const COPY_MESSAGE =
  "Grüße aus Düsseldorf – ½ Anteil & Hof\nBitte nach 18 Uhr anrufen. 🏡";

async function prepareCopyDraft(page: Page): Promise<Locator> {
  await page.goto("/");
  await openEnquiry(page);
  const dialog = page.getByRole("dialog", { name: "Sprechen wir darüber." });
  await dialog.getByRole("radio", { name: "Grundstück", exact: true }).check();
  await dialog.getByLabel(/Postleitzahl.*Ort/).fill("40213 Düsseldorf");
  await dialog.getByLabel(/Ihr Name/).fill("Anaïs Weiß & Söhne");
  await dialog
    .getByLabel(/E-Mail-Adresse/)
    .fill("anais.weiss+grund@example.com");
  await dialog.getByLabel(/Telefon/).fill("+49 211 123456");
  await dialog.getByLabel(/Nachricht/).fill(COPY_MESSAGE);
  await dialog.getByText("Weitere Angaben", { exact: false }).click();
  await dialog.getByLabel(/Fläche in m²/).fill("120,5");
  await dialog.getByLabel(/Zustand/).selectOption("Renovierungsbedürftig");
  await dialog.getByRole("checkbox").check();
  await dialog
    .getByRole("button", { name: "E-Mail vorbereiten", exact: true })
    .click();
  await expect(
    dialog.getByRole("link", { name: "E-Mail-Entwurf öffnen", exact: true }),
  ).toBeVisible();
  return dialog;
}

function expectCompleteCopyText(message: string): void {
  for (const value of [
    "jano.gri@gri-grundbesitz.com",
    "Immobilienangebot: Grundstück in 40213 Düsseldorf",
    "Anaïs Weiß & Söhne",
    "anais.weiss+grund@example.com",
    "+49 211 123456",
    "120,5 m²",
    "Renovierungsbedürftig",
    COPY_MESSAGE,
  ]) {
    expect(message).toContain(value);
  }
}

test("public offer and contacts remain readable at all required viewport sizes", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const failedResponses: string[] = [];
  page.on("response", (response) => {
    if (response.status() >= 400)
      failedResponses.push(`${response.status()} ${response.url()}`);
  });
  for (const width of [320, 375, 768, 1024, 1440]) {
    await test.step(`${width}px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await page.evaluate(() => document.fonts.ready);
      const title = page.getByRole("heading", {
        level: 1,
        name: "Wir kaufen Immobilien.",
      });
      await expect(title).toHaveCount(1);
      await expect(title).toBeInViewport();
      const titleTextRight = await title.evaluate((element) => {
        const range = document.createRange();
        range.selectNodeContents(element);
        return Math.max(
          ...[...range.getClientRects()].map((rect) => rect.right),
        );
      });
      expect(
        titleTextRight,
        "The complete headline must fit inside the viewport",
      ).toBeLessThanOrEqual(width + 1);
      for (const [offer] of PROPERTY_OFFERS) {
        await expect(
          page.getByRole("button", { name: offer, exact: true }),
        ).toBeVisible();
      }
      const region = page.locator("#region");
      for (const city of [
        "Mönchengladbach",
        "Viersen",
        "Korschenbroich",
        "Krefeld",
        "Düsseldorf",
        "Meerbusch",
        "Köln",
      ]) {
        await expect(
          region.getByRole("button", {
            name: `${city} auf der Karte hervorheben`,
            exact: true,
          }),
        ).toBeVisible();
      }
      for (const email of [
        "jano.gri@gri-grundbesitz.com",
        "m.gri@gri-grundbesitz.com",
      ]) {
        await expect(
          page.getByRole("link", { name: email, exact: true }).first(),
        ).toHaveAttribute("href", `mailto:${email}`);
      }
      for (const [email, phone, href] of [
        ["jano.gri@gri-grundbesitz.com", "0162 7717592", "+491627717592"],
        ["m.gri@gri-grundbesitz.com", "0176 23288447", "+4917623288447"],
      ]) {
        const card = page.locator(".contact-person").filter({
          has: page.getByRole("link", { name: email, exact: true }),
        });
        const phoneLink = card.getByRole("link", { name: phone, exact: true });
        await expect(phoneLink).toHaveAttribute("href", `tel:${href}`);
        await expect(phoneLink).toHaveCSS("font-family", /Manrope/);
      }
      await expect(
        page.locator(".contact-person").filter({
          has: page.getByRole("link", {
            name: "m.gri@gri-grundbesitz.com",
            exact: true,
          }),
        }),
      ).toContainText("Marcellino");
      await expectNoHorizontalOverflow(page);
      expect(failedResponses).toEqual([]);
      await page.screenshot({
        path: resolve(`../artifacts/v2-${width}-hero.png`),
      });
      await page.screenshot({
        path: resolve(`../artifacts/v2-${width}.png`),
        fullPage: true,
      });
      await page.locator("#kontakt").screenshot({
        path: resolve(`../artifacts/v2-${width}-contact.png`),
      });
      const family = page.locator("#familie");
      const familyImage = family.getByRole("img", {
        name: "Modernes Wohngebäude mit hellen Fassaden und Glasbalkonen in Berlin",
        exact: true,
      });
      await expect(familyImage).toHaveAttribute("src", "/images/hero.webp");
      await familyImage.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          familyImage.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
      await family.screenshot({
        path: resolve(`../artifacts/v2-${width}-family.png`),
      });
    });
  }
});

test("header anchors and previous family/contact URLs reach their sections", async ({
  page,
}) => {
  await page.goto("/");
  for (const [name, id] of [
    ["Ankauf", "ankauf"],
    ["Familie", "familie"],
    ["Region", "region"],
    ["Kontakt", "kontakt"],
  ]) {
    await page
      .getByRole("banner")
      .getByRole("link", { name, exact: true })
      .click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
    await expect(page.locator(`#${id}`)).toBeInViewport();
  }
  for (const id of ["familie", "kontakt"]) {
    await page.goto(`/#/${id}`);
    await expect(page.locator(`#${id}`)).toBeInViewport();
    await expect(page.getByRole("heading", { level: 1 })).toHaveAccessibleName(
      "Wir kaufen Immobilien.",
    );
  }
});

test("an owner can review a complete Unicode email draft without sending", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 1000 });
  const submittedRequests: string[] = [];
  page.on("request", (request) => {
    if (!["GET", "HEAD"].includes(request.method()))
      submittedRequests.push(request.url());
  });
  await page.goto("/");
  await page
    .getByRole("button", { name: "Grundstück anbieten", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Sprechen wir darüber." });
  await expect(
    dialog.getByRole("radio", { name: "Grundstück", exact: true }),
  ).toBeChecked();
  await dialog.getByLabel(/Postleitzahl.*Ort/).fill("40213 Düsseldorf");
  await dialog.getByLabel(/Ihr Name/).fill("Anaïs Weiß & Söhne");
  await dialog
    .getByLabel(/E-Mail-Adresse/)
    .fill("anais.weiss+grund@example.com");
  await dialog.getByLabel(/Telefon/).fill("+49 211 123456");
  await dialog
    .getByLabel(/Nachricht/)
    .fill(
      "Grüße aus Düsseldorf – ½ Anteil & Hof\nBitte nach 18 Uhr anrufen. 🏡",
    );
  await dialog.getByText("Weitere Angaben", { exact: false }).click();
  await dialog.getByLabel(/Fläche in m²/).fill("120,5");
  await dialog.getByLabel(/Zustand/).selectOption("Renovierungsbedürftig");
  await dialog.getByRole("checkbox").check();
  await dialog
    .getByRole("button", { name: "E-Mail vorbereiten", exact: true })
    .click();
  const draft = dialog.getByRole("link", {
    name: "E-Mail-Entwurf öffnen",
    exact: true,
  });
  await expect(draft).toBeVisible();
  await draft.scrollIntoViewIfNeeded();
  await expect(draft).toBeInViewport();
  await expect(
    dialog.getByText("Anaïs Weiß & Söhne", { exact: true }),
  ).toBeVisible();
  await expect(
    dialog.getByText("40213 Düsseldorf", { exact: true }),
  ).toBeVisible();
  const href = await draft.getAttribute("href");
  expect(href).toMatch(/^mailto:/);
  const mailto = new URL(href ?? "");
  expect(mailto.pathname).toBe("jano.gri@gri-grundbesitz.com");
  expect(mailto.searchParams.get("subject")).toBe(
    "Immobilienangebot: Grundstück in 40213 Düsseldorf",
  );
  const body = mailto.searchParams.get("body");
  for (const value of [
    "Grundstück",
    "40213 Düsseldorf",
    "Anaïs Weiß & Söhne",
    "anais.weiss+grund@example.com",
    "+49 211 123456",
    "120,5 m²",
    "Renovierungsbedürftig",
    "Grüße aus Düsseldorf – ½ Anteil & Hof\nBitte nach 18 Uhr anrufen. 🏡",
  ]) {
    expect(body).toContain(value);
  }
  expect(submittedRequests).toEqual([]);
  await page.screenshot({
    path: resolve("../artifacts/v2-draft.png"),
  });
});

test("a prepared message can be copied and editing preserves the enquiry", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.addInitScript(() => {
    const messages: string[] = [];
    Object.defineProperty(window, "__enquiryCopiedMessages", {
      value: messages,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (message: string): Promise<void> => {
          messages.push(message);
        },
      },
    });
  });
  const dialog = await prepareCopyDraft(page);
  const draft = dialog.getByRole("link", {
    name: "E-Mail-Entwurf öffnen",
    exact: true,
  });
  const copy = dialog.getByRole("button", {
    name: "Nachricht kopieren",
    exact: true,
  });
  await expect(draft).toBeInViewport();
  await expect(copy).toBeInViewport();
  await copy.click();
  await expect(dialog.getByRole("status")).toContainText("Nachricht kopiert");
  const messages = await page.evaluate(
    () =>
      (window as Window & { __enquiryCopiedMessages?: string[] })
        .__enquiryCopiedMessages ?? [],
  );
  expect(messages).toHaveLength(1);
  expectCompleteCopyText(messages[0]);
  await dialog
    .getByRole("button", { name: "Angaben bearbeiten", exact: true })
    .click();
  await expect(
    dialog.getByRole("radio", { name: "Grundstück", exact: true }),
  ).toBeChecked();
  await expect(dialog.getByLabel(/Postleitzahl.*Ort/)).toHaveValue(
    "40213 Düsseldorf",
  );
  await expect(dialog.getByLabel(/Ihr Name/)).toHaveValue("Anaïs Weiß & Söhne");
  await expect(dialog.getByLabel(/E-Mail-Adresse/)).toHaveValue(
    "anais.weiss+grund@example.com",
  );
  await expect(dialog.getByLabel(/Nachricht/)).toHaveValue(COPY_MESSAGE);
  await expect(dialog.getByLabel(/Telefon/)).toHaveValue("+49 211 123456");
  await expect(dialog.getByLabel(/Fläche in m²/)).toHaveValue("120,5");
  await expect(dialog.getByLabel(/Zustand/)).toHaveValue(
    "Renovierungsbedürftig",
  );
  await expect(dialog.getByRole("checkbox")).toBeChecked();
  await expect(dialog.getByRole("status")).not.toBeVisible();
  await dialog
    .getByRole("button", { name: "E-Mail vorbereiten", exact: true })
    .click();
  await expect(copy).toBeInViewport();
  await expect(dialog.getByRole("status")).not.toBeVisible();
});

test("a late clipboard result cannot mark a revised draft as copied", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const resolveCopies: Array<() => Promise<void>> = [];
    Object.defineProperty(window, "__enquiryResolveCopies", {
      value: resolveCopies,
    });
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: (): Promise<void> =>
          new Promise<void>((resolve) => {
            resolveCopies.push(async () => {
              resolve();
              await Promise.resolve();
            });
          }),
      },
    });
  });
  const dialog = await prepareCopyDraft(page);
  await dialog
    .getByRole("button", { name: "Nachricht kopieren", exact: true })
    .click();
  await expect(
    dialog.getByRole("button", { name: "Wird kopiert …", exact: true }),
  ).toBeDisabled();
  await dialog
    .getByRole("button", { name: "Angaben bearbeiten", exact: true })
    .click();
  await dialog.getByLabel(/Nachricht/).fill("revised");
  await dialog
    .getByRole("button", { name: "E-Mail vorbereiten", exact: true })
    .click();
  await expect(dialog.getByText("revised", { exact: true })).toBeVisible();
  await page.evaluate(async () => {
    const pending = (
      window as Window & {
        __enquiryResolveCopies?: Array<() => Promise<void>>;
      }
    ).__enquiryResolveCopies;
    if (pending?.length !== 1)
      throw new Error("Expected one pending clipboard request");
    await pending[0]();
  });
  await expect(dialog.getByRole("status")).not.toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Nachricht kopieren", exact: true }),
  ).toBeEnabled();
  await expect(dialog.getByText("revised", { exact: true })).toBeVisible();
});

test("manual copying stays usable when clipboard access is rejected or unavailable", async ({
  browser,
}) => {
  for (const mode of ["rejected", "unavailable"] as const) {
    await test.step(mode, async () => {
      const context = await browser.newContext({
        baseURL: test.info().project.use.baseURL,
        viewport: { width: 375, height: 812 },
        reducedMotion: "reduce",
      });
      try {
        await context.addInitScript((clipboardMode) => {
          Object.defineProperty(navigator, "clipboard", {
            configurable: true,
            value:
              clipboardMode === "unavailable"
                ? undefined
                : {
                    writeText: async (): Promise<never> => {
                      throw new DOMException(
                        "Clipboard access denied",
                        "NotAllowedError",
                      );
                    },
                  },
          });
        }, mode);
        const page = await context.newPage();
        const dialog = await prepareCopyDraft(page);
        await dialog
          .getByRole("button", { name: "Nachricht kopieren", exact: true })
          .click();
        const manualCopy = dialog.getByRole("textbox", {
          name: "Nachricht zum Kopieren",
          exact: true,
        });
        await expect(manualCopy).toBeVisible();
        await expect(manualCopy).toHaveJSProperty("readOnly", true);
        await expect(manualCopy).toBeFocused();
        const message = await manualCopy.inputValue();
        expectCompleteCopyText(message);
        const selection = await manualCopy.evaluate(
          (element: HTMLTextAreaElement) => ({
            start: element.selectionStart,
            end: element.selectionEnd,
          }),
        );
        expect(selection).toEqual({ start: 0, end: message.length });
        await expect(
          dialog.getByRole("link", {
            name: "E-Mail-Entwurf öffnen",
            exact: true,
          }),
        ).toBeVisible();
      } finally {
        await context.close();
      }
    });
  }
});

test("invalid required fields receive focus and optional fields can stay empty", async ({
  page,
}) => {
  await page.goto("/");
  await openEnquiry(page);
  const dialog = page.getByRole("dialog", { name: "Sprechen wir darüber." });
  const prepare = dialog.getByRole("button", {
    name: "E-Mail vorbereiten",
    exact: true,
  });
  const property = dialog.getByRole("radio", {
    name: "Einfamilienhaus",
    exact: true,
  });
  await prepare.click();
  await expect(property).toBeFocused();
  await expect(dialog.getByRole("alert").first()).toBeVisible();
  await property.check();
  await prepare.click();
  await expect(dialog.getByLabel(/Postleitzahl.*Ort/)).toBeFocused();
  await dialog.getByLabel(/Postleitzahl.*Ort/).fill("abc");
  await prepare.click();
  await expect(dialog.getByLabel(/Postleitzahl.*Ort/)).toBeFocused();
  await dialog.getByLabel(/Postleitzahl.*Ort/).fill("40213");
  await prepare.click();
  await expect(dialog.getByLabel(/Ihr Name/)).toBeFocused();
  await dialog.getByLabel(/Ihr Name/).fill("Ada Müller");
  await dialog.getByLabel(/E-Mail-Adresse/).fill("ungueltig");
  await prepare.click();
  await expect(dialog.getByLabel(/E-Mail-Adresse/)).toBeFocused();
  await dialog.getByLabel(/E-Mail-Adresse/).fill("ada@example.com");
  await prepare.click();
  await expect(dialog.getByRole("checkbox")).toBeFocused();
  await dialog.getByRole("checkbox").check();
  await prepare.click();
  await expect(
    dialog.getByRole("link", { name: "E-Mail-Entwurf öffnen", exact: true }),
  ).toBeVisible();
});

test("mobile keyboard navigation and property dialogs restore focus", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menü öffnen", exact: true });
  await menu.focus();
  await menu.press("Enter");
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(
    page
      .getByRole("dialog", { name: "GRI Grundbesitz", exact: true })
      .getByRole("link", { name: /Ankauf/ }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await expect(menu).toBeFocused();
  for (const [offer, propertyType] of PROPERTY_OFFERS) {
    const trigger = page.getByRole("button", { name: offer, exact: true });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Sprechen wir darüber." });
    await expect(
      dialog.getByRole("radio", { name: propertyType, exact: true }),
    ).toBeChecked();
    if (propertyType === "Einfamilienhaus") {
      await dialog
        .getByRole("button", { name: "Anfrage schließen", exact: true })
        .click();
    } else {
      await page.keyboard.press("Escape");
    }
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
  }
  await page.locator("#ankauf").scrollIntoViewIfNeeded();
  const stickyContact = page.getByRole("complementary", {
    name: "Direkter Kontakt",
    exact: true,
  });
  const stickyTrigger = stickyContact.getByRole("button", {
    name: "Immobilie anbieten",
    exact: true,
  });
  await expect(stickyTrigger).toBeVisible();
  await stickyTrigger.click();
  await expect(stickyContact).not.toBeVisible();
  await page.keyboard.press("Escape");
  await expect(stickyTrigger).toBeFocused();
  await expect(stickyContact).toBeVisible();

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await menu.click();
  await page
    .getByRole("dialog", { name: "GRI Grundbesitz", exact: true })
    .getByRole("link", { name: /Kontakt/ })
    .click();
  await expect(page.locator("#kontakt")).toBeInViewport();
  await expect(page.locator("#kontakt")).toBeFocused();
  await expect(stickyContact).not.toBeVisible();
});

test("the core workflow reflows with reduced motion at 200% desktop equivalent", async ({
  browser,
}) => {
  // A 1280 × 900 desktop at 200% zoom exposes 640 × 450 CSS pixels.
  const context = await browser.newContext({
    viewport: { width: 640, height: 450 },
    screen: { width: 1280, height: 900 },
    deviceScaleFactor: 2,
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await page.goto(test.info().project.use.baseURL as string);
    await expect(
      page.getByRole("heading", { level: 1, name: "Wir kaufen Immobilien." }),
    ).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await openEnquiry(page);
    const dialog = page.getByRole("dialog", { name: "Sprechen wir darüber." });
    await dialog
      .getByRole("radio", { name: "Eigentumswohnung", exact: true })
      .check();
    await dialog.getByLabel(/Postleitzahl.*Ort/).fill("40213 Düsseldorf");
    await dialog.getByLabel(/Ihr Name/).fill("Ada Müller");
    await dialog.getByLabel(/E-Mail-Adresse/).fill("ada@example.com");
    await dialog.getByRole("checkbox").check();
    await dialog
      .getByRole("button", { name: "E-Mail vorbereiten", exact: true })
      .click();
    const draft = dialog.getByRole("link", {
      name: "E-Mail-Entwurf öffnen",
      exact: true,
    });
    await draft.scrollIntoViewIfNeeded();
    await expect(draft).toBeInViewport();
    await expectNoHorizontalOverflow(page);
    await page.screenshot({
      path: resolve("../artifacts/v2-zoom-reduced-motion.png"),
    });
  } finally {
    await context.close();
  }
});
