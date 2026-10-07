import { test, expect } from "@playwright/test";

test("community contribution landing explains proposal-first workflow", async ({ page }) => {
  await page.goto("/contribute");
  await expect(page.getByRole("heading", { name: /bantu memperbaiki pengetahuan/i })).toBeVisible();
  await expect(page.getByText(/proposal, bukan direct edit/i)).toBeVisible();
  await expect(page.getByText(/invitation-based pilot/i)).toBeVisible();
});

test("contributor login route is available", async ({ page }) => {
  await page.goto("/account/login");
  await expect(page.getByRole("heading", { name: /contributor login/i })).toBeVisible();
});
