import { test, expect } from "@playwright/test";

test.describe("Item Details Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("should navigate to an external collection and view items", async ({ page }) => {
    // Wait for collections to load
    await page.waitForSelector('.items-wrapper', { timeout: 10000 });
    
    // Find the first external collection link
    const firstCollectionLink = page.locator('a[href*="external-collection"]').first();
    
    if (await firstCollectionLink.count() > 0) {
      await firstCollectionLink.click();
      
      // Should be on the external collection details page
      await expect(page).toHaveURL(/.*external-collection/);
      
      // Wait for content to load
      await page.waitForSelector('.items-wrapper, .items-container', { timeout: 10000 });
      
      // Check that we're on the items tab (default)
      const itemsTab = page.locator('button').filter({ hasText: /^Items$/ });
      if (await itemsTab.count() > 0) {
        await expect(itemsTab.first()).toHaveAttribute('class', /selected/);
      }
    }
  });

  test("should display item cards in external collections", async ({ page }) => {
    // Navigate to an external collection if available
    await page.goto("/");
    await page.waitForSelector('.items-wrapper', { timeout: 10000 });
    
    const firstCollectionLink = page.locator('a[href*="external-collection"]').first();
    
    if (await firstCollectionLink.count() > 0) {
      await firstCollectionLink.click();
      await page.waitForURL(/.*external-collection/, { timeout: 10000 });
      
      // Check for item cards
      const itemCards = page.locator('.item-card-container, .card');
      const count = await itemCards.count();
      
      // There should be at least one item card visible
      expect(count).toBeGreaterThan(0);
    }
  });

  test("should switch between tabs (Items, Types, Notes) in external collections", async ({ page }) => {
    // Navigate to an external collection if available
    await page.goto("/");
    await page.waitForSelector('.items-wrapper', { timeout: 10000 });
    
    const firstCollectionLink = page.locator('a[href*="external-collection"]').first();
    
    if (await firstCollectionLink.count() > 0) {
      await firstCollectionLink.click();
      await page.waitForURL(/.*external-collection/, { timeout: 10000 });
      
      // Find the tab buttons
      const typesTab = page.getByRole('button', { name: 'Types' });
      const notesTab = page.getByRole('button', { name: 'Notes' });
      
      if (await typesTab.count() > 0) {
        await typesTab.click();
        
        // Should switch to types tab
        await expect(page.locator('h2').filter({ hasText: /^Types$/ })).toBeVisible();
        
        // Switch back to items
        const itemsTab = page.getByRole('button', { name: 'Items' });
        await itemsTab.click();
        await expect(page.locator('h2').filter({ hasText: /^Items$/ })).toBeVisible();
      }
    }
  });

  test("should display search functionality", async ({ page }) => {
    // Navigate to an external collection if available
    await page.goto("/");
    await page.waitForSelector('.items-wrapper', { timeout: 10000 });
    
    const firstCollectionLink = page.locator('a[href*="external-collection"]').first();
    
    if (await firstCollectionLink.count() > 0) {
      await firstCollectionLink.click();
      await page.waitForURL(/.*external-collection/, { timeout: 10000 });
      
      // Check for search box
      const searchBox = page.locator('input.search-box, input[type="text"]').first();
      
      if (await searchBox.count() > 0) {
        await expect(searchBox).toBeVisible();
        await searchBox.fill('test');
        await expect(searchBox).toHaveValue('test');
      }
    }
  });
});
