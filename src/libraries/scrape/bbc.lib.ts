/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { BbcError } from 'errors/bbc.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import moment from 'moment-timezone';
import { BbcNewsReturnArray } from 'types/bbc.type';
import { BbcLogger } from 'utils/logger.util';

export const scrapeBbcTechNews = async (prisma: PrismaLibrary, today: moment.Moment) => {
  try {
    const url = 'https://www.bbc.com/korean/topics/c2dwqjn99ggt';

    const { data } = await axios.get<string>(url);

    const html = cheerio.load(data);

    const linkArray: Array<string> = [];

    const returnArray: Array<BbcNewsReturnArray> = [];

    const newsTitle = html('div.promo-text').children('h2').children('a').append('!').text().split('!');

    html('div.promo-text')
      .children('h2')
      .children('a')
      .each((index, item) => {
        const link = html(item).attr('href');

        linkArray.push(link!);
      });

    for (let i = 0; i < linkArray.length; i += 1) {
      returnArray.push({
        rank: String(i + 1),
        post: newsTitle[i].replace(/[\n\t\r]/g, ''),
        link: linkArray[i],
      });
    }

    BbcLogger.info('BBC Technology News Found');

    for (let i = 0; i < returnArray.length; i += 1) {
      await prisma.bbcTechNews.create({
        data: {
          rank: returnArray[i].rank,
          post: returnArray[i].post,
          link: returnArray[i].link,
          founded: new Date(today.format('YYYY-MM-DD HH:mm:ss')),
        },
      });
    }
    return returnArray;
  } catch (error) {
    BbcLogger.error('Scrape BBC Tech News Error: ', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new BbcError(
      ' BBC Tech News',
      'Scrape BBC Tech News Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
