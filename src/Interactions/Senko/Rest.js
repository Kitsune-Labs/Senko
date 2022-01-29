const { MessageAttachment } = require("discord.js");
const { eRes } = require("../../API/v4/InteractionFunctions");
const { update } = require("../../API/v4/Fire");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const ms = require("ms");

const Reactions = {
    User: [
        "rest's on Senko's lap",
        "is being pampered by Senko"
    ],

    Senko: [
        "Umu~", "Umu Umu"
    ],

    say: [
        "It's alright dear, i'm here for you...",
        "Relax dear, don't stress yourself too much.",
        "Rest now, you'll need your energy tomorrow."
    ]
};

module.exports = {
    name: "rest",
    desc: "Rest on Senkos lap",
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
        if (!config.cooldowns.daily - (Date.now() - RateLimits.Rest_Rate.Date) >= 0) {
            await update(interaction, {
                RateLimits: {
                    Rest_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Rest_Rate.Amount = 0;
        }

        if (RateLimits.Rest_Rate.Amount >= 5) return eRes({
            interaction: interaction,
            title: `${Icons.zzz}`,
            description: `I don't think you should rest anymore for today, I'll give you more in ${ms(config.cooldowns.daily - (Date.now() - RateLimits.Rest_Rate.Date), { long: true })}!`,
            footer: "Lets just stick to 5 today..."
        });

        RateLimits.Rest_Rate.Amount++;
        Stats.Rests++;

        const Images = ["cuddle"];

        interaction.reply({
            embeds: [
                {
                    title: `${interaction.member.nickname || interaction.user.username} ${Reactions.User[Math.floor(Math.random() * Reactions.User.length)]}`,
                    description: `*${Reactions.Senko[Math.floor(Math.random() * Reactions.Senko.length)]}*\n\n${Reactions.say[Math.floor(Math.random() * Reactions.say.length)]}`,
                    thumbnail: {
                        url: "attachment://image.png"
                    },
                    footer: {
                        text: `You've rested ${Stats.Rests} times.`
                    },
                    color: SenkoClient.colors.light
                }
            ],
            files: [new MessageAttachment(`src/Data/content/senko/${Images[Math.floor(Math.random() * Images.length)]}.png`, "image.png")]
        });

        await update(interaction, {
            Stats: { Rests: Stats.Rests },

            RateLimits: {
                Rest_Rate: {
                    Amount: RateLimits.Rest_Rate.Amount,
                    Date: Date.now()
                }
            }
        });
    }
};