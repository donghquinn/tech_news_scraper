/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import moment from 'moment-timezone';
import cron from 'node-cron';
import { Logger } from 'utils/logger.util';
import { PrismaLibrary } from './common/prisma.lib';
import { scrapeBbcTechNews } from './scrape/bbc.lib';
import { getKoreanClimate } from './scrape/climate.lib';
import { scrapeHackerNews } from './scrape/hackers.lib';
import { scrapeMelonChart } from './scrape/music.lib';
import { naverNews } from './scrape/naver.lib';

export class ScrapeObserver {
  private static instance: ScrapeObserver;

  private prisma: PrismaLibrary;

  private today: moment.Moment;

  constructor() {
    this.prisma = new PrismaLibrary();

    this.today = moment().tz('Asia/Seoul');
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ScrapeObserver();
    }

    return this.instance;
  }

  public start() {
    const message = `Scraper Started: ${this.today.toString()}`;

    const wrapper = '@'.repeat(message.length);

    Logger.info(wrapper);
    Logger.info(message);
    Logger.info(wrapper);

    cron.schedule("* 59 11 * * *", async () => {
      try {
        Logger.info('Scrape Start');

        await scrapeHackerNews(this.prisma, this.today);
        await scrapeBbcTechNews(this.prisma, this.today);
        await scrapeMelonChart(this.prisma, this.today);
        await getKoreanClimate(this.prisma, this.today);
        await naverNews(this.prisma, this.today);
        
      } catch (error) {
        Logger.error('Error: %o', { error });

        Logger.error('Observer Error: %o', {
          error: error instanceof Error ? error : new Error(JSON.stringify(error)),
        });
      }
    });

    // Logger.debug('Now, and Running Moment: %o', { now: now, runningMoment });
  }
}
