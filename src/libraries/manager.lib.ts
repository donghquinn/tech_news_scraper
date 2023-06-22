/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import schedule, { RecurrenceRule } from 'node-schedule';
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

  private rule: RecurrenceRule;

  constructor() {
    this.rule = new schedule.RecurrenceRule();

    this.prisma = new PrismaLibrary();

    this.rule.tz = 'Asia/Seoul';

    this.rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
    this.rule.minute = 59;
    this.rule.hour = 23;
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new ScrapeObserver();
    }

    return this.instance;
  }

  public start() {
    schedule.scheduleJob(this.rule, async () => {
      try {
        Logger.info('Scrape Start');

        scrapeHackerNews(this.prisma);
        scrapeBbcTechNews(this.prisma);
        scrapeMelonChart(this.prisma);
        getKoreanClimate(this.prisma);
        naverNews(this.prisma);
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
