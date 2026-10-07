import { expect, test } from "@playwright/test";

test("Phase 3 genealogy and kinship routes render", async ({ page }) => {
  await page.goto("/tarombo");
  await expect(page.getByRole("heading", { name: /Tarombo visualizer/i })).toBeVisible();

  await page.goto("/tarombo/demo-metodologi");
  await expect(page.getByText(/Demo fiktif/i).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: /Edge ledger/i })).toBeVisible();

  await page.goto("/partuturan");
  await expect(page.getByRole("heading", { name: /Partuturan Calculator/i })).toBeVisible();
  await expect(page.getByText("tulang")).toBeVisible();

  await page.goto("/relations?from=karo&to=senina");
  await expect(page.getByRole("heading", { name: /Relationship Explorer/i })).toBeVisible();
  await expect(page.getByText(/uses kinship system/i)).toBeVisible();
});
