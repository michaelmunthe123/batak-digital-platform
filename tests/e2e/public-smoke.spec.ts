import { expect, test } from "@playwright/test";

test("public pages render without browser exceptions", async ({ page }) => {
  const exceptions: string[] = [];
  page.on("pageerror", (error) => exceptions.push(error.message));
  for (const path of ["/", "/explore", "/adat", "/sources", "/marga/munthe"]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    await expect(page).toHaveTitle(/Batak|Munthe|Adat|Sumber|Explore/i);
  }
  expect(exceptions).toEqual([]);
});
