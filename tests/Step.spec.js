const {test, expect} = require('@playwright/test');

test('Step application', async ({page})=>{
    
    // Open STep Url
    await page.goto("https://jlp-test-step.mdm.stibosystems.com/#");
    // Enter username and password
    // Locator - property
    await page.locator('id=username').fill('J84620973a')

    // locator -CSS
    await page.fill("input[id='password']","January12345");
    
    //click on Sign on
    await page.click('//*[@id="signOnButton"]');

    // click on johnlewis user
    await page.click('//*[@id="JLUserPortal-link"]/span');

    // Click on create new
    await page.click("div[class='inner-panel double-width with-threeTaskModes'] button[type='button'] div span[class='text']");
    
    // click on basic item
    await page.click("//*[normalize-space()='Create Basic Item']");

    // click on product type
    await page.click("//*[@id='Product_Type']/div/div[1]/i");

    // click on search
    await page.click("//div[text()='Search']");

    // Type Product Name
    await page.type("//*[@class='gwt-SuggestBox']","Men's shirt");
   // await page.keyboard().press("Enter"); 

    // Click on Search
    await page.click("//*[@class='stibo-GraphicsButton material SearchButton']");

    // click on Ok 
    await page.click("//*[text() = 'OK']");

    // click on category type 
    await page.click("//div[@id='Category']//i[@title='Add Reference']");

    // Go to Search
    await page.click("//div[text()='Search']");

    // Enter the category number
    await page.type("//*[@class='gwt-SuggestBox']","3603");

    // Click on Search 
    await page.click("//*[@class='stibo-GraphicsButton material SearchButton']");

    // click on Ok 
    await page.click("//*[text() = 'OK']");

    page.waitForLoadState();

    // Type the short desc
    
    //await page.locator("//*[@class='gwt-TextBox stibo-Value validator-text stibo-Value-Text mandatory' and @maxlength='29']").waitFor();
    await page.locator("//*[@class='gwt-TextBox stibo-Value validator-text stibo-Value-Text mandatory' and @maxlength='29']").fill("Polo Men's Shirt");
    
    // Type the product desc
   // await page.locator("//textarea[@class='gwt-TextArea stibo-Value validator-text stibo-Value-Text mandatory']").waitFor();
    await page.locator("//textarea[@class='gwt-TextArea stibo-Value validator-text stibo-Value-Text mandatory']").fill("Polo Men's Shirt");
    
     // Enter VPN
    //await page.locator("//*[@class='gwt-TextBox stibo-Value validator-text stibo-Value-Text mandatory' and @maxlength='21']").waitFor();
    await page.locator("//*[@class='gwt-TextBox stibo-Value validator-text stibo-Value-Text mandatory' and @maxlength='21']").fill("245683");

    // Click on Sub brand 
    const addLink =  await page.locator("//i[@title='Add Link']");
    await addLink.waitFor({state : 'visible'});
    await expect(addLink).toBeEnabled();
    await addLink.click();

     // Go to Search
    await page.click("//div[text()='Search']");

    // Enter the sub brand 
    await page.fill("//input[@class='gwt-SuggestBox']","adidas");

    // Click on Search 
    await page.click("//*[@class='stibo-GraphicsButton material SearchButton']");

    const results = page.getByText(/adidas/);
    await results.nth(0).click();

    // click on Ok 
    await page.click("//*[text() = 'OK']");

    // click on supplier site
    await page.click("//div[@id='Primary_Supplier_Site']//i[@title='Add Reference']");

    // Go to Search
    await page.click("//div[text()='Search']");

    // Enter the supllier site
    await page.type("//input[@class='gwt-SuggestBox']","76666");

    // Click on Search 
    await page.click("//*[@class='stibo-GraphicsButton material SearchButton']");

    // click on Ok 
    await page.click("//*[text() = 'OK']");

    // To Select the future date 
    const getFutureDate = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);

    // Formats to M/d/yyyy (e.g., "10/1/2026")
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
};

    // Then use the updated locator
    await page.getByPlaceholder('M/d/yyyy').fill(getFutureDate(14));
    
    // Click on Save
    await page.click("//span[normalize-space()='Save']");
    
    await page.waitForTimeout(5000);
    // close the browser
    await page.close();

});