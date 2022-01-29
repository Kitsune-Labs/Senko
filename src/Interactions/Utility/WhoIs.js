const { CommandInteraction } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "whois",
    desc: "View info about a user",
    options: [
        {
            name: "user",
            description: "User",
            type: 6,
            required: false
        }
    ],
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        /**
         * @type {GuildMember} Member
         */
        let Member = interaction.options.getUser("user") || interaction.member;

        if(!Member) return interaction.reply({ content: "I can't find this user.", ephemeral: true });

        if (!Member.user) Member = interaction.guild.members.cache.get(Member.id);

        const reqOptions = {
            url: `https://discord.com/api/v9/users/${Member.id}`,
            method: "GET",
            headers: {
                "User-Agent": process.env.AGENT,
                "Authorization": `Bot ${process.env.TOKEN}`
            },
        };

        const AvatarURL = Member.user ? Member.user.avatarURL({ dynamic: true, size: 2048 }) : Member.avatarURL({ dynamic: true, size: 2048 });

        axios.request(reqOptions).then(async (response) => {
            let MemberRoles = Member.roles;

            if (MemberRoles.cache.size <= 10) {
                if (MemberRoles.cache.size === 1) {
                    MemberRoles = "No Roles";
                } else {
                    MemberRoles = MemberRoles.cache.map(u=>u).join(" ").replace("@everyone", "");
                }
            } else {
                MemberRoles = `**${MemberRoles.cache.size}** Roles`;
            }

            if (response.data.banner) {
                const ext = await response.data.banner.startsWith("a_") ? ".gif" : ".png";

                interaction.reply({
                    embeds: [
                        {
                            color: response.data.banner_color || SenkoClient.colors.random(),
                            fields: [
                                { name: "Nickname", value: `${Member.nickname || "None"}`, inline: true },
                                { name: "User", value: `${Member}\n${Member.user.tag}`, inline: true },
                                { name: "ID", value: `${Member.id}`, inline: true },
                                { name: "Avatar", value: `[Avatar Link](${AvatarURL})`, inline: true },
                                { name: "Banner", value: `[Banner Link](https://cdn.discordapp.com/banners/${Member.id}/${response.data.banner}${ext})`, inline: true },
                                { name: "Bot", value: `${Member.user.bot ? "True" : "False"}`, inline: true },
                                { name: "Created", value: `<t:${parseInt(Member.user.createdTimestamp / 1000)}:R>`, inline: true },
                                { name: "Joined", value: `<t:${parseInt(Member.joinedTimestamp / 1000)}:R>`, inline: true },
                                { name: "Booster", value: `${Member.premiumSinceTimestamp ? `Since <t:${parseInt(Member.premiumSinceTimestamp / 1000)}:R>` : "False"}`, inline: true },
                                // { name: "Bannable", value: `${Member.bannable}`, inline: true },
                                // { name: "Kickable", value: `${Member.kickable}`, inline: true },
                                // { name: "Manageable", value: `${Member.manageable}`, inline: true },
                                { name: "Roles", value: `${MemberRoles}` },
                            ],

                            thumbnail: {
                                url: AvatarURL
                            },
                            image: {
                                url: `https://cdn.discordapp.com/banners/${Member.id}/${response.data.banner}${ext}?size=2048`
                            }
                        }
                    ]
                });
            } else {
                interaction.reply({
                    embeds: [
                        {
                            color: response.data.banner_color || SenkoClient.colors.random(),
                            fields: [
                                { name: "Nickname", value: `${Member.nickname || "None"}`, inline: true },
                                { name: "Username", value: `${Member.user.username}`, inline: true },
                                { name: "Discriminator", value: `#${Member.user.discriminator}`, inline: true },
                                { name: "ID", value: `${Member.id}`, inline: true },
                                { name: "Avatar", value: `[Avatar Link](${AvatarURL})`, inline: true },
                                { name: "Banner", value: "No Banner", inline: true },
                                { name: "Bot", value: `${Member.user.bot ? "True" : "False"}`, inline: true },
                                { name: "Created", value: `<t:${parseInt(Member.user.createdTimestamp / 1000)}:R>`, inline: true },
                                { name: "Joined", value: `<t:${parseInt(Member.joinedTimestamp / 1000)}:R>`, inline: true },
                                { name: "Booster", value: `${Member.premiumSinceTimestamp ? `Since <t:${parseInt(Member.premiumSinceTimestamp / 1000)}:R>` : "False"}`, inline: true },
                                // { name: "Bannable", value: `${Member.bannable}`, inline: true },
                                // { name: "Kickable", value: `${Member.kickable}`, inline: true },
                                // { name: "Manageable", value: `${Member.manageable}`, inline: true },
                                { name: "Roles", value: `${MemberRoles}` },
                            ],

                            thumbnail: {
                                url: AvatarURL
                            }
                        }
                    ]
                });
            }
        });
    }
};
