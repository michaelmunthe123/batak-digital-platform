import { expect, test } from "@playwright/test";

test("anonymous visitors cannot open genealogy and kinship authoring forms", async ({ page }) => {
  for (const path of ["/admin/genealogy/new", "/admin/genealogy/nodes/new", "/admin/genealogy/edges/new", "/admin/kinship-rules/new"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByRole("button", { name: /create draft/i })).toHaveCount(0);
  }
});

test("unknown routes return 404", async ({ page }) => {
  const response = await page.goto("/missing-audit-route");
  expect(response?.status()).toBe(404);
});
