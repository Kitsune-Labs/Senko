// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const config = require("../../Data/DataConfig.json");
const { updateUser, randomNumber, addYen, randomBummedImageName, randomArray } = require("../../API/Master");

const Responses = [
    "Senko-san takes a drink of her Hojicha",
    `${Icons.flushed}  You compliment Senko-san with her skills of Tea making`,
    "You tell Senko-san that her tea is the best"
];

const NoMore = [
    "I think you've had enough for today",
    "If you drink anymore we won't have any more for tomorrow!",
    "Senko-san thinks you're drinking too much Hojicha",
];

const Sounds = [
    "Umu~",
    "Umu Umu"
];

const MoreResponses = [
    `${Icons.bubble}  Senko-san says you can have more _TIMELEFT_`,
    `${Icons.exclamation}  Senko-san tells you to drink more _TIMELEFT_`,
];

module.exports = {
    name: "drink",
    desc: "Have Senko-san prepare you a drink",
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
                    description: `${Icons.hojicha}  ${randomArray(Responses)}`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: "./src/Data/content/senko/drink.png", name: "image.png" }]
        };

        if (!config.cooldowns.daily - (Date.now() - RateLimits.Drink_Rate.Date) >= 0) {
            await updateUser(interaction.user, {
                RateLimits: {
                    Drink_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Drink_Rate.Amount = 0;
        }

        if (RateLimits.Drink_Rate.Amount >= 5) {
            MessageStruct.embeds[0].description = `**${randomArray(NoMore).replace("_USER_", interaction.user.username)}**\n\n${randomArray(MoreResponses).replace("_TIMELEFT_", `<t:${Math.floor(RateLimits.Drink_Rate.Date / 1000) + Math.floor(config.cooldowns.daily / 1000)}:R>`)}`;
            MessageStruct.files = [{ attachment: `./src/Data/content/senko/${randomBummedImageName()}.png`, name: "image.png" }];

            return interaction.followUp(MessageStruct);
        }

        RateLimits.Drink_Rate.Amount++;
        Stats.Drinks++;

        await updateUser(interaction.user, {
            Stats: { Drinks: Stats.Drinks },

            RateLimits: {
                Drink_Rate: {
                    Amount: RateLimits.Drink_Rate.Amount,
                    Date: Date.now()
                }
            }
        });

        if (RateLimits.Drink_Rate.Amount >= 5) MessageStruct.embeds[0].description += `\n\n— ${Icons.bubble}  Senko-san says this should be our last drink for today`;


        if (randomNumber(100) > 75) {
            addYen(interaction.user, 50);

            MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  50x added for interaction`;
        }

        MessageStruct.embeds[0].title = randomArray(Sounds);


        interaction.followUp(MessageStruct);
    }
};