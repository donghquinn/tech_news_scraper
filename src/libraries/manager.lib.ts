/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
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
    cron.schedule("59 11 * * *",  () => {
      // try {
        const message = `Scraper Started: ${this.today.toString()}`;

        const wrapper = '@'.repeat(message.length);
    
        Logger.info(wrapper);
        Logger.info(message);
        Logger.info(wrapper);

        Promise.allSettled([scrapeHackerNews(this.prisma, this.today)]).then((result) => {
          if(result[0].status === "rejected") {
            Logger.error('Hacker News Failed: %o', { result: result[0].reason });
        }});

        Promise.allSettled([scrapeBbcTechNews(this.prisma, this.today)]).then((result) => {
          if (result[0].status === "rejected") {
            Logger.error('BBC News Failed: %o', { result: result[0].reason });
          }
        });

        Promise.allSettled([scrapeMelonChart(this.prisma, this.today)]).then((result) => {
          if (result[0].status === "rejected") {
            Logger.error('Melon Chart Failed: %o', { result: result[0].reason });
          }
        });

        Promise.allSettled([getKoreanClimate(this.prisma, this.today)]).then((result) => {
          if (result[0].status === "rejected") {
            Logger.error('Climate Failed: %o', { result: result[0].reason });
          }
        });

        Promise.allSettled([naverNews(this.prisma, this.today)]).then((result) => {
          if (result[0].status === "rejected") {
            Logger.error('Naver News Failed: %o', { result: result[0].reason });
          }
        });
    });
  }
}
