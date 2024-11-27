import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Page } from 'puppeteer';
import { PrismaClient } from '@prisma/client';

puppeteer.use(StealthPlugin());

export abstract class BaseScraper {
  protected prisma: PrismaClient;
  protected dataSourceId: string;

  constructor(prisma: PrismaClient, dataSourceId: string) {
    this.prisma = prisma;
    this.dataSourceId = dataSourceId;
  }

  protected async simulateHumanBehavior(page: Page) {
    // Random scroll
    await page.evaluate(() => {
      window.scrollBy(0, Math.random() * 100);
    });

    // Random wait
    await new Promise(r => setTimeout(r, Math.floor(Math.random() * 2000 + 1000)));
  }

  protected async handleRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
      }
    }
    throw lastError;
  }

  abstract scrape(): Promise<void>;
} 