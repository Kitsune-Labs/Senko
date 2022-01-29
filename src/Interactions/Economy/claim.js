const Icons = require("../../Data/Icons.json");
const { update } = require("../../API/v4/Fire");
const ms = require("ms");


module.exports = {
    name: "claim",
    desc: "Claim rewards from Senko",
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

        switch (Command) {
            case "daily":
                var DailyTimeStamp = AccountData.Rewards.Daily;
                var DailyCooldown = 86400000;

                if (DailyCooldown - (Date.now() - DailyTimeStamp) >= 0) {
                    const DailyTimeLeft = ms(DailyCooldown - (Date.now() - DailyTimeStamp), { long: true });

                    interaction.reply({
                        embeds: [
                            {
                                title: `${Icons.exclamation}  Sorry dear!`,
                                description: `You've already claimed your Yen! Come back in ${DailyTimeLeft}!`,
                                color: SenkoClient.colors.dark,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [ { attachment: "./src/Data/content/senko/huh.png", name: "image.png" } ],
                        ephemeral: true
                    });

                } else {
                    await update(interaction, {
                        Currency: { Yen: AccountData.Currency.Yen + 300 },
                        Rewards: { Daily: Date.now() }
                    });

                    interaction.reply({
                        embeds: [
                            {
                                title: `${Icons.heart}  Here you go dear!`,
                                description: `I have given you your yen for today. Spend it wisely and come back tomorrow!\n\n— ${Icons.yen} 300x added`,
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
                    const WeeklyTimeLeft = ms(WeeklyCooldown - (Date.now() - WeeklyTimeStamp), { long: true });

                    interaction.reply({
                        embeds: [
                            {
                                title: `${Icons.exclamation}  Sorry dear!`,
                                description: `You've already claimed your Yen! Come back in ${WeeklyTimeLeft}!`,
                                color: SenkoClient.colors.dark,
                                thumbnail: {
                                    url: "attachment://image.png"
                                }
                            }
                        ],
                        files: [ { attachment: "./src/Data/content/senko/huh.png", name: "image.png" } ],
                        ephemeral: true
                    });

                } else {
                    await update(interaction, {
                        Currency: { Yen: AccountData.Currency.Yen + 3000 },
                        Rewards: { Weekly: Date.now() }
                    });

                    interaction.reply({
                        embeds: [
                            {
                                title: `${Icons.heart}  Here you go dear!`,
                                description: `I have given you your yen for this week. Spend it wisely as it can only be used once a week!\n\n— ${Icons.yen} 3000x added`,
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
                interaction.reply({
                    embeds: [
                        {
                            title: "Hmmm.....",
                            description: "You have no items to claim!",
                            color: SenkoClient.colors.light,
                            thumbnail: {
                                url: "attachment://image.png",
                            }
                        }
                    ],
                    files: [ { attachment: "./src/Data/content/senko/senko_think.png", name: "image.png" } ],
                    ephemeral: true
                });
                break;
        }
    }
};