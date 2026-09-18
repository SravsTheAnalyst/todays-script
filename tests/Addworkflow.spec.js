const {test , expect } = require('@playwright/test');
test('Add Workflow',async ({page}) => {

    await page.addLocatorHandler(page.locator('i.portal-alert-popup-close-box__button'),
    async (locator) => await locator.click() 
);
    // Open STep Url
    await page.goto("https://jlp-test-step.mdm.stibosystems.com/#");   
    // popups
    
    // Enter username and password
    await page.locator('id=username').fill('J84620973a')

    // locator -CSS
    await page.fill("input[id='password']","January12345");
    
    //click on Sign on
    await page.click('//*[@id="signOnButton"]');

    // click on johnlewis user
    await page.click('//*[@id="JLUserPortal-link"]/span');

    // Go to add worflow
    await page.locator("div[class='status-selector__wrapper dashboard-widget-inner'] div[title='Add PO Ops Data (Buying)']").click();

    // Clicking on RIN indicator
    await page.getByText('RIN', {exact : true}).click();

    // Clicking on descending for sorting the RIN Id's 
    await page.getByText('Descending (Z-A)', {exact : true}).click();

    // clicking on the first rin id 
    await page.locator('table.sheet-table tbody tr td[data-col="1"]').first().click();

    // Goto general tab
    await page.click("//*[normalize-space()='General Classification']");

    // click on barcode as yes 
    await page.locator("//*[normalize-space()='Generate Barcode']/following::input[@type='radio'][2]").click();

    // Click on Exclusive
    const exclusive =  page.locator('//select[option[@title ="Exclusive"]]');
    await exclusive.scrollIntoViewIfNeeded();
    await exclusive.selectOption({label : 'Not Exclusive'});
    
    
    // Click on Financial type 
    const financial =  page.locator('//select[option[@title ="Standard Item"]]')
    await financial.scrollIntoViewIfNeeded();
    await financial.selectOption({label : 'Standard Item'});
    
    // Clicking on phase :
    await page.click("//div[@id='Phase']//i[@title='Add Reference']");

    // Click on 
    await page.click("//i[@id='tree_expanded_node_SeasonPhaseRoot']");

    // click on continue phase
    await page.click("//i[@id='tree_expanded_node_Season-16']");

    // click on no phase 
    await page.click("//div[@class='treeItem treeItem-entity treeItem-objecttype-phase']");

    // Click on ok
    await page.click("//span[normalize-space()='OK']");
    // click on alloacte barcode tab
    await page.click("//span[normalize-space()='Allocate Barcodes']");


    // click on hiearchy
    await page.click("div[id='stibo_tab_Hierarchy'] div[class='tabs-panel-tab-inner'] div span[class='gwt-InlineLabel']");

    //Click on Intial style button
    await page.click("//div[@id='Initial_Style']//i[@title='Add Reference'][normalize-space()='add_circle']");

    // click on search tab
    await page.click("//div[@class='gwt-Label'][normalize-space()='Search']");

    // fill the intial style
    await page.type("//input[@class='gwt-SuggestBox']","360301");

    // click on search and ok
    await page.click("//button[@class='stibo-GraphicsButton material SearchButton']//span[@class='text']");
    await page.click("//span[normalize-space()='OK']");
    await page.waitForTimeout(5000);
    // click on reatil price tab
    await page.click("//span[normalize-space()='Retail Price & VAT']");

    // Enter the reatil price
    await page.type("//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory']","9999.00");

    // Click on selling details tab
    await page.click("//div[@id='stibo_tab_Selling_Details']//div[@class='tabs-panel-tab-inner']");

    // Click on Dist Id : 
     const Dist =  page.locator('select').filter({has:page.locator('//option[@title ="John Lewis"]')}) 
    await Dist.scrollIntoViewIfNeeded();
    await Dist.selectOption({label : 'John Lewis'});

    // Click on Image source type 
    const image =  page.locator('select').filter({has:page.locator('//option[@title ="Publication"]')}) 
    await image.scrollIntoViewIfNeeded();
    await image.selectOption({label : 'Publication'});

    // Click on supplier 
    await page.click("//span[normalize-space()='Supplier']");

    // click on primary sourcing countryy
    await  page.locator("div[data-step-component-id = 'PrimaryManufacturingCountry'] select").selectOption({ index: 1});
    // fill the unit cost price 
    await page.type("//input[@class='gwt-TextBox validator-number stibo-Value stibo-Value-Number mandatory-for-approval mandatory']","800");

    // fill the supplier size 
    const size = await page.locator("//div[@id='Supplier_Pack_Size']//div[@class='widgetAndIconsWrapper']//div//div//input[@type='text']");
    await size.scrollIntoViewIfNeeded(); await size.type("1");

    // click on selling attributes
    await page.click("//span[normalize-space()='Selling Attributes']");
    
    // click on alloacte stock number button
    await page.click("//span[normalize-space()='Allocate StockNumber']");

    //fill the washing instructions :
    await page.locator("div[data-step-component-id='WashingInstructions'] select").selectOption({ index: 7});
    // click on save nad submit
    
    await page.click("//span[normalize-space()='Save&Submit']");
    
    
    // close the page 
   // await page.close();

});