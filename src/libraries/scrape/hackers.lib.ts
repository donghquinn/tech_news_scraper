/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { HackerError } from 'errors/hacker.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import { HackersNewsArrayType } from 'types/hackers.type';
import { ScrapeLogger } from 'utils/logger.util';

/**
 * Hackers News 1 ~ 30: "https://news.ycombinator.com/"
 * @returns
 */
export const scrapeHackerNews = async (prisma: PrismaLibrary) => {
  try {
    const hackerUrl = 'https://news.ycombinator.com/';

    const html = await axios.get<string>(hackerUrl);

    const scrapedHtml = cheerio.load(html.data);

    const newsArray: Array<HackersNewsArrayType> = [];

    const hrefArray: Array<string> = [];

    // 랭크
    const rank = scrapedHtml('table')
      .children('tbody')
      .children('tr.athing')
      .children('td')
      .children('span.rank')
      .append('!')
      .text()
      .split('!');

    // HREF 게시글 원본 주소 가져오기
    scrapedHtml('table')
      .children('tbody')
      .children('tr.athing')
      .children('td.title')
      .children('span.titleline')
      .children('a')
      .each((index, item) => {
        const href = scrapedHtml(item).attr('href');

        hrefArray.push(href!);
      });

    // 포스트 제목
    const posts = scrapedHtml('table')
      .children('tbody')
      .children('tr.athing')
      .children('td.title')
      .children('span.titleline')
      .children('a')
      // 각각의 스크레이핑 한 데이터의 스플릿 문자 추가
      .append('!')
      .text()
      .split('!');

    for (let i = 0; i < rank.length - 1; i += 1) {
      newsArray.push({ rank: rank[i], post: posts[i].replace(/[\n\t\r]/g, ''), link: hrefArray[i] });
    }

    ScrapeLogger.info('Got New Hacker News Rank.');

    for (let i = 0; i < newsArray.length; i += 1) {
      await prisma.hackers.create({
        data: {
          rank: newsArray[i].rank,
          post: newsArray[i].post,
          link: newsArray[i].link,
        },
      });
    }

    return newsArray;
  } catch (error) {
    ScrapeLogger.error('Scrape Hacker Tech News Error:', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new HackerError(
      'Hacker News Scrape',
      'News Rank Scraping Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
