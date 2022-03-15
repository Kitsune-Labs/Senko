// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

const config = require("../../Data/DataConfig.json");
const { updateUser, randomBummedImageName, randomNumber, addYen, randomArray } = require("../../API/Master");


const UserActions = [
    "_USER_ rest's on Senko's lap",
    "_USER_ gets pampered by Senko-san"
];

const Responses = [
    "It's alright dear, i'm here for you...",
    "Relax dear, don't stress yourself too much",
    "*Senko-san starts to hum*",
    `${Icons.heart}  Rest now, you'll need your energy tomorrow`
];

const NoMore = [
    "I do not think you should rest anymore today\nYou may rest more _TIMELEFT_",
    "If you rest more you won't be tired tonight!\nYou can rest again _TIMELEFT_"
];

module.exports = {
    name: "rest",
    desc: "Rest on Senkos lap",
    userData: true,
    defer: true,
    /**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
        const MessageStruct = {
            embeds: [
                {
                    description: `**${randomArray(Responses)}**\n\n*${randomArray(UserActions).replace("_USER_", interaction.user.username)}*`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/cuddle.png", name: "image.png" }]
        };

        if (!config.cooldowns.daily - (Date.now() - RateLimits.Rest_Rate.Date) >= 0) {
            await updateUser(interaction.user, {
                RateLimits: {
                    Rest_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Rest_Rate.Amount = 0;
        }


        if (RateLimits.Rest_Rate.Amount >= 5) {
            MessageStruct.embeds[0].description = `${randomArray(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(RateLimits.Rest_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
            MessageStruct.files = [{ attachment: `./src/Data/content/senko/${randomBummedImageName()}.png`, name: "image.png" }];

            return interaction.followUp(MessageStruct);
        }


        RateLimits.Rest_Rate.Amount++;
        Stats.Rests++;

        if (randomNumber(100) > 75) {
            addYen(interaction.user, 50);

            MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  50x added for interaction`;
        }


        await updateUser(interaction.user, {
            Stats: { Rests: Stats.Rests },

            RateLimits: {
                Rest_Rate: {
                    Amount: RateLimits.Rest_Rate.Amount,
                    Date: Date.now()
                }
            }
        });

        if (RateLimits.Rest_Rate.Amount >= 5) MessageStruct.embeds[0].description += `\n\n— ${Icons.bubble}  Senko-san asks you to stop resting for today`;


        interaction.followUp(MessageStruct);
    }
};