const { MessageAttachment } = require("discord.js");
const { eRes } = require("../../API/v4/InteractionFunctions");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const ms = require("ms");
const { updateUser } = require("../../API/Master");

const Reactions = {
    User: [
        "rest's on Senko's lap",
        "sleeps on Senko's lap",
        "Passes out while being pampered",
        "gets pampered by Senko's tail"
    ],

    Senko: [
        "mhMh mmm mmm!", "mmu"
    ],

    say: [
        "There there dear, you've had a stressful day today.",
        "Have sweet dreams dear.",
        `${Icons.ThinkCloud}  *I hope you sleep well...*`,
        "I'll continue to pamper you with my tail dear!"
    ]
};

module.exports = {
    name: "sleep",
    desc: "Sleep on Senko's lap",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
        if (!config.cooldowns.daily - (Date.now() - RateLimits.Sleep_Rate.Date) >= 0) {
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


        if (RateLimits.Sleep_Rate.Amount >= 1) return eRes({
            interaction: interaction,
            title: `${Icons.exclamation}  Sorry dear...`,
            description: `I don't you should sleep yet, try in ${ms(config.cooldowns.daily - (Date.now() - RateLimits.Sleep_Rate.Date), { long: true })}!`,
            footer: "You may only rest 1 time per day to not mess up your schedule!"
        });

        RateLimits.Sleep_Rate.Amount++;
        Stats.Sleeps++;

        const Images = ["SenkoSleep", "SleepingSenko"];

        interaction.reply({
            embeds: [
                {
                    title: `${Icons.zzz}  ${interaction.member.nickname || interaction.user.username} ${Reactions.User[Math.floor(Math.random() * Reactions.User.length)]}`,
                    description: `*${Reactions.Senko[Math.floor(Math.random() * Reactions.Senko.length)]}*\n\n${Reactions.say[Math.floor(Math.random() * Reactions.say.length)]}`,
                    thumbnail: {
                        url: "attachment://image.png"
                    },
                    footer: {
                        text: `You've slept ${Stats.Rests} times.`
                    },
                    color: SenkoClient.colors.dark
                }
            ],
            files: [new MessageAttachment(`src/Data/content/senko/${Images[Math.floor(Math.random() * Images.length)]}.png`, "image.png")]
        });

        await updateUser(interaction.user, {
            Stats: { Sleeps: Stats.Sleeps },

            RateLimits: {
                Sleep_Rate: {
                    Amount: RateLimits.Sleep_Rate.Amount,
                    Date: Date.now()
                }
            }
        });
    }
};