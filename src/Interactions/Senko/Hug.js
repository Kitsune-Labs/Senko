// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

const config = require("../../Data/DataConfig.json");
const randomFile = require("../../API/modules/image");
const { fetchData, updateUser, randomNumber, addYen, randomBummedImageName, randomArray } = require("../../API/Master");

const Responses = [
    "_USER_ hugs Senko-san"
];

const Sounds = [
    "Umu~",
    "Umu Umu"
];

const MoreResponses = [
    `${Icons.heart}  We can hug more _TIMELEFT_`,
    `${Icons.exclamation}  We can hug more _TIMELEFT_! Geez, you're so spoiled!`,
    `${Icons.heart}  I'll be pampering you more _TIMELEFT_, look forward to it!`,
];

module.exports = {
    name: "hug",
    desc: "Hug Senko-san or another kitsune in your guild!",
    options: [
        {
            name: "user",
            description: "Hug someone",
            type: "USER",
        }
    ],
    defer: true,
    /**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction) => {
        const OptionalUser = interaction.options.getUser("user");

        if (OptionalUser) {
            randomFile("./src/Data/content/hug", (err, file) => {
                const Messages = [
                    `${interaction.user} hugs ${OptionalUser}!`,
                    `${OptionalUser} has been hugged by ${interaction.user}!`,
                ];

                interaction.followUp({
                    embeds: [
                        {
                            description: `${randomArray(Messages)}`,
                            image: {
                                url: `attachment://${file.endsWith(".png") ? "hug.png" : "hug.gif"}`
                            },
                            color: SenkoClient.colors.light
                        }
                    ],
                    files: [ { attachment: `./src/Data/content/hug/${file}`, name: file.endsWith(".png") ? "hug.png" : "hug.gif" } ]
                });
            });

            return;
        }

        const { RateLimits, Stats } = await fetchData(interaction.user);

        const MessageStruct = {
            embeds: [
                {
                    description: randomArray(Responses).replace("_USER_", interaction.user.username),
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/hug.png", name: "image.png" }]
        };


        // if (!config.cooldowns.daily - (Date.now() - RateLimits.Hug_Rate.Date) >= 0) {
        //     await updateUser(interaction.user, {
        //         RateLimits: {
        //             Hug_Rate: {
        //                 Amount: 0,
        //                 Date: Date.now()
        //             }
        //         }
        //     });

        //     RateLimits.Hug_Rate.Amount = 0;
        // }



        // if (RateLimits.Hug_Rate.Amount >= 20) {
        //     MessageStruct.embeds[0].description = `${randomArray(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor(RateLimits.Hug_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
        //     MessageStruct.files = [{ attachment: `./src/Data/content/senko/${randomBummedImageName()}.png`, name: "image.png" }];

        //     return interaction.followUp(MessageStruct);
        // }


        if (randomNumber(100) > 75) {
            addYen(interaction.user, 50);

            MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  50x added for interaction`;
        }


        MessageStruct.embeds[0].title = randomArray(Sounds);

        Stats.Hugs++;
        // RateLimits.Hug_Rate.Amount++;

        await updateUser(interaction.user, {
            Stats: { Hugs: Stats.Hugs },

            // RateLimits: {
            //     Hug_Rate: {
            //         Amount: RateLimits.Hug_Rate.Amount,
            //         Date: Date.now()
            //     }
            // }
        });

        // if (RateLimits.Hug_Rate.Amount >= 20) MessageStruct.embeds[0].description += `\n\n— ${Icons.bubble}  Senko-san says this should be our last hug for now`;

        interaction.followUp(MessageStruct);
    }
};