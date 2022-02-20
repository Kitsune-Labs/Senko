const Icons = require("../../Data/Icons.json");
const { addYen, updateUser } = require("../../API/Master");
const { eRes } = require("../../API/v4/InteractionFunctions");
const config = require("../../Data/DataConfig.json");
const ms = require("ms");

module.exports = {
    name: "eat",
    desc: "nom nom nom",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { RateLimits }) => {
        if (!config.cooldowns.daily - (Date.now() - RateLimits.Eat_Rate.Date) >= 0) {
            await updateUser(interaction.user, {
                RateLimits: {
                    Eat_Rate: {
                        Amount: 0,
                        Date: Date.now()
                    }
                }
            });

            RateLimits.Eat_Rate.Amount = 0;
        }

        if (RateLimits.Eat_Rate.Amount >= 5) return eRes({
            interaction: interaction,
            title: `${Icons.exclamation}  I don't think you should eat anything else`,
            description: `You'll gain weight if you do! I'll cook more in ${ms(config.cooldowns.daily - (Date.now() - RateLimits.Drink_Rate.Date), { long: true })}!`,
            footer: "You can only eat 5 times today!"
        });

        await addYen(interaction.user, 10);

        interaction.reply({
            embeds: [
                {
                    title: "Umu Umu",
                    description: `You have something to eat with Senko\n\n— ${Icons.yen}  10x added`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [ { attachment: "./src/Data/content/senko/SenkoEat.png", name: "image.png" } ]
        });
    }
};