const Icons = require("../../Data/Icons.json");
const { updateUser } = require("../../API/Master");


module.exports = {
    name: "claim",
    desc: "Claim rewards from Senko",
    userData: true,
    options: [
        {
            name: "daily",
            description: "Claim your daily reward",
            type: 1,
        },
        {
            name: "weekly",
            description: "Claim your weekly reward",
            type: 1,
        },
        {
            name: "items",
            description: "Claim items Senko has given you",
            type: 1,
        },
    ],
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const Command = interaction.options.getSubcommand();
        await interaction.deferReply();

        switch (Command) {
            case "daily":
                var DailyTimeStamp = AccountData.Rewards.Daily;
                var DailyCooldown = 86400000;

                if (DailyCooldown - (Date.now() - DailyTimeStamp) >= 0) {
                    interaction.followUp({
                        embeds: [
                            {
                                title: `${Icons.exclamation}  Sorry dear!`,
                                description: `I've already given you your daily yen, come back to me <t:${Math.floor((DailyTimeStamp + DailyCooldown) / 1000)}:R>!`,
                                color: SenkoClient.colors.dark,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [ { attachment: "./src/Data/content/senko/heh.png", name: "image.png" } ],
                        ephemeral: true
                    });
                } else {
                    await updateUser(interaction.user, {
                        Currency: { Yen: AccountData.Currency.Yen + 200 },
                        Rewards: { Daily: Date.now() }
                    });

                    interaction.followUp({
                        embeds: [
                            {
                                title: `${Icons.heart}  Here you go dear!`,
                                description: `Spend it wisely and come back tomorrow!\n\n— ${Icons.yen} 200x added`,
                                color: SenkoClient.colors.light,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [ { attachment: "./src/Data/content/senko/happy.png", name: "image.png" } ]
                    });
                }
                break;
            case "weekly":
                var WeeklyTimeStamp = AccountData.Rewards.Weekly;
                var WeeklyCooldown = 604800000;

                if (WeeklyCooldown - (Date.now() - WeeklyTimeStamp) >= 0) {
                    interaction.followUp({
                        embeds: [
                            {
                                title: `${Icons.exclamation}  Sorry dear!`,
                                description: `From what I can remember i've given you your weekly yen, come back <t:${Math.floor((WeeklyTimeStamp + WeeklyCooldown) / 1000)}:R>!`,
                                color: SenkoClient.colors.dark,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [ { attachment: "./src/Data/content/senko/hat_think.png", name: "image.png" } ],
                        ephemeral: true
                    });

                } else {
                    await updateUser(interaction.user, {
                        Currency: { Yen: AccountData.Currency.Yen + 1400 },
                        Rewards: { Weekly: Date.now() }
                    });

                    interaction.followUp({
                        embeds: [
                            {
                                title: `${Icons.heart}  It's that time again!`,
                                description: `Here is your Yen for this week; Now spend it wisely!\n\n— ${Icons.yen} 1400x added`,
                                color: SenkoClient.colors.light,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [ { attachment: "./src/Data/content/senko/happy.png", name: "image.png" } ]
                    });
                }
                break;
            case "items":
                interaction.followUp({
                    embeds: [
                        {
                            title: "Hmmm.....",
                            description: "I've scourged around and couldn't find anything!",
                            color: SenkoClient.colors.light,
                            thumbnail: {
                                url: "attachment://image.png",
                            }
                        }
                    ],
                    files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }]
                });
                break;
        }
    }
};