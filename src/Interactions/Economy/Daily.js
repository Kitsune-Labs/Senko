const Icons = require("../../Data/Icons.json");
const { update } = require("../../API/v4/Fire");
const ms = require("ms");

module.exports = {
    name: "daily",
    desc: "Collect your daily Yen from Senko",
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const TimeStamp = AccountData.Rewards.Daily;
        const Cooldown = 86400000;

        if (Cooldown - (Date.now() - TimeStamp) >= 0) {
            const TimeLeft = ms(Cooldown - (Date.now() - TimeStamp), { long: true });

            interaction.reply({
                embeds: [
                    {
                        title: `${Icons.exclamation}  Sorry dear!`,
                        description: `You've already claimed your Yen! Come back in ${TimeLeft}!`,
                        color: SenkoClient.colors.dark,
                        thumbnail: {
                            url: "attachment://image.png"
                        },
                        footer: {
                            text: "pssst, check out \"/claim daily\" next time!"
                        }
                    }
                ],
                files: [ { attachment: "./src/Data/content/senko/huh.png", name: "image.png" }],
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
                        footer: {
                            text: "pssst, check out \"/claim daily\" next time!"
                        },
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                files: [ { attachment: "./src/Data/content/senko/happy.png", name: "image.png" }],
            });
        }
    }
};