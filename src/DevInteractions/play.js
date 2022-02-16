// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "play",
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
        if (!interaction.member.voice.channel) return interaction.reply({
            content: "You must be in a voice channel to use this command",
            ephemeral: true
        });

        const Command = interaction.options.getSubcommand();
        await interaction.deferReply({ fetchReply: true });
        // Sketch Heads = 902271654783242291
        // YT = 880218394199220334

        switch (Command) {
            case "sketch_heads":
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
                        "target_application_id": "902271654783242291",
                        "target_type": 2,
                        "temporary": false,
                        "validate": null
                    }
                }).then(async (response) => {
                    interaction.followUp({
                        content: `${interaction.user} wants to play Sketch Heads together!\nClick the link to Join\n\n—> https://discord.com/invite/${response.data.code}`
                    });
                });
            break;

            case "youtube":
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
                        "target_application_id": "880218394199220334",
                        "target_type": 2,
                        "temporary": false,
                        "validate": null
                    }
                }).then(async (response) => {
                    interaction.followUp({
                        content: `${interaction.user} wants to watch YouTube together!\nClick the link to Join\n\n—> https://discord.com/invite/${response.data.code}`
                    });
                });
            break;
        }
    }
};