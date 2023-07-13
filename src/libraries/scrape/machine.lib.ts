import { PrismaClient } from "@prisma/client";
import axios from "axios";
import * as cheerio from 'cheerio';
import { hr } from "date-fns/locale";
import { MachineLearningError } from "errors/machine.error"
import { MachineLearningArrayType } from "types/machine.type";
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

        // const description = html("main.container-xl.px-2.px-md-3")
        // .children("div.page-body")
        // .children("div.row")
        // .children("div.col-12")
        // .children("div.card")
        // .children("div.card-body")
        // .text().replace("")
        // .replace(/<[^>]*>?/g, '')
        // .children("div.card-subtitle.mt-2")
        ;
//  
	
        // MachineLogger.info("Card Description: %o", {description});

        return link;
    } catch (error) {
        throw new MachineLearningError(
            "Machine Learning Original News",
            "Failed to get Original Link",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        )
    }
}
export const getMachineLearningNews = async () => {
    try {
        const url = "https://allainews.com/?ref=mlnews";

        const response = await axios.get<string>(url);

        const html = cheerio.load(response.data);

        // MachineLogger.info("Response: %o",{response: response.data});
        // const newsArray:Array<MachineLearningArrayType> = [];
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
            .text().split('\n').map((line) => line.trim()).filter((l) => l !== "");
            // .append("!")
            // .text()
            // .split("!");

            // title.filter((t) => {
            //     const text = t.split('"')[1].replace(/<[^>]*>?/g, '')
    
            //         titleArray.push(text);
            // })
            titleArray.push(...title);

            const href = html(item).children("div.col").children("a.d-block.text-dark").prop("href")!;
            hrefArray.push(`https://allainews.com/${href}`);
        })
        
        for (let i = 0; i<=hrefArray.length - 1; i+=1) {
            const link = await getOriginalLink(hrefArray[i]);
            originalArray.push(link);
        }

        MachineLogger.info("title Arrays: %o", {a: titleArray});
        MachineLogger.info("Href Array: %o", {hrefArray});
    } catch (error) {
        throw new MachineLearningError(
            "Machin Learning News",
            "Failed to Get Machine Learning News",
            error instanceof Error ? error : new Error(JSON.stringify(error)),
        )
    }
}



await getMachineLearningNews();