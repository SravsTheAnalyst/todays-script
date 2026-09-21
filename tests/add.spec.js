const { test, expect } = require('@playwright/test');
test.setTimeout(120_000);

async function ready(locator, timeout = 15000) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  await locator.waitFor({ state: 'visible', timeout });
  return locator;
}

async function safeClick(page, target, { timeout = 15000, retries = 3 } = {}) {
  const locator = typeof target === 'string' ? page.locator(target) : target;
  for (let i = 1; i <= retries; i++) {
    try {
      await ready(locator, timeout);
      await expect(locator).toBeEnabled({ timeout });
      await locator.click({ timeout });
      return;
    } catch (err) {
      if (i === retries) throw err;
      await page.waitForTimeout(500);
    }
  }
}

async function safeType(target, text) {
  const locator = await ready(target);
  await locator.type(text);
}

async function safeSelect(target, option) {
  const locator = await ready(target);
  await locator.selectOption(option);
}

async function waitClosed(locator, timeout = 15000) {
  await locator.waitFor({ state: 'detached', timeout }).catch(() => {});
}

test('Add Workflow', async ({ page }) => {

  await page.addLocatorHandler(page.locator('i.portal-alert-popup-close-box__button'), l => l.click());
  await page.addLocatorHandler(page.locator('.warning-popup-close-button'), l => l.click()); // TODO: real selector

  // Open STEP Url
  await page.goto("https://jlp-test-step.mdm.stibosystems.com/#");

  // Enter username and password
  await page.locator('#username').fill('J84620973a');
  await page.locator('#password').fill('January12345');
  await safeClick(page, '#signOnButton');

  // click on johnlewis user
  await safeClick(page, '#JLUserPortal-link span');

  // Go to add workflow
  await safeClick(page, "div[class='status-selector__wrapper dashboard-widget-inner'] div[title='Add PO Ops Data (Buying)']");

  // Clicking on RIN indicator
  await safeClick(page, page.getByText('RIN', { exact: true }));

  // Clicking on descending for sorting the RIN Id's
  // FIX: wait for the menu item to actually render before clicking it,
  // then wait for the table to finish re-sorting before touching the rows.
  const descending = page.getByText('Descending (Z-A)', { exact: true });
  await descending.waitFor({ state: 'visible', timeout: 15000 });
  await descending.click();
  await page.waitForLoadState('networkidle').catch(() => {});

  // clicking on the first rin id
  const firstRinCell = page.locator('table.sheet-table tbody tr td[data-col="1"]').first();
  await firstRinCell.waitFor({ state: 'visible', timeout: 15000 });
  await safeClick(page, firstRinCell);

  // Goto general tab
  await safeClick(page, "//*[normalize-space()='General Classification']");

  // click on barcode as yes
  await safeClick(page, "//*[normalize-space()='Generate Barcode']/following::input[@type='radio'][2]");

  // Click on Exclusive
  await safeSelect(page.locator('//select[option[@title ="Exclusive"]]'), { label: 'Not Exclusive' });

  // Click on Financial type
  await safeSelect(page.locator('//select[option[@title ="Standard Item"]]'), { label: 'Standard Item' });

  // Clicking on phase
  await safeClick(page, "//div[@id='Phase']//i[@title='Add Reference']");
  await safeClick(page, "//i[@id='tree_expanded_node_SeasonPhaseRoot']");
  await safeClick(page, "//i[@id='tree_expanded_node_Season-16']");
  await safeClick(page, "//div[@class='treeItem treeItem-entity treeItem-objecttype-phase']");

  // Click OK, then wait for the dialog to actually be gone
  const okButton = page.locator("//span[normalize-space()='OK']");
  await safeClick(page, okButton);
  await waitClosed(okButton);

  // click on allocate barcode tab
  const allocateBarcodesTab = page.locator("//span[normalize-space()='Allocate Barcodes']");
  await allocateBarcodesTab.waitFor({ state: 'visible', timeout: 15000 });
  await safeClick(page, allocateBarcodesTab);

  // click on hierarchy
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
  const styleCode = "360301";
  await suggestBox.type(styleCode);

  // click search
  await safeClick(page, "//button[@class='stibo-GraphicsButton material SearchButton']//span[@class='text']");
  await page.waitForLoadState('networkidle').catch(() => {});

  // FIX: wait for the actual result row to be visible before clicking it,
  // instead of clicking OK immediately after Search (root cause of the
  // intermittent "Initial Style" failure — same issue as sub-brand).
  const styleResult = page.getByText(new RegExp(styleCode)).first();
  await styleResult.waitFor({ state: 'visible', timeout: 15000 });
  await styleResult.click();

  const searchOkButton = page.locator("//span[normalize-space()='OK']");
  await safeClick(page, searchOkButton);
  await waitClosed(searchOkButton);

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
