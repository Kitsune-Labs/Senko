// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client, Message } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "avatar",
    desc: "View someone's avatar, and banner if they have one",
    options: [
        {
            name: "user",
            description: "User",
            type: 6,
            required: false
        },
    ],
    defer: true,
    /**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        const User = interaction.options.getUser("user") || interaction.member;
        const AvatarURL = User.user ? User.user.avatarURL({ dynamic: true, size: 2048 }) : User.avatarURL({ dynamic: true, size: 2048 });

        /**
         * @type {Message}
         */
        const messageStruct = {
            embeds: [
                {
                    title: "Avatar",
                    color: SenkoClient.colors.light,
                    image: {
                        url: AvatarURL
                    }
                }
            ],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        { type: 2, label: "Avatar", style: 5, url: AvatarURL },
                        // { type: 2, label: "Banner", style: 5, url: AvatarURL }
                    ]
                }
            ]
        };


        await axios.request({
            url: `https://discord.com/api/v9/users/${User.id}`,
            method: "GET",
            headers: {
                "User-Agent": process.env.AGENT,
                "Authorization": `Bot ${SenkoClient.token}`
            },
        }).then(async (response) => {
            if (response.data.banner) {
                const ext = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

                messageStruct.embeds.push({
                    title: "Banner",
                    color: SenkoClient.colors.dark,
                    image: {
                        url: `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`
                    }
                });

                messageStruct.components[0].components.push({ type: 2, label: "Banner", style: 5, url: `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048` });
            }

            interaction.followUp(messageStruct);
        });
    }
};