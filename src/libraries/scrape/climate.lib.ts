/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ClimateError } from 'errors/climate.error';
import { PrismaLibrary } from 'libraries/common/prisma.lib';
import fetch from 'node-fetch';
import { ClimateReturnData, Response } from 'types/climate.type';
import { ClimateLogger } from 'utils/logger.util';

export const getKoreanClimate = async (prisma: PrismaLibrary, today: moment.Moment) => {
  try {
    let khaiStatus: string;

    const url = process.env.KOREAN_CLIMATE!;
    const token = process.env.KOREAN_ENCODED_TOKEN!;

    const options = {
      method: 'GET',
    };

    // eslint-disable-next-line max-len
    const requestUrl = `${url}?returnType=json&serviceKey=${token}&pageNo=1&&stationName=종로구&dataTerm=DAILY&numOfRows=23`;

    ClimateLogger.info("Request Url: %o", {requestUrl});

    const response = await fetch(
      requestUrl,
      options,
    );

    const responseData = (await response.json()) as Response;

    const climate = responseData.response.body.items as Array<ClimateReturnData>;

    for (let i = 0; i < climate.length; i += 1) {
      if (Number(climate[i].khaiGrade) === 1) {
        khaiStatus = 'Good';
        climate[i].khaiStatus = khaiStatus;
      }

      if (Number(climate[i].khaiGrade) === 2) {
        khaiStatus = 'Normal';
        climate[i].khaiStatus = khaiStatus;
      }

      if (Number(climate[i].khaiGrade) === 3) {
        khaiStatus = 'Bad';
        climate[i].khaiStatus = khaiStatus;
      }

      if (Number(climate[i].khaiGrade) >= 4) {
        khaiStatus = 'Very Bad';
        climate[i].khaiStatus = khaiStatus;
      }
    }

    ClimateLogger.info('Climate Data Inserted');

    for (let i = 0; i < climate.length; i += 1) {
      await prisma.climate.create({
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
          writer: "donghquinn",
          founded: new Date(today.format('YYYY-MM-DD HH:mm:ss')),
        },
      });
    }
    
    return climate;
  } catch (error) {
    ClimateLogger.error('Scrape Korean Climate Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ClimateError(
      'Korean Climate',
      'Get Korean Climate Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
