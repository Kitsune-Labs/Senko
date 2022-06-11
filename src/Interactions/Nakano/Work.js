const { MessageAttachment } = require("discord.js");
const config = require("../../Data/DataConfig.json");
const Icons = require("../../Data/Icons.json");
const { updateUser } = require("../../API/Master");
const { randomArrayItem } = require("@kitsune-laboratories/utilities");

module.exports = {
    name: "work",
    desc: "Have Nakano go to work to provide income",
    userData: true,
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
            interaction.reply({
                embeds: [
                    {
                        title: `${Icons.exclamation}  Not going to happen.`,
                        description: `Come back <t:${Math.floor((Rewards.Work + Cooldown) / 1000)}:R> if you want your next paycheck.`,
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
            if (RNG <= 30) {
                await updateUser(interaction.user, {
                    Currency: { Yen: (700 - Item.price) + Currency.Yen },
                    Rewards: { Work: Date.now() }
                });

                interaction.reply({
                    embeds: [
                        {
                            title: `${Icons.exclamation}  You arrived at your home and something happened.`,
                            description: `Senko told you ${Item.name} had broken. It cost you ${Icons.yen}  ${Item.price}x to ${Item.type}.\n\n— ${Icons.yen}  ${700 - Item.price}x added`,
                            color: SenkoClient.colors.dark,
                            thumbnail: {
                                url: "attachment://image.png"
                            }
                        }
                    ],
                    files: [{ attachment: `./src/Data/content/senko/${randomArrayItem(["heh", "heh2", "judgement", "upset"])}.png`, name: "image.png" }]
                });
            } else {
                await updateUser(interaction.user, {
                    Currency: { Yen: Currency.Yen + 500 },
                    Rewards: { Work: Date.now() }
                });

                interaction.reply({
                    embeds: [
                        {
                            title: `${Icons.yen}  Here is your check.`,
                            description: `I'll make sure to pay you again tomorrow.\n\n— ${Icons.yen} 500x added`,
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