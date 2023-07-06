/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NaverError } from 'errors/naver.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import fetch from 'node-fetch';
import { NaverNewsResponse } from 'types/naver.type';
import utf8 from 'utf8';
import { ScrapeLogger } from 'utils/logger.util';

export const naverNews = async (prisma: PrismaLibrary, today: moment.Moment) => {
  try {
    const keyWordArray = ["AI", "인공지능", "IT", "스포츠"];

    for (let j = 0; j <= keyWordArray.length; j +=1) {
      const queryName = utf8.encode(keyWordArray[j]);

      const url = `https://openapi.naver.com/v1/search/news.json?&query=${queryName}`;
  
      const headers = {
        'X-Naver-Client-Id': process.env.NAVER_CLIENT!,
        'X-Naver-Client-Secret': process.env.NAVER_TOKEN!,
      };
  
      const options = {
        method: 'GET',
        headers,
      };
  
      const response = (await (await fetch(url, options)).json()) as NaverNewsResponse;
  
      ScrapeLogger.info('Found Naver News: %o', {response: response.items});

      for (let i = 0; i <= response.items.length; i+=1) {
        await prisma.naverNews.create({
          data: {
            keyWord: keyWordArray[j],
            title: response.items[i].title.replace(/<[^>]*>?/g, ''),
            description: response.items[i].description.replace(/<[^>]*>?/g, ''),
            originallink: response.items[i].originallink,
            url: response.items[i].link,
            postedTime: response.items[i].pubDate,
            writer: "donghquinn",
            founded: new Date(today.format('YYYY-MM-DD HH:mm:ss')),
          },
        });
      }
    }

    return keyWordArray;
  } catch (error) {
    ScrapeLogger.error('Scrape Naver News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new NaverError(
      'Naver News',
      'Naver News Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const naverKin = async () => {
  try {
    const keyword = ['빅데이터', '머신러닝', '딥러닝'];

    for (let i = 0; i <= keyword.length; i += 1) {
      const url = `https://kin.naver.com/search/list.nhn?query=${i}`;

      const response = await axios.get<string>(url);

      const html = cheerio.load(response.data);

      const title = html('div.section').children('ul.basic1').children('li').append('!').text().split('!');

      // .children("ul.basic1").children("li").children("dl").children("dt").children("a").children("b").toString()
      // const date = html(item).children("li").children("dl").children("dt").children("dd.txt_inline").toString()

      ScrapeLogger.debug(title);
    }

    // const response =
  } catch (error) {
    throw new NaverError(
      'Naver KIN',
      'Scrape Naver Kin Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
