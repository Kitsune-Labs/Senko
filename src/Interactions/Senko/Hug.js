const { MessageAttachment } = require("discord.js");
const { eRes } = require("../../API/v4/InteractionFunctions");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const ms = require("ms");
const randomFile = require("../../API/modules/image");
const { fetchData, updateUser } = require("../../API/Master");

module.exports = {
    name: "hug",
    desc: "Hug Senko!",
    options: [
        {
            name: "user",
            description: "Hug someone",
            type: "USER",
        }
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        const OptionalUser = interaction.options.getUser("user");

        if (OptionalUser) {
            randomFile("./src/Data/content/hug", (err, file) => {
                const Messages = [
                    `${interaction.user} hugs ${OptionalUser}!`,
                    `${OptionalUser} has been hugged by ${interaction.user}!`,
                ];

                interaction.reply({
                    embeds: [
                        {
                            description: `${Messages[Math.floor(Math.random() * Messages.length)]}`,
                            image: {
                                url: `attachment://${file.endsWith(".png") ? "image.png" : "image.gif"}`
                            },
                            color: SenkoClient.colors.light
                        }
                    ],
                    files: [ { attachment: `./src/Data/content/hug/${file}`, name: file.endsWith(".png") ? "image.png" : "image.gif" } ]
                });
            });

            return;
        }

        const { RateLimits, Stats } = await fetchData(interaction.user);

        if (!config.cooldowns.daily - (Date.now() - RateLimits.Hug_Rate.Date) >= 0) {
            await updateUser(interaction.user, {
                RateLimits: {
                    Hug_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Hug_Rate.Amount = 0;
        }

        if (RateLimits.Hug_Rate.Amount >= 20) {
            const TimeLeft = ms(config.cooldowns.daily - (Date.now() - RateLimits.Hug_Rate.Date), { long: true });

            return eRes({
                interaction: interaction,
                title: `${Icons.exclamation}  Sorry!`,
                description: `I've already given you 20 hugs, i'll give you more in ${TimeLeft}`
            });
        }

        RateLimits.Hug_Rate.Amount++;
        Stats.Hugs++;

        const Images = ["happy"];

        interaction.reply({
            embeds: [
                {
                    title: `${interaction.member.nickname || interaction.user.username} hugs Senko`,
                    description: `You've hugged me ${Stats.Hugs} times`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [new MessageAttachment(`src/Data/content/senko/${Images[Math.floor(Math.random() * Images.length)]}.png`, "image.png")]
        });

        await updateUser(interaction.user, {
            Stats: { Hugs: Stats.Hugs },

            RateLimits: {
                Hug_Rate: {
                    Amount: RateLimits.Hug_Rate.Amount,
                    Date: Date.now()
                }
            }
        });
    }
};