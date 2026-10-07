import { test, expect } from "@playwright/test";

test("home → marga → profile", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: /jelajahi budaya batak/i,
    }),
  ).toBeVisible();

  await page.getByRole("link", { name: "Marga", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Marga / Merga" })).toBeVisible();

  await page.getByRole("link", { name: "Munthe" }).click();
  await expect(page.getByRole("heading", { name: "Munthe" })).toBeVisible();
});

test("global search supports alias", async ({ page }) => {
  await page.goto("/search?q=Munte");
  await expect(page.getByRole("link", { name: "Munthe" })).toBeVisible();
});

test("methodology is reachable and semantic", async ({ page }) => {
  await page.goto("/about/methodology");
  await expect(
    page.getByRole("heading", { name: "Cara pengetahuan diterbitkan" }),
  ).toBeVisible();
});
