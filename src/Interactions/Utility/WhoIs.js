// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "whois",
    desc: "User information",
    options: [
        {
            name: "user",
            description: "User",
            type: 6,
            required: false
        }
    ],
    /**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, AccountData) => {
        const guildMember = await interaction.guild.members.fetch(interaction.options.getUser("user") || interaction.user);
        const guildUser = guildMember.user;

        const messageStructure = {
            embeds: [
                {
                    color: SenkoClient.colors.random(),
                    fields: [
                        { name: "Nickname", value: `${guildMember.nickname || "None"}`, inline: true },
                        { name: "User", value: `${guildUser}\n${guildUser.tag}`, inline: true },
                        { name: "ID", value: `${guildUser.id}`, inline: true },

                        { name: "Avatar", value: "None", inline: true },
                        { name: "Banner", value: "None", inline: true },
                        { name: "Bot", value: "False", inline: true },

                        { name: "Created", value: `<t:${parseInt(guildUser.createdTimestamp / 1000)}:R>`, inline: true },
                        { name: "Joined", value: `<t:${parseInt(guildMember.joinedTimestamp / 1000)}:R>`, inline: true },
                        { name: "Boosted", value: `${guildMember.premiumSinceTimestamp ? `Since <t:${parseInt(guildMember.premiumSinceTimestamp / 1000)}:R>` : "False"}`, inline: true },

                        { name: "Roles", value: `__${guildMember.roles.cache.size}__ roles` },
                    ],
                    thumbnail: {
                        url: null
                    },
                    image: {
                        url: null
                    }
                }
            ]
        };


        axios.request({
            url: `https://discord.com/api/v9/users/${guildUser.id}`,
            method: "GET",
            headers: {
                "User-Agent": process.env.AGENT,
                "Authorization": `Bot ${SenkoClient.token}`
            }
        }).then(async (response) => {
            const avatarUrl = guildUser.displayAvatarURL({ dynamic: true, size: 2048 });
            const messageStructureEmbed = messageStructure.embeds[0];

            messageStructureEmbed.fields[3].value = `[URL](${avatarUrl})`;
            messageStructureEmbed.thumbnail.url = avatarUrl;

            if (response.data.banner) {
                const extension = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

                messageStructureEmbed.fields[4].value = `[URL](https://cdn.discordapp.com/banners/${guildUser.id}/${response.data.banner}${extension})`;
                messageStructureEmbed.image.url = `https://cdn.discordapp.com/banners/${guildUser.id}/${response.data.banner}${extension}?size=2048`;
            }

            if (guildMember.roles.cache.size <= 30) {
                if (guildMember.roles.cache.size === 1) {
                    messageStructureEmbed.fields[9].value = "None";
                } else {
                    messageStructureEmbed.fields[9].value = `${guildMember.roles.cache.map(u=>u).join(" ").replace("@everyone", "")}`;
                }
            }

            interaction.reply(messageStructure);
        });
    }
};