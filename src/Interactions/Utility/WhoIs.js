// eslint-disable-next-line no-unused-vars
const { Client, Interaction, Message } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "whois",
    desc: "Public account information",
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
        const guildMember = await interaction.guild.members.fetch(interaction.options.getUser("user") || interaction.user);

        if (!guildMember) return interaction.followUp({ content: "I can't find this user", ephemeral: true });

        const guildUser = guildMember.user;
        const AvatarURL = guildUser.avatarURL({ dynamic: true, size: 2048 });

        /**
         * @type {Message}
         */
        const messageStruct = {
            embeds: [
                {
                    description: `${typeof guildMember.nickname === "string" ? `(${guildMember.user.tag})` : ""} ${guildUser} [${guildUser.id}]`,
                    color: SenkoClient.colors.random(),
                    fields: [
                        // { name: "Nickname", value: `${guildMember.nickname || "None"}`, inline: true },
                        // { name: "User", value: `${guildUser}\n${guildUser.tag}`, inline: true },
                        // { name: "ID", value: `${guildUser.id}`, inline: true },

                        // { name: "Avatar", value: "None", inline: true },
                        // { name: "Banner", value: "None", inline: true },
                        { name: "Bot", value: "False", inline: true },

                        { name: "Created", value: `<t:${parseInt(guildUser.createdTimestamp / 1000)}>\n\n(<t:${parseInt(guildUser.createdTimestamp / 1000)}:R>)`, inline: true },
                        { name: "Joined", value: `<t:${parseInt(guildMember.joinedTimestamp / 1000)}>\n\n(<t:${parseInt(guildMember.joinedTimestamp / 1000)}:R>)`, inline: true },
                        { name: "Boosted", value: `${guildMember.premiumSinceTimestamp ? `On <t:${parseInt(guildMember.premiumSinceTimestamp / 1000)}>\n\n(<t:${parseInt(guildMember.premiumSinceTimestamp / 1000)}:R>)` : "False"}`, inline: true },

                        { name: "Roles", value: `__${guildMember.roles.cache.size}__ roles` },
                    ],
                    thumbnail: {
                        url: null
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
                        { type: 2, label: "Avatar", style: 5, url: "https://discord.com/404", disabled: true },
                    ]
                }
            ]
        };

        if (AvatarURL) {
            messageStruct.embeds[0].thumbnail.url = AvatarURL;

            messageStruct.components[0].components[0].url = AvatarURL;
            messageStruct.components[0].components[0].disabled = false;
        }

        axios.request({
            url: `https://discord.com/api/v9/users/${guildUser.id}`,
            method: "GET",
            headers: {
                "User-Agent": process.env.AGENT,
                "Authorization": `Bot ${SenkoClient.token}`
            }
        }).then(async (response) => {
            if (response.data.banner) {
                const extension = await response.data.banner.startsWith("a_") ? ".gif" : ".png";
                messageStruct.embeds[0].image.url = `https://cdn.discordapp.com/banners/${guildUser.id}/${response.data.banner}${extension}?size=2048`;
                messageStruct.components[0].components.push({ type: 2, label: "Banner", style: 5, url: `https://cdn.discordapp.com/banners/${guildUser.id}/${response.data.banner}${extension}?size=2048` });
            }

            if (guildMember.roles.cache.size <= 30 && interaction.options.getBoolean("show-roles")) {
                if (guildMember.roles.cache.size === 1) {
                    messageStruct.embeds[0].fields[4].value = "None";
                } else {
                    messageStruct.embeds[0].fields[4].value = `${guildMember.roles.cache.map(u=>u).join(" ").replace("@everyone", "")}`;
                }
            }

            interaction.followUp(messageStruct);
        });
    }
};