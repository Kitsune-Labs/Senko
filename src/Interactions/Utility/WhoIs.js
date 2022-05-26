// eslint-disable-next-line no-unused-vars
const { Client, Interaction, Message } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "whois",
    desc: "Account information",
    options: [
        {
            name: "user",
            description: "User",
            type: 6,
            required: false
        },
        {
            name: "show-roles",
            description: "Shows the roles the member has",
            type: "BOOLEAN",
            default: false
        }
    ],
    defer: true,
    usableAnywhere: true,
    /**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const guildMember = await interaction.options.getMember("user") || interaction.member;
        if (!guildMember) return interaction.followUp({ content: "I can't find this user", ephemeral: true });

        const guildUser = guildMember.user;
        const AvatarURL = guildUser.avatarURL({ dynamic: true, size: 2048 });

        /**
         * @type {Message}
         */
        const messageStruct = {
            embeds: [
                {
                    description: `${guildMember.nickname != null ? `(${guildMember.user.tag})` : ""} ${guildUser} [${guildUser.id}]\n\nBot: ${guildUser.bot ? "**Yes**" : "**No**"}\nBooster: ${guildMember.premiumSinceTimestamp ? `**Yes**, Since <t:${Math.ceil(guildMember.premiumSinceTimestamp / 1000)}>` : "**No**"}\nCreation Date: <t:${parseInt(guildUser.createdTimestamp / 1000)}>\nJoined Guild: <t:${parseInt(guildMember.joinedTimestamp / 1000)}>`,
                    color: SenkoClient.colors.random(),
                    fields: [
                        { name: "Roles", value: `${guildMember.roles.cache.size === 1 ? "No Roles" : interaction.options.getBoolean("show-roles") ? `${guildMember.roles.cache.map(u=>u).join(" ").replace("@everyone", "")}` : `**${guildMember.roles.cache.size - 1}** roles`}`},
                    ],
                    thumbnail: {
                        url: AvatarURL ? AvatarURL : null
                    },
                    image: {
                        url: null
                    }
                }
            ],
            components: [
                {
                    type: "ACTION_ROW",
                    components: [
                        { type: 2, label: "Avatar", style: 5, url: AvatarURL ? AvatarURL : "https://discord.com/404", disabled: AvatarURL ? false : true },
                        { type: 2, label: "Banner", style: 5, url: "https://discord.com/404", disabled: true }
                    ]
                }
            ]
        };

        axios({
            url: `https://discord.com/api/users/${guildUser.id}`,
            method: "GET",
            headers: {
                "User-Agent": SenkoClient.tools.UserAgent,
                "Authorization": `Bot ${SenkoClient.token}`
            }
        }).then(async (response) => {
            if (response.data.banner) {
                const extension = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

                messageStruct.embeds[0].image.url = `https://cdn.discordapp.com/banners/${guildUser.id}/${response.data.banner}${extension}?size=2048`;
                messageStruct.components[0].components[1].disabled = false;
                messageStruct.components[0].components[1].url = `https://cdn.discordapp.com/banners/${guildUser.id}/${response.data.banner}${extension}?size=2048`;
            }

            interaction.followUp(messageStruct);
        });
    }
};