import { test, expect } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("http://localhost:5173/");
  await page.getByRole("link", { name: "Collections" }).click();
  await page
    .getByRole("heading", { name: "Super Mario Bros.", exact: true })
    .click();
  await page.getByText("A classic platformer where").click();
  await page.getByRole("img", { name: "Super Mario Bros. image" }).click();
});
