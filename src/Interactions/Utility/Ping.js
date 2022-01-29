// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const ms = require("ms");

module.exports = {
    name: "ping",
    desc: "Pong! View Senko's latency",
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        interaction.reply({
            embeds: [
                {
                    description: `Websocket: ${ms(SenkoClient.ws.ping, { long: true })}`,
                    color: SenkoClient.colors.random()
                }
            ],
            ephemeral: true
        });
    }
};