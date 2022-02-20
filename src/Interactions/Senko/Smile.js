// eslint-disable-next-line no-unused-vars
const { CommandInteraction, MessageAttachment } = require("discord.js");
const { eRes } = require("../../API/v4/InteractionFunctions");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const ms = require("ms");
const { updateUser } = require("../../API/Master");

const Reactions = {
    User: [
        "smiles at Senko",
        "smiles"
    ],

    Senko: [
        "Umu~"
    ],

    say: []
};

module.exports = {
    name: "smile",
    desc: ":)",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
        if (!config.cooldowns.daily - (Date.now() - RateLimits.Smile_Rate.Date) >= 0) {
            await updateUser(interaction.user, {
                RateLimits: {
                    Smile_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Smile_Rate.Amount = 0;
        }

        if (RateLimits.Smile_Rate.Amount >= 20) return eRes({
            interaction: interaction,
            title: `${Icons.zzz}  It looks like Senko is sleeping`,
            description: `You shouldn't wake her, come back in ${ms(config.cooldowns.daily - (Date.now() - RateLimits.Smile_Rate.Date), { long: true })}!`,
            footer: "20 smiles/day!",
            thumbnailPath: "senko/sleeping.png"
        });

        RateLimits.Smile_Rate.Amount++;
        Stats.Smiles++;

        const Images = ["smile", "happy"];

        interaction.reply({
            embeds: [
                {
                    title: `${interaction.member.nickname || interaction.user.username} ${Reactions.User[Math.floor(Math.random() * Reactions.User.length)]}`,
                    description: `*${Reactions.Senko[Math.floor(Math.random() * Reactions.Senko.length)]}*`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    },
                    footer: {
                        text: `We've smiled ${Stats.Smiles} times.`
                    }
                }
            ],
            files: [new MessageAttachment(`src/Data/content/senko/${Images[Math.floor(Math.random() * Images.length)]}.png`, "image.png")]
        });

        updateUser(interaction.user, {
            Stats: { Smiles: Stats.Smiles },

            RateLimits: {
                Smile_Rate: {
                    Amount: RateLimits.Smile_Rate.Amount,
                    Date: Date.now()
                }
            }
        });
    }
};