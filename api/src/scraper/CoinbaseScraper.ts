import puppeteer from 'puppeteer';
import { BaseScraper } from './BaseScraper';
import { Page } from 'puppeteer';
import dayjs from 'dayjs';
import { Cluster } from 'puppeteer-cluster';
import { PrismaClient } from '.prisma/client';

export class CoinbaseScraper extends BaseScraper {
  private readonly SCRAPE_URL = 'https://www.coinbase.com/blog';
  private cluster: Cluster<{ id: number, url: string }>;

  constructor(prisma: PrismaClient, dataSourceId: string, cluster: Cluster<{ id: number, url: string }>) {
    super(prisma, dataSourceId);
    this.cluster = cluster;
  }

  async scrape(): Promise<void> {
    const browser = await puppeteer.launch({
        headless: false
    });

    try {
      const page = await browser.newPage();
      await this.extractUrls(page);
      await this.extractArticles(page);
    } finally {
      await browser.close();
    }
  }

  private async extractUrls(page: Page) {
    await page.goto(this.SCRAPE_URL, {
        waitUntil: "networkidle2"
    });

    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    let retryCount = 0;
    for (let i=0;i<10;i++) {
        try {
            let button = null;
            const interactableButtonElements = await page.$$('button[class*="interactable"]');
            for (const buttonElement of interactableButtonElements) {
                const buttonTextProperty = await buttonElement.getProperty('textContent');
                const buttonText = await buttonTextProperty.jsonValue();
                if (buttonText == "Show more") {
                    button = buttonElement;
                }
            }

            if (button) {
                await button.click()
                await new Promise(r => setTimeout(r, Math.floor(Math.random() * 3000 + 1)))
            } else {
                if (retryCount < 3) {
                    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 3000 + 1)));
                    retryCount++;
                } else {
                    break;
                }
            }
        } catch (e) {
            console.log(e)
        }

    }

    const existringUrls = await this.prisma.article.findMany({
        select: {url: true}
    })

    const existringUrlSet = new Set(existringUrls.map(e => e.url));
    const linkUrls = [];

    for (let i=0;i<3;i++) {
        try {
            const aElementsWithCardHeader = await page.$$('a[data-qa*="CardHeader"]');
            for (const aElement of aElementsWithCardHeader) {
                const hrefProperty = await aElement.getProperty('href');
                const hrefValue = await hrefProperty.jsonValue();
                linkUrls.push(hrefValue);
            }
        } catch (e) {
            console.log(e);
        }
    }

    const articles = linkUrls.filter(
        (url: string) => !existringUrlSet.has(url)
    ).map((url: string) => ({
        url: url,
        dataSourceId: "Coinbase",
        timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }));

    await this.prisma.article.createMany({
        data: articles
    })

    await this.addUrls(articles.map((article, index) => ({ id: index, url: article.url })));

    console.log(articles.length, "articles added to queue.");
  }


  private async extractArticles(page: Page) {
    await this.cluster.task(async ({ page, data: {id, url} }) => {
        let retries = 0;
        const maxRetries = 3;

        while (retries < maxRetries) {
            try {
                await page.goto(url, { waitUntil: 'networkidle2' });
    
                await page.waitForSelector('h1', { timeout: 1000 });
                const titleElement = await page.$('h1')
                let title = null;
                if (titleElement) {
                    title = await (await titleElement.getProperty('textContent')).jsonValue();
                }
            
                await page.waitForSelector('section', { timeout: 1000 });
                const contentElement = await page.$('section')
                let content = null;
                if (contentElement) {
                    const divContents = await contentElement.$$eval('div[id]', (divs: any[]) => divs.map(div => div.textContent));
                    content = divContents.join('\n');
                }
        
                const article = await this.prisma.article.update({
                    where: {id: id},
                    data: {
                        title: title,
                        content: content
                    }
                });
    
                console.log(`Article ${id} updated.`);
                break;
            } catch (e) {
                retries++;
                console.error(`Error scraping article ${id}, attempt ${retries}:`, e);
    
                if (retries >= maxRetries) {
                    console.error(`Failed to scrape article ${id} after ${maxRetries} attempts.`);
                } else {
                    const waitTime = Math.random() * 2000 + 1000; 
                    console.log(`Retrying article ${id} in ${waitTime.toFixed(0)} ms...`);
                    await new Promise(resolve => setTimeout(resolve, waitTime));
    
                    await page.evaluate(() => {
                        window.scrollBy(0, Math.random() * 500);
                    });
                }
            }  
        }        
    });
  }

  private async addUrls(urls: { id: number, url: string }[]) {
    for (const urlData of urls) {
        this.cluster.queue({ id: urlData.id, url: urlData.url });
    }
  }
}