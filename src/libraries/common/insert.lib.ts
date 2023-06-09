import { BbcError } from 'errors/bbc.error';
import { ClimateError } from 'errors/climate.error';
import { HackerError } from 'errors/hacker.error';
import { MelonError } from 'errors/melon.error';
import { NaverError } from 'errors/naver.error';
import moment from 'moment-timezone';
import { BbcNewsReturnArray } from 'types/bbc.type';
import { ClimateReturnData } from 'types/climate.type';
import { HackersNewsArrayType } from 'types/hackers.type';
import { MusicRank } from 'types/music.type';
import { NaverKinReturn, NaverNewsItems } from 'types/naver.type';
import { Logger } from 'utils/logger.util';
import { PrismaLibrary } from './prisma.lib';

export class InsertData {
  private now: string;

  // private prisma: PrismaLibrary;

  constructor(private readonly prisma: PrismaLibrary) {
    this.now = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  async insertBbcData(bbc: Array<BbcNewsReturnArray>) {
    try {
      Logger.debug('Inserting BBC News: %o', { bbc });

      for (let i = 0; i < bbc.length; i += 1) {
        await this.prisma.bbcTechNews.create({
          data: {
            rank: bbc[i].rank,
            post: bbc[i].post,
            link: bbc[i].link,
            founded: this.now,
          },
        });
      }
      Logger.info('BBC News Inserted Finished.');
    } catch (error) {
      throw new BbcError(
        'Insert BBC News',
        'Insert Failed',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertMelonData(melon: Array<MusicRank>) {
    try {
      Logger.debug('Insert Melon Music Rank: %o', { melon });
      for (let i = 0; i < melon.length; i += 1) {
        await this.prisma.melon.create({
          data: {
            rank: melon[i].rank,
            title: melon[i].title,
            artist: melon[i].artist,
            founded: this.now,
          },
        });
      }

      Logger.info('Melon Music Chart Inserted Finished.');
    } catch (error) {
      throw new MelonError(
        'Insert Melon',
        'Insert Failed',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertClimateData(climate: Array<ClimateReturnData>) {
    try {
      Logger.debug('Insert Climate Data: %o', { climate });

      for (let i = 0; i < climate.length; i += 1) {
        await this.prisma.climate.create({
          data: {
            dataTime: climate[i].dataTime,
            pm10Value: climate[i].pm10Value,
            no2Value: climate[i].no2Value,
            o3Value: climate[i].o3Value,
            coValue: climate[i].coValue,
            so2Value: climate[i].so2Value,
            khaiValue: climate[i].khaiValue,
            o3Grade: climate[i].o3Grade,
            so2Grade: climate[i].so2Grade,
            no2Grade: climate[i].no2Grade,
            coGrade: climate[i].coGrade,
            khaiGrade: climate[i].khaiGrade,
            khaiStatus: climate[i].khaiStatus,
            created: this.now,
          },
        });
      }

      Logger.info('Korean Climate Inserted Finished.');
    } catch (error) {
      throw new ClimateError(
        'Insert Korean Climate',
        'Insert Failed',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertHackerNewsData(hackerNews: Array<HackersNewsArrayType>) {
    try {
      Logger.debug('Insert Hacker News Data: %o', { hackerNews });

      for (let i = 0; i < hackerNews.length; i += 1) {
        await this.prisma.hackers.create({
          data: {
            rank: hackerNews[i].rank,
            post: hackerNews[i].post,
            link: hackerNews[i].link,
            founded: this.now,
          },
        });
      }

      Logger.info('Hacker News Inserted Finished.');
    } catch (error) {
      throw new HackerError(
        'Insert Hacker',
        'Insert Failed',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNaverNews(naverNews: Array<NaverNewsItems>) {
    try {
      Logger.debug('Insert Naver News: %o', { naverNews });

      for (let i = 0; i < naverNews.length; i += 1) {
        await this.prisma.naverNews.create({
          data: {
            keyWord: 'IT',
            title: naverNews[i].title,
            description: naverNews[i].description.replace(/[\n\t\r]/g, ''),
            originallink: naverNews[i].originallink,
            url: naverNews[i].link,
            postedTime: naverNews[i].pubDate,
            founded: this.now,
          },
        });
      }

      Logger.info('Naver IT News Inserted Finished.');
    } catch (error) {
      throw new NaverError(
        'Insert Naver News',
        'Insert Failed',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNaverKin(naverKin: NaverKinReturn) {
    try {
      const { contentArray, hrefArray, categoryArray, titleArray } = naverKin;

      for (let a = 0; a <= contentArray.length - 1; a += 1) {
        await this.prisma.naverKin.create({
          data: {
            title: titleArray[a],
            content: contentArray[a],
            category: categoryArray[a],
            link: hrefArray[a],
          },
        });
      }
    } catch (error) {
      throw new NaverError(
        'Insert Naver Kin',
        'Insert Failed',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
