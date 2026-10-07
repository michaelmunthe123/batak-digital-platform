import { expect, test } from "@playwright/test";

test("Phase 2 public explorers are reachable", async ({ page }) => {
  await page.goto("/map");
  await expect(page.getByRole("heading", { name: /jelajahi budaya melalui tempat/i })).toBeVisible();

  await page.goto("/language");
  await expect(page.getByRole("heading", { name: /bahasa & dictionary/i })).toBeVisible();
  await expect(page.getByText("toal", { exact: true })).toBeVisible();

  await page.goto("/gallery");
  await expect(page.getByRole("heading", { name: /media gallery/i })).toBeVisible();
});

test("search can filter to language entities", async ({ page }) => {
  await page.goto("/search?type=language_variety");
  await expect(page.getByText("Bahasa Simalungun", { exact: true })).toBeVisible();
});
