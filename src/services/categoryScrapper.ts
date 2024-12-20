import puppeteer from 'puppeteer';
import { load } from 'cheerio';


const scrapeAmazonSideNav = async (url: string) => {
    try {
        const browser = await puppeteer.launch({
            headless: false, 
            // args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        // Set User-Agent and navigate to the page
        await page.setUserAgent('Mozilla/5.0 ...');
        await page.goto(url, { waitUntil: 'networkidle2' });

        await page.waitForSelector('#nav-hamburger-menu', { visible: true });
        await page.click('[id="nav-hamburger-menu"]');
        // delay(2000) 
 
        await page.waitForSelector('#hmenu-content', { visible: true });

        const departmentId = '26'; 
        setTimeout( async() => {
            const elementHandle = await page.$(`a[data-menu-id="${departmentId}"]`);
            if (elementHandle) {
                await elementHandle.click();
            } else { 
                console.error(`Element with data-menu-id="${departmentId}" not found.`);
            } 

        },100)  
        
        await page.click(`a[data-menu-id="${departmentId}"]`);
        
        await page.waitForSelector(`ul[data-menu-id="${departmentId}"].hmenu-visible`, { visible: true });
        // // await page.waitForSelector(`ul.hmenu-visible`, { visible: true });
  
        // // Get the content of the newly visible subcategories   
        const categoriesContent = await page.content();
        const $ = load(categoriesContent);
 
        // Extract categories under the clicked department
        const categories:{name?:string, href?:string}[] = [];
        $(`ul[data-menu-id="${departmentId}"].hmenu-visible li a`).each((index, element) => {
            const categoryText = $(element).text().trim(); 
            const href = $(element).attr('href');
            if (categoryText) {  
                categories.push({ 
                    name: categoryText,
                    href
                });
            }
        });

        await browser.close();
        return categories;

    } catch (error) {
        console.error('Error fetching the side navigation:', error);
    }
};

// Example usage
const main = async () => {
    const categories = await scrapeAmazonSideNav('https://www.amazon.com');

    if (categories) {
        console.log('Categories under the selected department:', categories);
    }
};

main();
