import axios from "axios";
import * as cheerio from 'cheerio';
import { MachineLearningError } from "errors/machine.error";
import { PrismaLibrary } from "libraries/common/prisma.lib";
import { MachineLogger } from "utils/logger.util";

export const getOriginalLink = async(href: string) => {
    try {
        const response = await axios.get<string>(href);

        const html = cheerio.load(response.data);

        const link = html("main.container-xl.px-2.px-md-3")
        .children("div.page-body")
        .children("div.row")
        .children("div.col-12")
        .children("div.card")
        .children("div.card-body")
        // .children("div.card-subtitle.mt-2")
        .children("div.d-grid.gap-2.my-4")
        .children("a.btn.btn-primary")
        .prop("href")!;

        return link;
    } catch (error) {
        throw new MachineLearningError(
            "Machine Learning Original News",
            "Failed to get Original Link",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        )
    }
}

export const getTopSourceNews = async(html: cheerio.CheerioAPI) => {
    try {
        const titleArray: Array<string> = [];
        const hrefArray: Array<string> = [];
        const originalArray: Array<string> = [];

        html("main.container-xl.px-2.px-md-3")
        .children("div.page-body")
        .children("div.row.d-none.d-md-flex")
        .children("div.col-md-12.col-lg-4.mt-3.mt-lg-0")
        .children("div.row.row-cols-1.g-3")
        .children("div.col")
        .children("div.card.h-100")
        .children("div.card-body.pt-2")
        .children("div.divide-y").each((index, item) => {
            const title = html(item)
            .children("div.row")
            .children("a.d-block.text-dark")
            .text()
            .split('\n')
            .map((line) => line.trim())
            .filter((l) => l !== "");

            const link = html(item)
            .children("div.row")
            .children("a.d-block.text-dark").prop("href")!

            titleArray.push(...title);
            hrefArray.push(`https://allainews.com/${link}`);
        })

        for (let i = 0; i <= hrefArray.length-1 ; i += 1) {
            const originalLink = await getOriginalLink(hrefArray[i]);

            originalArray.push(originalLink);
        }

        return {
            originalArray,
            titleArray
        }
    } catch (error) {
        throw new MachineLearningError(
            "Get Top Source Machine Learning news",
            "Failed to Get Tope Source Machine Learning news",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        )
    }

}

export const getLatestNews = async(html: cheerio.CheerioAPI) => {
    try {
        const hrefArray: Array<string> = [];
        const originalArray: Array<string> = [];
        const titleArray: Array<string> = [];

        html("main.container-xl.px-2.px-md-3")
        .children("div.page-body")
        .children("div.row.d-none.d-md-flex")
        .children("div.col-md-6.col-lg-4")
        .children("div.card")
        .children("div.card-body.pt-2")
        .children("div.divide-y")
        .children("div.row").each((index, item) => {
            const title = html(item)
            .children('div.col')
            .children("a.d-block.text-dark")
            .text()
            .split('\n')
            .map((line) => line.trim())
            .filter((l) => l !== "");

            titleArray.push(...title);

            const href = html(item).children("div.col").children("a.d-block.text-dark").prop("href")!;
            hrefArray.push(`https://allainews.com/${href}`);
        });

        MachineLogger.info("Founded New Machine Learning News");
        
        for (let i = 0; i<=hrefArray.length - 1; i+=1) {
            const link = await getOriginalLink(hrefArray[i]);
            originalArray.push(link);
        }

        return {
            originalArray,
            titleArray
        }
    } catch (error) {
        throw new MachineLearningError(
            "Machine Learning Latest News",
            "Failed to Get Machine Learning Latest News",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        )
    }
}

export const getMachineLearningNews = async (prisma: PrismaLibrary, today: moment.Moment) => {
    try {
        const url = "https://allainews.com/?ref=mlnews";

        const response = await axios.get<string>(url);

        const html = cheerio.load(response.data);

        const {originalArray:latestLink, titleArray:latestTitle} = await getLatestNews(html);
        const {originalArray:topLink, titleArray:topTitle} = await getTopSourceNews(html);

        for (let i = 0; i <= latestLink.length - 1; i += 1) {
            await prisma.machineNews.create({
                data: {
                    category: "latest",
                    title: latestTitle[i],
                    link: latestLink[i],
                    founded: new Date(today.format('YYYY-MM-DD HH:mm:ss')),
                }
            })
        }

        MachineLogger.info("Insert Latest News Finished");

        for (let j = 0; j <= topLink.length - 1;  j += 1) {
            await prisma.machineNews.create({
                data: {
                    category: "top",
                    title: topTitle[j],
                    link: topLink[j],
                    founded: new Date(today.format('YYYY-MM-DD HH:mm:ss')),
                }
            })
        }

        MachineLogger.info("Insert Top News Finished");
        
    } catch (error) {
        throw new MachineLearningError(
            "Machin Learning News",
            "Failed to Get Machine Learning News",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        )
    }
}
