import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Game Elements" }).click();
  await page.getByRole("button").nth(1).click();
  await page
    .locator("div")
    .filter({ hasText: /^A Mario enemyView More Details$/ })
    .getByRole("link")
    .click();
  await page.getByRole("heading", { name: "Goomba" }).click();
  await page.getByRole("img", { name: "Goomba image" }).click();
  await page.getByText("A Mario enemy").click();
});
