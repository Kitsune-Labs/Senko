// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

const config = require("../../Data/DataConfig.json");
const { updateUser, randomArray, randomBummedImageName, calcTimeLeft } = require("../../API/Master");

const UserActions = [
    "_USER_ rest's on Senko's lap",
    "_USER_ sleeps on Senko's lap",
    "_USER_ passes out while being pampered",
    "_USER_ gets pampered by Senko's tail"
];

const Responses = [
    "There there dear, you've had a stressful day today",
    "Sweet dreams dear",
    `${Icons.ThinkCloud}  *I hope you sleep well...*`,
    "I'll continue to pamper you with my tail dear!"
];

const NoMore = [
    "I do not think you should sleep again\nYou may sleep  _TIMELEFT_",
    "Don't sleep dear!\nYou should sleep _TIMELEFT_"
];


module.exports = {
    name: "sleep",
    desc: "Sleep on Senko's lap",
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

        if (calcTimeLeft(RateLimits.Sleep_Rate.Date, config.cooldowns.daily)) {
            await updateUser(interaction.user, {
                RateLimits: {
                    Sleep_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Sleep_Rate.Amount = 0;
        }


        if (RateLimits.Sleep_Rate.Amount >= 1) {
            MessageStruct.embeds[0].description = `${randomArray(NoMore).replace("_TIMELEFT_", `<t:${Math.floor(RateLimits.Sleep_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
            MessageStruct.files = [{ attachment: `./src/Data/content/senko/${randomBummedImageName()}.png`, name: "image.png" }];

            return interaction.followUp(MessageStruct);
        }

        RateLimits.Sleep_Rate.Amount++;
        Stats.Sleeps++;

        await updateUser(interaction.user, {
            Stats: { Sleeps: Stats.Sleeps },

            RateLimits: {
                Sleep_Rate: {
                    Amount: RateLimits.Sleep_Rate.Amount,
                    Date: Date.now()
                }
            }
        });

        interaction.followUp(MessageStruct);

    }
};