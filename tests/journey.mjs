import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";

const base = process.env.CINEMA_TEST_URL || "http://127.0.0.1:5173/";
const screenshotDir =
  process.env.CINEMA_SCREENSHOTS || path.resolve("screenshots");
await fs.mkdir(screenshotDir, { recursive: true });
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const errors = [];
const desktop = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await desktop.newPage();
page.on("pageerror", (e) => errors.push(e.message));
const check = (condition, name) => {
  assert.ok(condition, name);
  console.log("PASS", name);
};
async function capture(p, name) {
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.screenshot({
    path: path.join(screenshotDir, name + ".png"),
    fullPage: false,
  });
}
async function clickNav(p, name, mobile = false) {
  if (mobile) {
    await p.getByRole("button", { name: "Открыть меню", exact: true }).click();
    await p
      .locator(".mobile-nav")
      .getByRole("button", { name, exact: true })
      .click();
  } else
    await p
      .locator(".desktop-nav")
      .getByRole("button", { name, exact: true })
      .click();
}
try {
  await page.goto(base);
  await page.locator(".hero-backdrop").evaluate((img) => img.decode());
  await capture(page, "new-desktop-home");
  await page
    .getByRole("button", { name: "Следующий фильм", exact: true })
    .click();
  check(
    (await page.locator(".hero h1").innerText()) === "Жалын",
    "Hero controls change the featured film",
  );
  await page.locator(".hero-backdrop").evaluate((img) => img.decode());
  check(
    await page
      .locator(".hero-backdrop")
      .evaluate((img) => img.naturalWidth >= 1000),
    "Jalyn banner uses a sharp source image",
  );
  await capture(page, "new-desktop-hero-jalyn");
  await page
    .getByRole("button", { name: "Следующий фильм", exact: true })
    .click();
  await page.locator(".hero-backdrop").evaluate((img) => img.decode());
  check(
    await page
      .locator(".hero-backdrop")
      .evaluate(
        (img) =>
          img.naturalWidth >= 1000 &&
          img.naturalWidth / img.naturalHeight > 1.6,
      ),
    "Resident Evil banner uses a wide film still",
  );
  await capture(page, "new-desktop-hero-resident");
  await page
    .getByRole("button", { name: "Все 9 сеансов", exact: true })
    .click();
  await page.getByRole("heading", { name: "Жалын", exact: true }).waitFor();
  check(
    (await page.locator(".film-times-box .time-pill").count()) === 9,
    "All sessions opens the film with the chosen date intact",
  );
  await page
    .getByRole("button", { name: "Dordoi Cinema, главная", exact: true })
    .click();
  await page
    .locator(".now-section")
    .getByRole("button", { name: "Чт 08 окт", exact: true })
    .click();
  check(
    (await page
      .locator(".home-movies .movie-name")
      .filter({ hasText: "Жүдөмүшов" })
      .count()) === 1,
    "Changing the day changes the available films",
  );
  await clickNav(page, "Афиша");
  await page.getByRole("searchbox", { name: "Поиск фильма" }).fill("Тузак");
  check(
    (await page.locator(".catalog-grid .movie-card").count()) === 1,
    "Search finds the requested film",
  );
  await page.getByRole("button", { name: "Очистить поиск" }).click();
  await page
    .locator(".category-row")
    .getByRole("button", { name: "IMAX", exact: true })
    .click();
  check(
    (await page.locator(".catalog-grid .movie-card").count()) === 2,
    "IMAX filter displays the two tagged films",
  );
  await page
    .locator(".category-row")
    .getByRole("button", { name: "Все фильмы", exact: true })
    .click();
  await page
    .getByRole("searchbox", { name: "Поиск фильма" })
    .fill("Несуществующий фильм");
  check(
    (await page.getByRole("heading", { name: "Фильм не найден" }).count()) ===
      1,
    "Empty search state is recoverable",
  );
  await page.getByRole("button", { name: "Сбросить фильтры" }).click();
  check(
    (await page.locator(".catalog-grid .movie-card").count()) === 11,
    "Reset restores all films",
  );
  await capture(page, "new-desktop-catalog");
  await page
    .getByRole("button", { name: "Открыть фильм Жалын", exact: true })
    .click();
  await capture(page, "new-desktop-film");
  await clickNav(page, "Расписание");
  await page.getByRole("button", { name: "Пт 09 окт", exact: true }).click();
  await capture(page, "new-desktop-schedule");
  await page
    .locator(".schedule-item")
    .filter({ hasText: "Жалын" })
    .locator(".time-pill")
    .first()
    .click();
  check(
    !(await page
      .getByRole("button", { name: "Продолжить", exact: true })
      .isEnabled()),
    "An empty seat selection cannot continue",
  );
  check(
    !(await page
      .getByRole("button", { name: "Ряд B место 4, занято", exact: true })
      .isEnabled()),
    "Occupied seats cannot be selected",
  );
  await page
    .getByRole("button", { name: "Ряд C место 6", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Ряд H место 6", exact: true })
    .click();
  check(
    (await page.locator(".seat-price-line strong").innerText()).replace(
      /\s/g,
      "",
    ) === "730сом",
    "The total adds the VIP surcharge once (290 + 440)",
  );
  const selectionColors = await page
    .locator(".seat.picked")
    .evaluateAll((seats) =>
      seats.map((s) => getComputedStyle(s).backgroundColor),
    );
  check(
    selectionColors[0] === selectionColors[1],
    "Hover keeps the selected seat color distinct from free seats",
  );
  await capture(page, "new-desktop-seats");
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await page
    .getByRole("textbox", { name: "Ваше имя", exact: true })
    .fill("Тестовый зритель");
  await page
    .getByRole("textbox", { name: "Электронная почта", exact: true })
    .fill("viewer@example.com");
  await page
    .getByRole("textbox", { name: "Номер телефона", exact: true })
    .fill("123");
  await page
    .getByRole("button", { name: "Получить демо-билет", exact: true })
    .click();
  check(
    await page.getByRole("alert").isVisible(),
    "Incomplete phone details show an error without issuing a ticket",
  );
  await page
    .getByRole("textbox", { name: "Номер телефона", exact: true })
    .fill("+996 555 123 456");
  await capture(page, "new-desktop-checkout");
  await page
    .getByRole("button", { name: "Получить демо-билет", exact: true })
    .click();
  await page.locator(".ticket-visual").waitFor();
  const stored = await page.evaluate(() =>
    JSON.parse(localStorage.getItem("dc_demo_tickets")),
  );
  assert.deepEqual(stored[0].seats, ["C6", "H6"]);
  assert.equal(stored[0].total, 730);
  assert.equal(stored[0].date, "2026-10-09");
  check(
    !Object.hasOwn(stored[0], "email") &&
      !Object.hasOwn(stored[0], "phone") &&
      !Object.hasOwn(stored[0], "name"),
    "The issued ticket retains the order but stores no contacts",
  );
  await capture(page, "new-desktop-ticket");
  await page.reload();
  check(
    (await page.locator(".ticket-visual").count()) === 1,
    "The issued ticket survives a reload",
  );
  await clickNav(page, "О кинотеатре");
  await page.locator(".faq-item").first().getByRole("button").click();
  check(
    (await page
      .locator(".faq-item")
      .first()
      .getByRole("button")
      .getAttribute("aria-expanded")) === "true",
    "FAQ expands",
  );
  await capture(page, "new-desktop-about");

  const mobile = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const phone = await mobile.newPage();
  phone.on("pageerror", (e) => errors.push(e.message));
  await phone.goto(base);
  await phone.locator(".hero-backdrop").evaluate((img) => img.decode());
  await capture(phone, "new-mobile-home");
  for (const filmName of ["jalyn", "resident"]) {
    await phone
      .getByRole("button", { name: "Следующий фильм", exact: true })
      .click();
    await phone.locator(".hero-backdrop").evaluate((img) => img.decode());
    await capture(phone, "new-mobile-hero-" + filmName);
  }
  await phone
    .getByRole("button", { name: "Следующий фильм", exact: true })
    .click();
  await clickNav(phone, "Афиша", true);
  await phone
    .getByRole("button", { name: "Открыть фильм Мстители: Финал", exact: true })
    .click();
  await capture(phone, "new-mobile-film");
  await clickNav(phone, "Расписание", true);
  await capture(phone, "new-mobile-schedule");
  await phone
    .locator(".schedule-item")
    .filter({ hasText: "Жалын" })
    .locator(".time-pill")
    .first()
    .click();
  await phone
    .getByRole("button", { name: "Ряд C место 6", exact: true })
    .click();
  for (const seat of ["A1", "A2", "A3", "A4", "A5"])
    await phone
      .getByRole("button", {
        name: "Ряд " + seat[0] + " место " + seat.slice(1),
        exact: true,
      })
      .click();
  await phone
    .getByRole("button", { name: "Ряд A место 6", exact: true })
    .click();
  check(
    (await phone.locator(".seat.picked").count()) === 6,
    "The seventh seat is prevented without losing the first six",
  );
  check(
    (await phone.locator(".seat-selection-help").innerText()).includes(
      "Снимите одно место",
    ),
    "The seat limit explains how to continue",
  );
  for (const seat of ["A1", "A2", "A3", "A4", "A5"])
    await phone
      .getByRole("button", {
        name: "Ряд " + seat[0] + " место " + seat.slice(1),
        exact: true,
      })
      .click();
  await capture(phone, "new-mobile-seats");
  const fit = await phone
    .locator(".seat-stage")
    .evaluate((e) => e.scrollWidth <= e.clientWidth);
  check(fit, "All seat columns fit in the mobile screen");
  await phone.getByRole("button", { name: "Продолжить", exact: true }).click();
  await capture(phone, "new-mobile-checkout");
  const summary = await phone.locator(".checkout-summary").boundingBox();
  const submit = await phone
    .getByRole("button", { name: "Получить демо-билет", exact: true })
    .boundingBox();
  check(
    summary.y + summary.height < submit.y,
    "The complete order comes before mobile confirmation",
  );
  await phone
    .getByRole("textbox", { name: "Ваше имя", exact: true })
    .fill("Тестовый зритель");
  await phone
    .getByRole("textbox", { name: "Электронная почта", exact: true })
    .fill("viewer@example.com");
  await phone
    .getByRole("textbox", { name: "Номер телефона", exact: true })
    .fill("+996 555 123 456");
  await phone
    .getByRole("button", { name: "Получить демо-билет", exact: true })
    .click();
  await phone.locator(".ticket-visual").waitFor();
  await capture(phone, "new-mobile-ticket");
  const routeHeadings = {
    home: "Мстители: Финал",
    movies: "Афиша",
    "film/jalyn": "Жалын",
    "film/avengers": "Мстители: Финал",
    schedule: "Расписание",
    seats: "Выберите места",
    checkout: "Оформление билета",
    about: "Cinematica в Dordoi Plaza",
    ticket: "Билет готов",
    tickets: "Мои билеты",
  };
  for (const width of [320, 390, 768, 1440]) {
    await phone.setViewportSize({ width, height: 1000 });
    for (const route of Object.keys(routeHeadings)) {
      await phone.evaluate((route) => {
        window.location.hash = "/" + route;
      }, route);
      await phone
        .getByRole("heading", { name: routeHeadings[route], exact: true })
        .waitFor();
      const sizes = await phone.evaluate(() => ({
        page: document.documentElement.scrollWidth,
        viewport: innerWidth,
      }));
      check(
        sizes.page <= sizes.viewport,
        `No page overflow at ${width}px on ${route}`,
      );
    }
  }
  check(
    errors.length === 0,
    "No JavaScript runtime errors in the complete journey",
  );
  await mobile.close();
  console.log("Screenshots: " + screenshotDir);
} finally {
  await browser.close();
}
