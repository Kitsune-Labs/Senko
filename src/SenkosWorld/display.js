// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Colors } = require("discord.js");

module.exports = {
	name: "display",
	desc: "for use by developers",
	SenkosWorld: true,
	permissions: "0",
	noGlobal: true,
	options: [
		{
			name: "rules",
			description: "rules",
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
	/**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction) => {
		if (interaction.user.id !== "609097445825052701") return;
		//                                      👍
		const Command = interaction.options._subcommand;
		await interaction.deferReply({ ephemeral: true });
		console.log(Command);

		switch (Command) {
		case "rules":
			interaction.followUp({ content: "Finished", ephemeral: true });

			interaction.channel.send({
				embeds: [
					{
						image: {
							url: "https://media.discordapp.net/attachments/956732513261334568/960222673613496400/Senkos_World_Welcome_Banner.png"
						},
						color: 0xfc844c
					},
					{
						description: "**Follow Discord's Community Guidelines & Terms of Service**\n> [discord.com/guidelines](https://discord.com/guidelines) - [discord.com/terms](https://discord.com/terms)\n\n**Respect Everyone**\n> Yes, even if you don't like them!\n> Do not post media that could induce epilepsy or seizures without a **visible** warning\n\n**No age-gated content (aka 18+/NSFW content)**\n> Do not ask for it.\n\n**No dark humor**\n> Please do not send dark humor jokes or other dark humor content, this is not the server for it.",
						color: 0xfc844c
					},
					{
						description: "Ban Appeals can be found at [senkosworld.com/appeal](https://senkosworld.com/appeal)\n\nStaff applications can be found at [senkosworld.com/apply](https://senkosworld.com/apply)",
						color: 0xfc844c
					}
				],
				components: [
					{
						type: "ACTION_ROW",
						components: [
							{ type: 2, label: "Find Roles", style: 5, url: "https://discord.com/channels/777251087592718336/832387166737924097" },
							{ type: 2, label: "Say Hello", style: 5, url: "https://discord.com/channels/777251087592718336/792999444341719049" },
							{ type: 2, label: "View expanded guidelines", style: 3, custom_id: "sw_expanded_rules" }
						]
					}
				]
			});
			break;
		case "k_index":
			interaction.channel.send({
				content: "https://index.senkosworld.com"
			});

			interaction.followUp({ content: "Finished", ephemeral: true });
			break;
		case "roles":
			console.log(interaction.channel.name);

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
						type: 1,
						components: [
							{ type: 2, label: "Senko's Color", style: 2, customId: "senko_color" },
							{ type: 2, label: "Shiro's Color", style: 2, customId: "shiro_color" },
							{ type: 2, label: "Suzu's Color", style: 2, customId: "suzu_color" }
						]
					},
					{
						type: 1,
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
						description: "**Announcements**\nAny announcement that doesn't need @everyone\n\n**Community News**\nServer changes, partnerships, other related things\n\n**Community Events**\nThings like giveaways, game nights, etc\n\n**Senko Manga Releases**\nWhen a new chapter from the Senko manga releases (in english) you'll be notified\n\n**Senko Bot Updates**\nWhen Senko (the bot) gets updated receive a ping\n\n**Fox Posts**\nPings you when a new fox is in <#984923552862052392>\n\n**Poll Pings**\nReceive a ping when a moderator makes a poll (Ping is at the moderators discretion)",
						color: SenkoClient.colors.dark
					}
				],
				components: [
					{
						type: 1,
						components: [
							{ type: 2, label: "Announcements", style: 2, customId: "sw_announcements" },
							{ type: 2, label: "Community News", style: 2, customId: "sw_news" },
							{ type: 2, label: "Events", style: 2, customId: "sw_events" },
							{ type: 2, label: "Senko Manga Releases", style: 2, customId: "sw_manga" },
							{ type: 2, label: "Senko Bot Updates", style: 2, customId: "sw_senkodates" }
						]
					},
					{
						type: 1,
						components: [
							{ type: 2, label: "Fox Post's", style: 2, customId: "fox_posts" },
							{ type: 2, label: "Poll Pings", style: 2, customId: "sw_polls" }
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
						type: 1,
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
						title: "🌸 Frequently asked Questions 🌸",
						color: Colors.DarkButNotBlack
					},
					{
						title: "Level Permissions",
						description: "**Level 5** – The ability to use External stickers, Embedded links, and speak in Voice Channels\n\n**Level 10** – The ability to upload files in basically every channel, Stream in Voice Channels, change your Nickname, and create Public Threads\n\n**Level 20** – The ability to promote your social media and Discord servers in <#966396091165736990>\n\n**Level 30** - The ability to create Private Threads\n\nBoosting will grant you \"Honorary Kitsune\" which will exempt you from level locks",
						color: SenkoClient.colors.dark_red
					},
					{
						title: "Server Boosting",
						description: "We highly suggest boosting servers that are under level 3, but if you do boost you'll get some exclusive things like:\n\nBecoming exempt from the level lock\nAccess to a special channel\nDouble chat XP",
						color: SenkoClient.colors.light_red
					},
					{
						title: "Partnering",
						description: "We open for partners! Message <@609097445825052701> to get started",
						color: SenkoClient.colors.dark_red
					},
					{
						title: "Roles",
						description: "Roles can be found in <#832387166737924097>",
						color: SenkoClient.colors.light_red
					}
				]
			});

			interaction.followUp({ content: "Finished", ephemeral: true });
			break;
		case "mc_server":
			interaction.channel.send({
				embeds: [
					{
						title: "MC Server Roles",
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