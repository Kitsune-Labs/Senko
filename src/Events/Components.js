// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const { updateSuperGuild } = require("../API/super");
const Icons = require("../Data/Icons.json");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async (interaction) => {
            if (interaction.isButton()) {
                switch (interaction.customId) {
                    case "confirm_super_channel_removal":
                        await updateSuperGuild(interaction.guild, {
                            Channels: []
                        });

                        interaction.update({
                            embeds: [
                                {
                                    title: `${Icons.exclamation}  Alright dear`,
                                    description: "All of the channels have been removed",
                                    color: SenkoClient.colors.light,
                                    thumbnail: {
                                        url: "attachment://image.png"
                                    }
                                }
                            ],
                            components: []
                        });
                        break;
                }
            }
        });
    }
};