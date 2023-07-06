import moment from "moment";
import { Logger } from "utils/logger.util";
import { PrismaLibrary } from "./common/prisma.lib";
import { scrapeBbcTechNews } from "./scrape/bbc.lib";
import { getKoreanClimate } from "./scrape/climate.lib";
import { scrapeHackerNews } from "./scrape/hackers.lib";
import { scrapeMelonChart } from "./scrape/music.lib";
import { naverNews } from "./scrape/naver.lib";


const prisma = new PrismaLibrary();

export const handleFunctions = async() => {
    const today = moment().tz('Asia/Seoul');

    const results = await Promise.allSettled([
        scrapeHackerNews(prisma, today),
        scrapeBbcTechNews(prisma, today),
        scrapeMelonChart(prisma, today),
        getKoreanClimate(prisma, today),
        naverNews(prisma, today)
        ]);

    for (let i =0; i <= results.length - 1; i += 1) {
        if (results[i].status === "fulfilled") {
            Logger.info("Successed: %o", {result: results[i]})
        } else {
            Logger.info("Error: %o", {error: results[i]})
        }
    }

    // results.map((result) => {
    //     if (result.status === "fulfilled"){
    //         Logger.info("Success: %o", {operations: result.value});
    //     } else {
    //         // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    //         Logger.error("Error: %o", {error: result.reason});
    //     }

    //     return result;
    // });
}