const { MessageAttachment } = require("discord.js");
const Icons = require("../../Data/Icons.json");
const { update } = require("../../API/v4/Fire");
const ms = require("ms");

module.exports = {
    name: "weekly",
    desc: "Collect your weekly Yen from Senko",
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const TimeStamp = AccountData.Rewards.Weekly;

        const Cooldown = 604800000;

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
                            text: "pssst, check out \"/claim weekly\" next time!"
                        }
                    }
                ],
                files: [new MessageAttachment("./src/Data/content/senko/huh.png", "image.png")],
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
                        footer: {
                            text: "pssst, check out \"/claim weekly\" next time!"
                        },
                        thumbnail: {
                            url: "attachment://image.png"
                        }
                    }
                ],
                files: [new MessageAttachment("./src/Data/content/senko/happy.png", "image.png")],
            });
        }
    }
};