const { MessageAttachment } = require("discord.js");
const { eRes } = require("../../API/v4/InteractionFunctions");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const ms = require("ms");
const { updateUser } = require("../../API/Master");

const Reactions = {
    User: [
        "pats Senko's head",
        "pets Senko",
        "gives Senko a pat on her head",
        "ruffles through Senko's hair",
        "caresses Senko's ears",
        "touches Senko's ears"
    ],

    Senko: [
        "Uya...", "Umu~", "euH", "mhMh", "Uh-Uya!", "mmu", "Hnng"
    ],

    say: [
        "Please be more gentle with my ears dear, they're very precious!",
        "Don't be rough with my hair.",
        "Please remember to not put your fingers in my ears...!"
    ]
};

module.exports = {
    name: "pat",
    desc: "Pat Senko's Head (Don't touch her ears!)",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
        // if (Stats.Drinks >= 10) await awardAchievement(interaction.user, "NewPatter");
        // if (Stats.Drinks >= 50) await awardAchievement(interaction.user, "AdeptPatter");
        // if (Stats.Drinks >= 100) await awardAchievement(interaction.user, "MasterPatter");

        if (!config.cooldowns.daily - (Date.now() - RateLimits.Pat_Rate.Date) >= 0) {
            await updateUser(interaction.user, {
                RateLimits: {
                    Pat_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Pat_Rate.Amount = 0;
        }

        if (RateLimits.Pat_Rate.Amount >= 20) return eRes({
            interaction: interaction,
            title: `${Icons.exclamation}  Sorry dear...`,
            description: `I don't think I need any more pats today, come back in ${ms(config.cooldowns.daily - (Date.now() - RateLimits.Pat_Rate.Date), { long: true })}!`,
            footer: "The limit of patting me is 20 per day!"
        });

        RateLimits.Pat_Rate.Amount++;
        Stats.Pats++;

        const Images = ["Pat"];

        interaction.reply({
            embeds: [
                {
                    title: `${interaction.member.nickname || interaction.user.username} ${Reactions.User[Math.floor(Math.random() * Reactions.User.length)]}`,
                    description: `*${Reactions.Senko[Math.floor(Math.random() * Reactions.Senko.length)]}*\n\n${Reactions.say[Math.floor(Math.random() * Reactions.say.length)]}`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    },
                    footer: {
                        text: `You've pat me ${Stats.Pats} times.`
                    }
                }
            ],
            files: [new MessageAttachment(`src/Data/content/senko/${Images[Math.floor(Math.random() * Images.length)]}.png`, "image.png")]
        });

        await updateUser(interaction.user, {
            Stats: { Pats: Stats.Pats },

            RateLimits: {
                Pat_Rate: {
                    Amount: RateLimits.Pat_Rate.Amount,
                    Date: Date.now()
                }
            }
        });
    }
};