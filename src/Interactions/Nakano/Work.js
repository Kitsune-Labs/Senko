const { MessageAttachment } = require("discord.js");
const { update } = require("../../API/v4/Fire");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const ms = require("ms");

module.exports = {
    name: "work",
    desc: "Provide yourself with 700 Yen by going to work",
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { Currency, Rewards}) => {
        const DestructibleItems = [
            {
                name: "air conditioner",
                price: 300,
                type: "replace"
            },
            {
                name: "refrigerator",
                price: 500,
                type: "repair"
            },
            {
                name: "rice cooker",
                price: 100,
                type: "replace"
            },
            {
                name: "TV",
                price: 500,
                type: "replace"
            },
            {
                name: "vacuum",
                price: 300,
                type: "repair"
            }
        ];

        const DestroyedItem = Math.floor(Math.random() * DestructibleItems.length);
        const Item = DestructibleItems[DestroyedItem];
        const RNG = Math.floor(Math.random() * 100);

        const Cooldown = config.cooldowns.daily;

        if (Cooldown - (Date.now() - Rewards.Work) >= 0) {
            const TimeLeft = ms(Cooldown - (Date.now() - Rewards.Work), { long: true });

            interaction.reply({
                embeds: [
                    {
                        title: `${Icons.exclamation}  Not going to happen.`,
                        description: `Come back in ${TimeLeft} if you want your next paycheck.`,
                        color: SenkoClient.colors.dark,
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                files: [new MessageAttachment("./src/Data/content/Yotsutani/Yotsutani.png", "image.png")],
                ephemeral: true
            });
        } else {
            if (RNG <= 25) {
                await update(interaction, {
                    Currency: { Yen: (3000 - Item.price) + Currency.Yen },
                    Rewards: { Work: Date.now() }
                });

                interaction.reply({
                    embeds: [
                        {
                            title: `${Icons.exclamation}  You arrived at your home and something happened.`,
                            description: `Senko told you ${Item.name} had broken. It cost you ${Icons.yen}  ${Item.price}x to ${Item.type}.\n\n— ${Icons.yen}  ${Item.price}x removed`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [ { attachment: "./src/Data/content/senko/heh.png", name: "image.png" } ]
                });
            } else {
                await update(interaction, {
                    Currency: { Yen: Currency.Yen + 700 },
                    Rewards: { Work: Date.now() }
                });

                interaction.reply({
                    embeds: [
                        {
                            title: `${Icons.yen}  Here is your check.`,
                            description: `I'll make sure to pay you again tomorrow.\n\n— ${Icons.yen} 700x added`,
                            color: SenkoClient.colors.light,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [new MessageAttachment("./src/Data/content/Yotsutani/Yotsutani.png", "image.png")]
                });
            }
        }
    }
};