import { expect, test } from "@playwright/test";

test("Phase 5 public AI surfaces are available", async ({ page }) => {
  await page.goto("/assistant");
  await expect(page.getByRole("heading", { name: "Batak Cultural Assistant" })).toBeVisible();

  await page.goto("/semantic-search");
  await expect(page.getByRole("heading", { name: "Semantic Search" })).toBeVisible();

  await page.goto("/learn");
  await expect(page.getByRole("heading", { name: /Belajar budaya/ })).toBeVisible();

  await page.goto("/about/ai");
  await expect(page.getByRole("heading", { name: "AI bukan sumber kebenaran." })).toBeVisible();
});
