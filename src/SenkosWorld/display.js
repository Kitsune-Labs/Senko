// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { MessageActionRow, MessageButton } = require("discord.js");
const Icons = require("../Data/Icons.json");

module.exports = {
    name: "display",
    desc: "for use by developers",
    SenkosWorld: true,
    options: [
        {
            name: "rules",
            description: "rules",
            type: 1
        },
        {
            name: "pds",
            description: "pds",
            type: 1
        },
        {
            name: "verify",
            description: "verify",
            type: 1
        },
        {
            name: "k_index",
            description: "k_index",
            type: 1
        },
        {
            name: "roles",
            description: "roles",
            type: 1
        },
        {
            name: "faq",
            description: "faq",
            type: 1
        },
        {
            name: "mc_server",
            description: "mc_server",
            type: 1
        }
    ],
    permissions: "0",
    /**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction) => {
        if (interaction.user.id !== "609097445825052701") return interaction.reply({ content: "🗿", ephemeral: true });
        const Command = interaction.options.getSubcommand();
        await interaction.deferReply({ ephemeral: true });

        switch (Command) {
            case "rules":
                interaction.followUp({ content: "Finished", ephemeral: true });

                interaction.channel.send({
                    embeds: [
                        {
                            image: {
                                url: "https://media.discordapp.net/attachments/956732513261334568/960222673613496400/Senkos_World_Welcome_Banner.png"
                            },
                            color: SenkoClient.colors.dark
                        },
                        {
                            title: "🎉   Thanks for joining!",
                            description: "Listed below are rules that are a **baseline** (aka everything does **not** have to be listed)\n\nLets get started!",
                            color: SenkoClient.colors.light
                        },
                        {
                            color: "BLURPLE",
                            title: `${Icons.check}  Follow Discord's ToS`,
                            description: "You can find them here —> https://discord.com/terms\n\nBreaking these will result in an immediate and permanent outlaw (ban) from Senko's World!"
                        },
                        {
                            color: SenkoClient.colors.dark_red,
                            title: "⚠️   Sensitive Topics & Respecting others",
                            description: "__**You will not :**__\n\nHarass members\nExpress your hatred to a particular group of people\nExpress the belief that certain races of people are superior to others\nExpress the belief that certain genders are superior to others"
                        },
                        {
                            color: SenkoClient.colors.light_red,
                            title: "🔞  18+/Suggestive Content",
                            description: "__**You will not :**__\n\nSend any type of pornographic content\nSend any type of *real* Gore or anything related\nIt should be obvious that any character lewd counts and is instant outlaw from the server and from <@777676015887319050>, forever, no appeals"
                        },
                        {
                            color: SenkoClient.colors.dark_red,
                            title: "⛔  Problematic content or media",
                            description: "__**You will not :**__\n\nSend any type of media that could induce epilepsy or seizures, any type of war group related content, or social credit \"memes\"\n\nTalk about any non-fictional politics\nDisplay affection twoards Drug & Alcohol related things"
                        },
                        {
                            color: SenkoClient.colors.light_red,
                            title: "ℹ️  Misc",
                            description: "Do not bypass the filter for malicious reasons, if you really wish to send that message use `/filter`\n\nOutlaw (Ban) Appeals can be found here:\nhttps://senkosworld.com/appeal"
                        }
                    ],
                    components: [
                        {
                            type: 1,
                            components: [
                                { type: 2, label: "I agree to these rules", style: 3, custom_id: "4D35DE24-2FE2-41A7-B86F-966284E6B10C" }
                            ]
                        }
                    ]
                });
            break;
            case "pds":
                interaction.channel.send({
                    embeds: [
                        {
                            title: "The Progressive Discipline System",
                            description: "Certain rules don't make it an instant blacklist.\nWe will provide examples and how to moderate in Senko's World! properly.\n\n\n\"Blacklist\" is another way of saying \"Ban\" or \"Banned\"\n\n\"Timeout\" is using Discord's built-in Timeout feature (/timeout on Yozora) or the \"mute\" command\n\nThere is a banlink with the __Kitsune Softworks__ Discord server, banning a member from either server will affect the other server.\n\n\"PTS\" is the \"Progressive Discipline System\"\n\nSome things may be repeated purposefully in this",
                            color: 55039
                        },
                        {
                            title: "☠️ Blacklist's",
                            description: "__Things that should be an instant permanent blacklist include__\n\n— Racial slurs\n— NSFW Media\n— Malovelent URL's\n— Breaking Discord's TOS\n— Nazism\n— Sensitive Information\n— Spreading harmful/false information\n— Harassment, hate speech, racism, sexism\n— Threats to another user\nExamples: \"I will execute you\", \"I will burn every furry alive with a flamethrower\", etc\n— Piracy and/or illegal content (Drugs and alcohol included)\n— Joined just to troll\n— __Passed PTS limit on 1 kick__\n\n\n__Things that don't count as an instant blacklist__\n\n— Ecchi content should be a warn or mute depending on the severity\n— References to Inappropriate content which can include: Messages, Media, and Nicknames",
                            color: 13960453
                        },
                        {
                            title: "👢 Kicks",
                            description: "__Things that can have the member be kicked can include__\n\n— N-word baiting\n— Spreading harmful/false information\n— Harassment, hate speech, racism, sexism\n— Threats to another user\nExamples: \"I will execute you\", \"I will burn every furry alive with a flamethrower\", etc\n— illegal content related to Drugs and Alcohol included\n— Anything that can crash, restart or exploit the Discord client\n— __Passed PTS limit on warns or mutes__",
                            color: 16087044
                        },
                        {
                            title: "🪑 Timeouts & Warns",
                            description: "__Valid things you can Timeout and/or Warn members for__\n\n— Spamming channels\n— Joined just to \n— Bypassing Yozora's filter (if it is not a false flag)\n— Anything that could induce epilepsy (Without a warning)\n— Earrapes\n— Anything that can crash, restart or exploit the Discord client\n— Politics\n— Social Credit things",
                            color: 15397639
                        },
                        {
                            description: "I'm always wanting to improve the Rules, the PTS, and Community Interaction, if you have a suggestion please let me know!",
                            color: 196415
                        }
                    ]
                });

                interaction.followUp({ content: "Finished", ephemeral: true });
            break;
            case "verify":
                interaction.channel.send({
                    embeds: [
                        {
                            title: "Click the button to verify!",
                            color: "GREEN"
                        }
                    ],
                    components: [ new MessageActionRow().addComponents([ new MessageButton().setCustomId("4D35DE24-2FE2-41A7-B86F-966284E6B10C").setLabel("Verify").setStyle(3) ]) ]
                });

                interaction.followUp({ content: "Finished", ephemeral: true });
            break;
            case "k_index":
                interaction.channel.send({
                    embeds: [
                        {
                            title: "Kitsune Index (Deprecated)",
                            description: "This index is deprecated and will soon be replaced with\nhttps://index.senkosworld.com/",
                            color: "#FF6633"
                        }
                    ],
                    components: [
                        new MessageActionRow().addComponents([
                            new MessageButton()
                            .setURL("https://discord.com/channels/777251087592718336/777255864682676224/928166670076346378")
                            .setStyle(5)
                            .setLabel("Server Rules"),
                            new MessageButton()
                            .setURL("https://discord.com/channels/777251087592718336/929569967265947648/929569977273569321")
                            .setStyle(5)
                            .setLabel("PDS (Progressive Discipline System)"),
                            new MessageButton()
                            .setURL("https://discord.com/channels/777251087592718336/900045922581495828/900083498881286144")
                            .setStyle(5)
                            .setLabel("Role Information"),
                            new MessageButton()
                            .setURL("https://discord.com/channels/777251087592718336/897196483852525609/897197266929082458")
                            .setStyle(5)
                            .setLabel("get Roles")
                        ])
                    ]
                });

                interaction.followUp({ content: "Finished", ephemeral: true });
            break;
            case "roles":
                interaction.channel.send({
                    embeds: [
                        {
                            title: "Vanity Roles",
                            description: "<@&777257201219403816>    <@&777257276033597441>    <@&777259097632407552>\n<@&777259001548111923>    <@&777645674492854322>    <@&777645607585185793>",
                            color: SenkoClient.colors.light
                        }
                    ],
                    components: [
                        {
                            type: "ACTION_ROW",
                            components: [
                                { type: 2, label: "Senko's Color", style: 2, customId: "senko_color" },
                                { type: 2, label: "Shiro's Color", style: 2, customId: "shiro_color" },
                                { type: 2, label: "Suzu's Color", style: 2, customId: "suzu_color" },
                            ]
                        },
                        {
                            type: "ACTION_ROW",
                            components: [
                                { type: 2, label: "Yozora's Color", style: 2, customId: "sora_color" },
                                { type: 2, label: "Koenji's Color", style: 2, customId: "Koenji_color" },
                                { type: 2, label: "Nakano's Color", style: 2, customId: "Nakano_color" }
                            ]
                        }
                    ]
                });

                interaction.channel.send({
                    embeds: [
                        {
                            title: "Notification Roles",
                            description: "**Announcements**\nAny announcement that doesn't need @everyone\n\n**Community News**\nServer changes, partnerships, other related things\n\n**Community Events**\nThings like giveaways, game nights, etc\n\n**Senko Manga Releases**\nWhen a new chapter from the Senko manga releases (in english) you'll be notified\n\n**Senko Bot Updates**\nWhen Senko (the bot) gets updated receive a ping",
                            color: SenkoClient.colors.dark
                        }
                    ],
                    components: [
                        {
                            type: "ACTION_ROW",
                            components: [
                                { type: 2, label: "Announcements", style: 2, customId: "sw_announcements" },
                                { type: 2, label: "Community News", style: 2, customId: "sw_news" },
                                { type: 2, label: "Events", style: 2, customId: "sw_events" },
                                { type: 2, label: "Senko Manga Releases", style: 2, customId: "sw_manga" },
                                { type: 2, label: "Senko Bot Updates", style: 2, customId: "sw_senkodates" }
                            ]
                        }
                    ]
                });

                interaction.channel.send({
                    embeds: [
                        {
                            title: "Hidden Categories",
                            description: "**Senko's Lab**\nProjects and testing area's for stuff",
                            color: SenkoClient.colors.light
                        }
                    ],
                    components: [
                        {
                            type: "ACTION_ROW",
                            components: [
                                { type: 2, label: "Senko's Lab", style: 2, customId: "sw_senkos-lab" }
                            ]
                        }
                    ]
                });

                interaction.followUp({ content: "Finished", ephemeral: true });
            break;
            case "faq":
                interaction.channel.send({
                    embeds: [
                        {
                            title: "🌸 Frequently asked Questions (That nobody asks) 🌸",
                            color: "DARK_BUT_NOT_BLACK"
                        },
                        {
                            title: "Level permissions",
                            description: "**Level 5** – The ability to use External stickers, Embedded links, and speak in Voice Channels\n\n**Level 10** – The ability to upload files in basically every channel, Stream in Voice Channels, change your Nickname, and create Public Threads\n\n**Level 20** – The ability to promote your social media and Discord servers in <#966396091165736990>\n\n**Level 30** - The ability to create Private Threads\n\nBoosting will grant you \"Honorary Kitsune\" which will exempt you from level locks",
                            color: SenkoClient.colors.dark_red
                        },
                        {
                            title: "Server Boosting",
                            description: "We highly suggest boosting servers that are under level 3, but if you do boost you'll get some exclusive things like:\n\nBecoming exempt from the level lock\nAccess to a special channel\nDouble chat XP",
                            color: SenkoClient.colors.light_red
                        },
                        {
                            title: "Roles",
                            description: "Roles can be found in <#832387166737924097>",
                            color: SenkoClient.colors.dark_red
                        }
                    ]
                });

                interaction.followUp({ content: "Finished", ephemeral: true });
            break;
            case "mc_server":
                interaction.channel.send({
                    embeds: [
                        {
                            title: "Notification Roles",
                            description: "**Minecraft Server News/Announcements**",
                            color: SenkoClient.colors.light
                        }
                    ],
                    components: [
                        {
                            type: "ACTION_ROW",
                            components: [
                                { type: 2, label: "Minecraft Server News", style: 2, customId: "mc_server" }
                            ]
                        }
                    ]
                });

                interaction.followUp({ content: "Finished", ephemeral: true });
            break;
        }
    }
};