const { test } = require('@playwright/test');
const { safeClick, safeType, safeSelect, clickOkWhenEnabled } = require('./helpers');

test.setTimeout(120_000);

test('Add Workflow', async ({ page }) => {

  await page.addLocatorHandler(page.locator('i.portal-alert-popup-close-box__button'), l => l.click());
  await page.addLocatorHandler(page.locator('.warning-popup-close-button'), l => l.click()); // TODO: real selector

  await page.goto("https://jlp-test-step.mdm.stibosystems.com/#");
  await page.locator('#username').fill('J84620973a');
  await page.locator('#password').fill('January12345');
  await safeClick(page, '#signOnButton');
  await safeClick(page, '#JLUserPortal-link span');
  await safeClick(page, "div[class='status-selector__wrapper dashboard-widget-inner'] div[title='Add PO Ops Data (Buying)']");

  await safeClick(page, page.getByText('RIN', { exact: true }));
  const descending = page.getByText('Descending (Z-A)', { exact: true });
  const firstRow = page.locator('table.sheet-table tbody tr td[data-col="1"]').first();
  const before = await firstRow.textContent().catch(() => null);
  await safeClick(page, descending);
  await page.waitForFunction(
    (el, prev) => el.textContent !== prev,
    await firstRow.elementHandle(),
    before
  ).catch(() => {});
  await safeClick(page, firstRow);

  await safeClick(page, "//*[normalize-space()='General Classification']");
  await safeClick(page, "//*[normalize-space()='Generate Barcode']/following::input[@type='radio'][2]");
  await safeSelect(page.locator('//select[option[@title ="Exclusive"]]'), { label: 'Not Exclusive' });
  await safeSelect(page.locator('//select[option[@title ="Standard Item"]]'), { label: 'Standard Item' });

  await safeClick(page, "//div[@id='Phase']//i[@title='Add Reference']");
  await safeClick(page, "//i[@id='tree_expanded_node_SeasonPhaseRoot']");
  await safeClick(page, "//i[@id='tree_expanded_node_Season-16']");
  await safeClick(page, "//div[@class='treeItem treeItem-entity treeItem-objecttype-phase']");
  await clickOkWhenEnabled(page);

  await safeClick(page, "div[id='stibo_tab_Hierarchy'] div[class='tabs-panel-tab-inner'] div span[class='gwt-InlineLabel']");

  await safeClick(page, "//div[@id='Initial_Style']//i[@title='Add Reference'][normalize-space()='add_circle']");
  await safeClick(page, "//div[@class='gwt-Label'][normalize-space()='Search']");
  await safeType(page.locator("//input[@class='gwt-SuggestBox']"), "360301");
  await safeClick(page, "//button[@class='stibo-GraphicsButton material SearchButton']//span[@class='text']");
  await clickOkWhenEnabled(page);

  await safeClick(page, "//span[normalize-space()='Retail Price & VAT']");
  await safeType(page.locator("//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory']"), "9999.00");

  await safeClick(page, "//div[@id='stibo_tab_Selling_Details']//div[@class='tabs-panel-tab-inner']");
  await safeSelect(page.locator('select').filter({ has: page.locator('//option[@title ="John Lewis"]') }), { label: 'John Lewis' });
  await safeSelect(page.locator('select').filter({ has: page.locator('//option[@title ="Publication"]') }), { label: 'Publication' });

  await safeClick(page, "//span[normalize-space()='Supplier']");
  await safeSelect(page.locator("div[data-step-component-id='PrimaryManufacturingCountry'] select"), { index: 1 });
  await safeType(page.locator("//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory-for-approval mandatory']"), "800");
  await safeType(page.locator("//div[@id='Supplier_Pack_Size']//div[@class='widgetAndIconsWrapper']//div//div//input[@type='text']"), "1");

  await safeClick(page, "//span[normalize-space()='Selling Attributes']");
  await safeClick(page, "//span[normalize-space()='Allocate StockNumber']");
  await safeSelect(page.locator("div[data-step-component-id='WashingInstructions'] select"), { index: 7 });

  // Allocate Barcodes last — triggers reloads, so do it right before submit
  await safeClick(page, "//span[normalize-space()='Allocate Barcodes']");
  const submit = page.locator("//span[normalize-space()='Save&Submit']");
  await submit.waitFor({ state: 'visible', timeout: 30000 });
  await safeClick(page, submit);
});
