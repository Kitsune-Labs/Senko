/* eslint-disable */

const { CommandInteraction } = require("discord.js");
const Icons = require("../Data/Icons.json");
const { print } = require("../API/dev/functions.js");
const { awardAchievement } = require("../API/v5/Achievement.js");

module.exports = {
    name: `locale`,
    desc: `Tests localization`,
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const Text = require(`../Data/Locales/${interaction.guildLocale}.json`) || require(`../Data/Locales/en-US.json`);

        interaction.reply({
            content: Text.test.response,
        });
    }
};