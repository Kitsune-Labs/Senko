// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const { updateGuild } = require("../API/Master");
const Icons = require("../Data/Icons.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async (interaction) => {
            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "confirm_channel_removal":
                        await updateGuild(interaction.guildId, {
                            Channels: []
                        });

                        interaction.update({
                            embeds: [
                                {
                                    title: `${Icons.exclamation}  Alright dear`,
                                    description: "All of the channels have been removed",
                                    color: SenkoClient.colors.light,
                                    image: {
                                        url: "attachment://image.png"
                                    }
                                }
                            ]
                        });
                        break;
                }
            }
        });
    }
};