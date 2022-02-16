// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const Paginate = require("../API/PaginateUpdate/Main");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async Interaction => {
            if (Interaction.isSelectMenu()) {
                let Page = 1;
                console.log(Interaction.values[0]);

                const Manga = {
                    "Tail1": {
                        "1": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/1-069dec4d17b7cb3b841f129332f38afa968ffa79bd5b91fc52c18b093e79f083.png",
                        "2": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/2-c65fca91e8b594b2b19adb5452aa294e7b6eb7884a25ac938e7338df951c5cca.png",
                        "3": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/3-837a08daaf48d96e0754cf53733922ea73ae508e56558999ed2ac6a6849ad6bf.png",
                        "4": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/4-e122ae0e06caa8e9c3238edf6a71feba3dd0fb99525c70adff175967de15e1a0.png",
                        "5": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/5-c7efeaaec1dab4ecfaf9e063f365bca66510e93ab8f834727530a0f9ac7c2f55.png",
                        "6": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/6-4f55c65872a9169e0f3c6dccc546e9c7e87a68d6d0a5f8b558a17820d1c9b55e.png",
                        "7": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/7-f2bdc9f39aaf196dc49c60224459cf418d6a8d56ed3701a8ef572e66aff05aca.png",
                        "8": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/8-7097e4954183042c9ef31139a11126c93cdb2874a93370e44e60f24a5d3eac43.png",
                        "9": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/9-6e49f763e11c9c78c35ef0c7d83f4a3cbe032bc481cf6c439f3714f872f37319.png",
                        "10": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/10-c3fccaae72378b61a3ee313fa439c659b836ef56edec860d71e428a4899e3bb5.png",
                        "11": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/11-86034221b3a831986b314c11b417194c555293528dbdb7c8c798a6c26bb71c1b.png",
                        "12": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/12-0ebbe97c3481a19ec2d0dea34e74e2c4284a81632a67c2e7b54886be7ba9c27d.png",
                        "13": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/13-fca51fb716b29c4314c1484cea356a3f146be3bb2bf2838d7e230e7a075bbf2b.png",
                        "14": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/14-1afd6d42f6058038856c4c28f8cb1e508a41f10052ca32d8ed1c60dff3829d24.png",
                        "15": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/15-85abcc391b0ed7a3a0b8496b785deda222840544e9cc12367cc8207c1eaed2f0.png",
                        "16": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/16-fe105b0e317027197334c9e8635c862b7fac5d4b46459e4aacf07f241d470523.png",
                        "17": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/17-d108d63bbfea99b266a220da8bdee8eca6df64d4686647dc91943c50e7b0f91a.png",
                        "18": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/18-846cfe9b743284b7f40a2cc01d15e84d981a33b6af2f019c9daa65f3a4b3d9d5.png",
                        "19": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/19-371229e647ad98d4094fc84a6fd96229bc3fbb3b75b8bf605417c3eed7aa8e6e.png",
                        "20": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/20-bf0b0b520c9c2df9eec43be7086382c876ffc95c5aeb6da1a99f82a6422d4084.png",
                        "21": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/21-9d52eec0735c92edb5483667055298effb41c6f72fa7a7ccb823a82daf4e1d09.png",
                        "22": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/22-b5dc662c636c2af501c504db70f8463e4a6e82aba370c49ecbe45de93b0e96ee.png",
                        "23": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/23-a386c9e9d2f911a19f15bf0c2c21530021aa0c1686c8fdfaa4d52cb6a8a7f84d.png",
                        "24": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/24-3e7c54403c2f97fc39740dd8d3e1b50b2e03b2329dfc3ef9114bc000f65a683b.png",
                        "25": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/25-be578fb0c38813b798fdd32af7e270266ffa1fca8a1d5b8b89ced04941b18aae.png",
                        "26": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/26-1c5b59de481a63d140fa3119c7c5a11760585d6a667edfa600499927f608db36.png",
                        "27": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/27-2daa1119a5c4558c706cf3326108d5d6cb281ac6c494d28fe2e1811e39d34512.png",
                        "28": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/28-6a5c7f8f2260ba223c58bd3036fc0d2dceab2141b70d204ebdc3a83589159cdc.png",
                        "29": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/29-e1542f42eb0c0928b902a11f47942be592b7ecf2f3da618e87a69a2042567d6d.png",
                        "30": "https://uploads.mangadex.org/data/733518fa33089012dffcb09feb942e30/30-7312ff58a12a3b143f2147103e0c7dab783826465eae75e393e72bb3b0fb04f5.png"
                    }
                };

                const SelectedManga = Manga[Interaction.values[0].replace("read_", "")];
                const Embeds = [];

                switch (Interaction.values[0]) {
                    case "read_Tail1":
                        for (let i = 1; i <= Object.keys(SelectedManga).length; i++) {
                            Embeds.push({
                                "title": "Sewayaki Kitsune no Senko-san",
                                "description": "Vol. 1 — Ch. 1",
                                "image": {
                                    "url": SelectedManga[Page]
                                }
                            });

                            Page++;
                        }
                        Paginate(Interaction, Embeds, 120000, false);
                    break;
                }
            }
        });
    }
};
