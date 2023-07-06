/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import './env';

import { scrapeBbcTechNews } from 'libraries/scrape/bbc.lib';
import { getKoreanClimate } from 'libraries/scrape/climate.lib';
import { scrapeHackerNews } from 'libraries/scrape/hackers.lib';
import { scrapeMelonChart } from 'libraries/scrape/music.lib';
import { naverNews } from 'libraries/scrape/naver.lib';
import cron from 'node-cron';
import { Logger } from 'utils/logger.util';
import moment from 'moment-timezone';
import { PrismaLibrary } from 'libraries/common/prisma.lib';



cron.schedule("59 11 * * *", () => {
    const today = moment().tz('Asia/Seoul');
    const prisma = new PrismaLibrary();
    // try {
    const message = `Scraper Started: ${today.toString()}`;
    const wrapper = '@'.repeat(message.length);

    Logger.info(wrapper);
    Logger.info(message);
    Logger.info(wrapper);

    Promise.allSettled([
    scrapeHackerNews(prisma, today),
    scrapeBbcTechNews(prisma, today),
    scrapeMelonChart(prisma, today),
    getKoreanClimate(prisma, today),
    naverNews(prisma, today)
    ]).then((result) => {
    if(result[0].status === "rejected") {
        Logger.error('Failed Failed: %o', { result: result[0].reason });
    }});
  });