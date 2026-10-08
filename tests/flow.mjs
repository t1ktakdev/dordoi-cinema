import { chromium } from "playwright";
import assert from "node:assert/strict";
import fs from "node:fs/promises";

const base = process.env.CINEMA_TEST_URL || "http://127.0.0.1:5173/";
const browser = await chromium.launch({
  executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  headless: true,
});
const failures = [];
async function test(name, run) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  try {
    await page.goto(base);
    await run(page);
    console.log("PASS", name);
  } catch (error) {
    failures.push(name);
    console.error("FAIL", name, error.message);
  } finally {
    await context.close();
  }
}
async function seats(page) {
  await page.getByRole("button", { name: "Открыть меню", exact: true }).click();
  await page
    .locator(".mobile-nav")
    .getByRole("button", { name: "Расписание", exact: true })
    .click();
  await page
    .locator(".schedule-item")
    .filter({ hasText: "Жалын" })
    .locator(".time-pill")
    .first()
    .click();
}
await test("Весь зал виден на мобильном без скрытых правых мест", async (page) => {
  await seats(page);
  const dimensions = await page
    .locator(".seat-stage")
    .evaluate((e) => ({ content: e.scrollWidth, viewport: e.clientWidth }));
  assert.ok(
    dimensions.content <= dimensions.viewport + 1,
    `Схема шире контейнера: ${dimensions.content} > ${dimensions.viewport}`,
  );
});
await test("Проверка заказа расположена до подтверждения на мобильном", async (page) => {
  await seats(page);
  await page
    .getByRole("button", { name: "Ряд C место 6", exact: true })
    .click();
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  const summary = await page.locator(".checkout-summary").boundingBox();
  const submit = await page
    .getByRole("button", { name: "Получить демо-билет", exact: true })
    .boundingBox();
  assert.ok(
    summary.y + summary.height <= submit.y,
    "Кнопка подтверждения стоит раньше итогового заказа",
  );
});
await test("Дата доступна до выбора сеанса на главной", async (page) => {
  const dateButtons = await page
    .locator(".now-section")
    .getByRole("button", { name: /09.*окт/ })
    .count();
  assert.ok(dateButtons > 0, "На главной нет явного выбора даты");
});
await browser.close();
if (failures.length) process.exitCode = 1;
