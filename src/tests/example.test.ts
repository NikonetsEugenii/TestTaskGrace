import { chromium, Browser, Page } from 'playwright';

(async () => {
    const browser: Browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page: Page = await context.newPage();

    const loginUrl = 'https://dev-admin.grace-technology.io/';
    const loginEmailSelector = '//*[@id="login_email"]';
    const loginPasswordSelector = '//*[@id="login_password"]';
    const loginButtonSelector = '//*[@type="submit"]';
    const dropdownSelector1 = '(//*[@class="ant-select-selector"])[1]';
    const dropdownSelector2 = '(//*[@class="ant-select-selector"])[2]';

    await page.goto(loginUrl);
    await login(page, loginEmailSelector, loginPasswordSelector, loginButtonSelector);

    await page.waitForSelector(dropdownSelector1, { state: 'visible' });
    await changeDropdownValue(page, dropdownSelector1, 'Pi');

    await page.reload();
    await checkDropdownValue(page, dropdownSelector1, 'Pi');

    await page.waitForSelector(dropdownSelector2, { state: 'visible' });
    await changeDropdownValue(page, dropdownSelector2, '2023');

    await page.reload();
    await checkDropdownValue(page, dropdownSelector2, '2023');

    await browser.close();
})();

async function login(page: Page, emailSelector: string, passwordSelector: string, buttonSelector: string) {
    await page.waitForSelector(emailSelector, { state: 'visible' });
    await page.fill(emailSelector, 'qa@grace-technology.io'); //should be encrypted
    await page.fill(passwordSelector, '123456');//should be encrypted
    await page.click(buttonSelector);
    await page.waitForLoadState();
}

async function changeDropdownValue(page: Page, dropdownSelector: string, value: string) {
    await page.click(dropdownSelector);
    await page.click(`//*[@title="${value}"]`);
    await page.waitForTimeout(1000);
}

async function checkDropdownValue(page: Page, dropdownSelector: string, expectedValue: string) {
    await page.waitForSelector(dropdownSelector, { state: 'visible' });
    await page.waitForTimeout(1000);
    const dropdownValue = await page.$eval(dropdownSelector, el => el.textContent);
    if (dropdownValue !== expectedValue) {
        console.error(`Dropdown value has changed to ${dropdownValue}`);
    } else {
        console.log(`Dropdown value is ${dropdownValue}`);
    }
}
