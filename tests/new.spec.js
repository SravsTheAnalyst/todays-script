const { test, expect } = require('@playwright/test');

test('Add Workflow', async ({ page }) => {

    // Handle warning popup
    await page.addLocatorHandler(
        page.locator('i.portal-alert-popup-close-box__button'),
        async (locator) => await locator.click()
    );

    // Open Step URL
    await page.goto("https://jlp-test-step.mdm.stibosystems.com/#");

    // Enter username and password
    await page.locator('id=username').fill('J84620973a');
    await page.fill("input[id='password']", "YOUR_PASSWORD");

    // Click on Sign on
    await page.click('//*[@id="signOnButton"]');

    // Click on John Lewis user
    await page.click('//*[@id="JLUserPortal-link"]/span');

    // Go to add workflow
    await page.locator(
        "div[class='status-selector__wrapper dashboard-widget-inner'] div[title='Add PO Ops Data (Buying)']"
    ).click();

    // Clicking on RIN indicator
    await page.getByText('RIN', { exact: true }).click();

    // Clicking on descending
    await page.getByText('Descending (Z-A)', { exact: true }).click();

    // Wait and click first RIN
    const firstRin = page.locator(
        'table.sheet-table tbody tr td[data-col="1"]'
    ).first();

    await expect(firstRin).toBeVisible({ timeout: 15000 });
    await firstRin.click();

    // Go to General Classification
    await page.click("//*[normalize-space()='General Classification']");

    // Generate Barcode = Yes
    await page.locator(
        "//*[normalize-space()='Generate Barcode']/following::input[@type='radio'][2]"
    ).click();

    // Exclusive
    const exclusive = page.locator(
        '//select[option[@title ="Exclusive"]]'
    );

    await exclusive.scrollIntoViewIfNeeded();
    await exclusive.selectOption({ label: 'Not Exclusive' });

    // Financial type
    const financial = page.locator(
        '//select[option[@title ="Standard Item"]]'
    );

    await financial.scrollIntoViewIfNeeded();
    await financial.selectOption({ label: 'Standard Item' });

    // Phase
    await page.click(
        "//div[@id='Phase']//i[@title='Add Reference']"
    );

    await page.click(
        "//i[@id='tree_expanded_node_SeasonPhaseRoot']"
    );

    await page.click(
        "//i[@id='tree_expanded_node_Season-16']"
    );

    await page.click(
        "//div[@class='treeItem treeItem-entity treeItem-objecttype-phase']"
    );

    // Click OK
    await page.click("//span[normalize-space()='OK']");

    // Allocate Barcode tab
    await page.click(
        "//span[normalize-space()='Allocate Barcodes']"
    );

    // Wait for Hierarchy and click
    const hierarchy = page.locator(
        "div[id='stibo_tab_Hierarchy'] div[class='tabs-panel-tab-inner'] div span[class='gwt-InlineLabel']"
    );

    await expect(hierarchy).toBeVisible({ timeout: 15000 });
    await hierarchy.click();

    // Initial Style button
    const initialStyle = page.locator(
        "//div[@id='Initial_Style']//i[@title='Add Reference'][normalize-space()='add_circle']"
    );

    await expect(initialStyle).toBeVisible({ timeout: 15000 });
    await initialStyle.click();

    // Search tab
    await page.click(
        "//div[@class='gwt-Label'][normalize-space()='Search']"
    );

    // Fill Initial Style
    await page.type(
        "//input[@class='gwt-SuggestBox']",
        "360301"
    );

    // Click Search
    await page.click(
        "//button[@class='stibo-GraphicsButton material SearchButton']//span[@class='text']"
    );

    // Click OK
    await page.click("//span[normalize-space()='OK']");

    // Wait for Retail Price tab instead of waitForTimeout
    const retailPriceTab = page.locator(
        "//span[normalize-space()='Retail Price & VAT']"
    );

    await expect(retailPriceTab).toBeVisible({ timeout: 15000 });
    await retailPriceTab.click();

    // Enter Retail Price
    await page.type(
        "//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory']",
        "9999.00"
    );

    // Selling Details
    await page.click(
        "//div[@id='stibo_tab_Selling_Details']//div[@class='tabs-panel-tab-inner']"
    );

    // Distribution ID
    const Dist = page.locator('select').filter({
        has: page.locator('//option[@title ="John Lewis"]')
    });

    await Dist.scrollIntoViewIfNeeded();
    await Dist.selectOption({ label: 'John Lewis' });

    // Image Source Type
    const image = page.locator('select').filter({
        has: page.locator('//option[@title ="Publication"]')
    });

    await image.scrollIntoViewIfNeeded();
    await image.selectOption({ label: 'Publication' });

    // Supplier
    await page.click(
        "//span[normalize-space()='Supplier']"
    );

    // Primary Manufacturing Country
    await page.locator(
        "div[data-step-component-id = 'PrimaryManufacturingCountry'] select"
    ).selectOption({ index: 1 });

    // Unit Cost
    await page.type(
        "//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory-for-approval mandatory']",
        "800"
    );

    // Supplier Pack Size
    const size = page.locator(
        "//div[@id='Supplier_Pack_Size']//div[@class='widgetAndIconsWrapper']//div//div//input[@type='text']"
    );

    await size.scrollIntoViewIfNeeded();
    await size.type("1");

    // Selling Attributes
    await page.click(
        "//span[normalize-space()='Selling Attributes']"
    );

    // Allocate Stock Number
    await page.click(
        "//span[normalize-space()='Allocate StockNumber']"
    );

    // Washing Instructions
    await page.locator(
        "div[data-step-component-id='WashingInstructions'] select"
    ).selectOption({ index: 7 });

    // Save and Submit
    await page.click(
        "//span[normalize-space()='Save&Submit']"
    );

});
