const { test, expect } = require('@playwright/test');

// STEP (Stibo) is a slow, GWT-based app. Give the whole test more headroom.
test.setTimeout(120_000);

/**
 * Clicks a locator only after it's actually visible AND enabled,
 * and retries a couple of times if something else (an overlay, a
 * closing modal) intercepts the click. This replaces bare page.click(sel).
 */
async function safeClick(page, target, { timeout = 15000, retries = 3 } = {}) {
  const locator = typeof target === 'string' ? page.locator(target) : target;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await locator.waitFor({ state: 'visible', timeout });
      await expect(locator).toBeEnabled({ timeout });
      await locator.click({ timeout });
      return;
    } catch (err) {
      if (attempt === retries) throw err;
      await page.waitForTimeout(500); // tiny backoff before retry, not a substitute for the real wait
    }
  }
}

test('Add Workflow', async ({ page }) => {

  // Auto-dismiss the standard alert popup whenever it appears
  await page.addLocatorHandler(
    page.locator('i.portal-alert-popup-close-box__button'),
    async (locator) => await locator.click()
  );

  // TODO: replace this selector with the real one for the "warning popup"
  // that sometimes appears after completing the Phase step.
  // Same pattern as above — Playwright will auto-close it whenever it shows up,
  // instead of you having to guess whether it will appear.
  await page.addLocatorHandler(
    page.locator('.warning-popup-close-button'), // <-- put the real selector here
    async (locator) => await locator.click()
  );

  // Open STEP Url
  await page.goto("https://jlp-test-step.mdm.stibosystems.com/#");

  // Enter username and password
  await page.locator('#username').fill('J84620973a');
  await page.locator('#password').fill('January12345');

  // Click on Sign on
  await safeClick(page, '#signOnButton');

  // Click on johnlewis user
  await safeClick(page, '#JLUserPortal-link span');

  // Go to add workflow
  await safeClick(
    page,
    "div[class='status-selector__wrapper dashboard-widget-inner'] div[title='Add PO Ops Data (Buying)']"
  );

  // Clicking on RIN indicator
  await safeClick(page, page.getByText('RIN', { exact: true }));

  // Clicking on descending for sorting the RIN Id's
  await safeClick(page, page.getByText('Descending (Z-A)', { exact: true }));

  // Wait for the sort to actually re-render the table before grabbing the first row
  const firstRinCell = page.locator('table.sheet-table tbody tr td[data-col="1"]').first();
  await firstRinCell.waitFor({ state: 'visible' });
  await safeClick(page, firstRinCell);

  // Goto general tab
  await safeClick(page, "//*[normalize-space()='General Classification']");

  // click on barcode as yes
  await safeClick(page, "//*[normalize-space()='Generate Barcode']/following::input[@type='radio'][2]");

  // Click on Exclusive
  const exclusive = page.locator('//select[option[@title ="Exclusive"]]');
  await exclusive.scrollIntoViewIfNeeded();
  await exclusive.waitFor({ state: 'visible' });
  await exclusive.selectOption({ label: 'Not Exclusive' });

  // Click on Financial type
  const financial = page.locator('//select[option[@title ="Standard Item"]]');
  await financial.scrollIntoViewIfNeeded();
  await financial.waitFor({ state: 'visible' });
  await financial.selectOption({ label: 'Standard Item' });

  // Clicking on phase
  await safeClick(page, "//div[@id='Phase']//i[@title='Add Reference']");
  await safeClick(page, "//i[@id='tree_expanded_node_SeasonPhaseRoot']");
  await safeClick(page, "//i[@id='tree_expanded_node_Season-16']");
  await safeClick(page, "//div[@class='treeItem treeItem-entity treeItem-objecttype-phase']");

  // Click OK, then wait for the dialog to actually be gone before touching anything else.
  // This is the key fix for the "hierarchy tab click sometimes fails" issue —
  // the old dialog can still be intercepting clicks for a moment after you click OK.
  const okButton = page.locator("//span[normalize-space()='OK']");
  await safeClick(page, okButton);
  await okButton.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});

  // click on allocate barcode tab
  const allocateBarcodesTab = page.locator("//span[normalize-space()='Allocate Barcodes']");
  await allocateBarcodesTab.waitFor({ state: 'visible', timeout: 15000 });
  await safeClick(page, allocateBarcodesTab);

  // click on hierarchy — now safe because we waited for the previous dialog to clear
  const hierarchyTab = page.locator(
    "div[id='stibo_tab_Hierarchy'] div[class='tabs-panel-tab-inner'] div span[class='gwt-InlineLabel']"
  );
  await hierarchyTab.waitFor({ state: 'visible', timeout: 15000 });
  await safeClick(page, hierarchyTab);

  // Click Initial Style button
  await safeClick(page, "//div[@id='Initial_Style']//i[@title='Add Reference'][normalize-space()='add_circle']");

  // click on search tab
  await safeClick(page, "//div[@class='gwt-Label'][normalize-space()='Search']");

  // fill the initial style
  const suggestBox = page.locator("//input[@class='gwt-SuggestBox']");
  await suggestBox.waitFor({ state: 'visible' });
  await suggestBox.type("360301");

  // click search
  await safeClick(page, "//button[@class='stibo-GraphicsButton material SearchButton']//span[@class='text']");

  // Wait for search results to actually load before clicking OK.
  // Replace this with a wait on an actual results element if one exists
  // (e.g. a results row/table), which is more reliable than a fixed timeout.
  await page.waitForLoadState('networkidle').catch(() => {});

  const searchOkButton = page.locator("//span[normalize-space()='OK']");
  await safeClick(page, searchOkButton);
  await searchOkButton.waitFor({ state: 'detached', timeout: 15000 }).catch(() => {});

  // click on retail price tab
  const retailPriceTab = page.locator("//span[normalize-space()='Retail Price & VAT']");
  await retailPriceTab.waitFor({ state: 'visible', timeout: 15000 });
  await safeClick(page, retailPriceTab);

  // Enter the retail price
  const retailPriceInput = page.locator("//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory']");
  await retailPriceInput.waitFor({ state: 'visible' });
  await retailPriceInput.type("9999.00");

  // Click on selling details tab
  await safeClick(page, "//div[@id='stibo_tab_Selling_Details']//div[@class='tabs-panel-tab-inner']");

  // Dist Id
  const dist = page.locator('select').filter({ has: page.locator('//option[@title ="John Lewis"]') });
  await dist.scrollIntoViewIfNeeded();
  await dist.waitFor({ state: 'visible' });
  await dist.selectOption({ label: 'John Lewis' });

  // Image source type
  const image = page.locator('select').filter({ has: page.locator('//option[@title ="Publication"]') });
  await image.scrollIntoViewIfNeeded();
  await image.waitFor({ state: 'visible' });
  await image.selectOption({ label: 'Publication' });

  // Click on Supplier
  await safeClick(page, "//span[normalize-space()='Supplier']");

  // primary sourcing country
  const primaryCountry = page.locator("div[data-step-component-id='PrimaryManufacturingCountry'] select");
  await primaryCountry.waitFor({ state: 'visible' });
  await primaryCountry.selectOption({ index: 1 });

  // unit cost price
  const unitCostInput = page.locator("//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory-for-approval mandatory']");
  await unitCostInput.waitFor({ state: 'visible' });
  await unitCostInput.type("800");

  // supplier size
  const size = page.locator("//div[@id='Supplier_Pack_Size']//div[@class='widgetAndIconsWrapper']//div//div//input[@type='text']");
  await size.scrollIntoViewIfNeeded();
  await size.waitFor({ state: 'visible' });
  await size.type("1");

  // Selling Attributes
  await safeClick(page, "//span[normalize-space()='Selling Attributes']");

  // Allocate StockNumber
  await safeClick(page, "//span[normalize-space()='Allocate StockNumber']");

  // Washing instructions
  const washingSelect = page.locator("div[data-step-component-id='WashingInstructions'] select");
  await washingSelect.waitFor({ state: 'visible' });
  await washingSelect.selectOption({ index: 7 });

  // Save & Submit
  await safeClick(page, "//span[normalize-space()='Save&Submit']");

});
