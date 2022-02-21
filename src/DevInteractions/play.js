// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "play-dev",
    desc: "Discord intergrated Games",
    options: [
        {
            name: "sketch_heads",
            description: "Discord Intergrated Feature",
            type: 1
        },
        {
            name: "youtube",
            description: "Discord Intergrated Feature",
            type: 1
        }
    ],
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    start: async (SenkoClient, interaction) => {
        if (!interaction.member.voice.channel && !interaction.user.id === "609097445825052701") return interaction.reply({
            content: "You must be in a voice channel to use this command",
            ephemeral: true
        });

        const Command = interaction.options.getSubcommand();

        await interaction.deferReply({ fetchReply: true });
        // Sketch Heads = 902271654783242291
        // YT = 880218394199220334

        function createGame(gameId, response) {
            axios.request({
                url: `https://discord.com/api/v9/channels/${interaction.member.voice.channelId}/invites`,
                method: "POST",
                headers: {
                    "User-Agent": process.env.AGENT,
                    "Authorization": `Bot ${SenkoClient.token}`,
                    "Content-Type": "application/json"
                },
                data: {
                    "max_age": 86400,
                    "max_uses": 0,
                    "target_application_id": gameId,
                    "target_type": 2,
                    "temporary": false,
                    "validate": null
                }
            }).then(async (responseData) => {
                interaction.followUp({
                    content: `${response}\nClick the link to Join\n\n—> https://discord.com/invite/${responseData.data.code}`
                });
            });
        }

        switch (Command) {
            case "sketch_heads":
                createGame("902271654783242291", `${interaction.user} wants to play Sketch Heads together!`);
            break;

            case "youtube":
                createGame("880218394199220334", `${interaction.user} wants to watch YouTube with everyone!`);
            break;
        }
    }
};