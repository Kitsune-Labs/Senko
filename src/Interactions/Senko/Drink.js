const { MessageAttachment } = require("discord.js");
const { eRes } = require("../../API/v4/InteractionFunctions");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const ms = require("ms");
const { updateUser } = require("../../API/Master");

const Reactions = {
    User: [
        "takes a sip",
        "has a drink",
        "drinks"
    ],

    Senko: [
        "Umu~", "Umu Umu"
    ],

    say: [
        "Don't drink too fast!",
        "Make sure to savor it",
        "*sip sip*"
    ]
};

module.exports = {
    name: "drink",
    desc: "Have a drink with Senko",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
        // if (Stats.Drinks >= 10) await awardAchievement(interaction.user, "NewDrinker");
        // if (Stats.Drinks >= 25) await awardAchievement(interaction.user, "AdeptDrinker");
        // if (Stats.Drinks >= 50) await awardAchievement(interaction.user, "MasterDrinker");

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

        if (RateLimits.Drink_Rate.Amount >= 5) return eRes({
            interaction: interaction,
            title: `${Icons.exclamation}  I don't think you should drink more.`,
            description: `If you drink any more Hojicha we'll have to spend more money. We can have some more in ${ms(config.cooldowns.daily - (Date.now() - RateLimits.Drink_Rate.Date), { long: true })}!`,
            footer: "We have a limit of 5 drinks today!"
        });

        RateLimits.Drink_Rate.Amount++;
        Stats.Drinks++;

        const Images = ["drink"];

        interaction.reply({
            embeds: [
                {
                    title: `${Icons.hojicha}  ${interaction.member.nickname || interaction.user.username} ${Reactions.User[Math.floor(Math.random() * Reactions.User.length)]}`,
                    description: `*${Reactions.Senko[Math.floor(Math.random() * Reactions.Senko.length)]}*\n\n${Reactions.say[Math.floor(Math.random() * Reactions.say.length)]}`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    },
                    footer: {
                        text: `You have ${Stats.Drinks} drinks.`
                    }
                }
            ],
            files: [ new MessageAttachment(`src/Data/content/senko/${Images[Math.floor(Math.random() * Images.length)]}.png`, "image.png") ]
        });

        await updateUser(interaction.user, {
            Stats: { Drinks: Stats.Drinks },

            RateLimits: {
                Drink_Rate: {
                    Amount: RateLimits.Drink_Rate.Amount,
                    Date: Date.now()
                }
            }
        });
    }
};