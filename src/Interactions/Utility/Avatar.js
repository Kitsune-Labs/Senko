// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
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
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        const User = interaction.options.getUser("user") || interaction.member;

        const reqOptions = {
            url: `https://discord.com/api/v9/users/${User.id}`,
            method: "GET",
            headers: {
                "User-Agent": process.env.AGENT,
                "Authorization": `Bot ${process.env.TOKEN}`
            },
        };

        const AvatarURL = User.user ? User.user.avatarURL({ dynamic: true, size: 2048 }) : User.avatarURL({ dynamic: true, size: 2048 });

        await axios.request(reqOptions).then(async (response) => {
            if (response.data.banner) {
                const ext = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

                interaction.reply({
                    embeds: [
                        {
                            title: "Avatar",
                            description: `[URL](${AvatarURL})`,
                            color: SenkoClient.colors.light,
                            image: {
                                url: AvatarURL
                            }
                        },
                        {
                            title: "Banner",
                            description: `[URL](https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048)`,
                            color: SenkoClient.colors.dark,
                            image: {
                                url: `https://cdn.discordapp.com/banners/${User.id}/${response.data.banner}${ext}?size=2048`
                            }
                        }
                    ]
                });
            } else {
                interaction.reply({
                    embeds: [
                        {
                            description: `[URL](${AvatarURL})`,
                            color: SenkoClient.colors.light,
                            image: {
                                url: AvatarURL
                            }
                        }
                    ]
                });
            }
        });
    }
};