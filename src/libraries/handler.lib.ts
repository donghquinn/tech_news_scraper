import { ManagerError } from "errors/manager.error";
import moment from "moment-timezone";
import { Logger } from "utils/logger.util";
import { PrismaLibrary } from "./common/prisma.lib";
import { scrapeBbcTechNews } from "./scrape/bbc.lib";
import { getKoreanClimate } from "./scrape/climate.lib";
import { scrapeHackerNews } from "./scrape/hackers.lib";
import { naverNews } from "./scrape/naver.lib";

const prisma = new PrismaLibrary();

export const handleFunctions = async() => {
    try {
        const today = moment().tz('Asia/Seoul');

        const message = `Scrape Start: ${today.toLocaleString()}`
        const wrapper = "@".repeat(message.length);

        Logger.info(wrapper);
        Logger.info(message);
        Logger.info(wrapper);

        const results = await Promise.allSettled([
            scrapeHackerNews(prisma, today),
            scrapeBbcTechNews(prisma, today),
            getKoreanClimate(prisma, today),
            naverNews(prisma, today)
            ]);
    
        for (let i = 0; i <= results.length - 1; i += 1) {
            if (results[i].status === "fulfilled") {
                Logger.info("Successed: %o", {result: results[i]})
            } else {
                Logger.info("Error: %o", {error: results[i]})
            }
        }
    } catch (error) {
        throw new ManagerError(
        "Handling Functions", 
        "Failed to Functioning",
        error instanceof Error ? error : new Error(JSON.stringify(error))
        )
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