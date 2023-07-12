/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { NaverError } from 'errors/naver.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import fetch from 'node-fetch';
import { NaverNewsResponse } from 'types/naver.type';
import utf8 from 'utf8';
import { NaverLogger } from 'utils/logger.util';

export const naverNews = async (prisma: PrismaLibrary, today: moment.Moment) => {
  try {
    const keyWordArray = ["AI", "인공지능", "IT", "스포츠", "ai", "ml"];

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
  
      NaverLogger.info('Found Naver News: %o', {response: response.items});

      for (let i = 0; i <= response.items.length; i+=1) {
        await prisma.naverNews.create({
          data: {
            keyWord: keyWordArray[j],
            title: response.items[i].title.replace(/<[^>]*>?/g, '').replace("&apos;", ""),
            description: response.items[i].description.replace(/<[^>]*>?/g, '').replace("&apos;", ""),
            originallink: response.items[i].originallink,
            url: response.items[i].link,
            postedTime: response.items[i].pubDate,
            founded: new Date(today.format('YYYY-MM-DD HH:mm:ss')),
          },
        });
      }
    }

    return keyWordArray;
  } catch (error) {
    NaverLogger.error('Scrape Naver News Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new NaverError(
      'Naver News',
      'Naver News Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

