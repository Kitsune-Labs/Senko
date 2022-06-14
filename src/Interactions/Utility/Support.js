// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");

module.exports = {
	name: "support",
	desc: "Support links, info, and other things.",
	usableAnywhere: true,
	/**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction) => {
		interaction.reply({
			embeds: [
				{
					title: "Hello I am Senko-san, a Divine Messenger Kitsune!",
					description: `${Icons.heart}  I'm here to pamper you to your heart's content!\n\nSpecial thanks to [Rimukoro](https://twitter.com/Rimukoro) for creating the Sewayaki Kitsune no Senko-san series!`,
					color: SenkoClient.colors.random(),
					fields: [
						{ name: "Contributors", value: "𝕃𝕒𝕫𝕣𝕖𝕒\nsakuya izayoi\nSilkthorne\nKaori Aiko\nTheReal_Enderboy\n[Wikipedia](https://wikipedia.org/)", inline: true },
						{ name: "Started", value: `<t:${Math.ceil((Date.now() - SenkoClient.uptime) / 1000)}:R>`, inline: true },
						{ name: "Ping", value: `${Math.floor(SenkoClient.ws.ping)}`, inline: true }
					],
					thumbnail: {
						url: "attachment://image.png"
					}
				}
			],
			files: [{ attachment: "./src/Data/content/senko/senko_hat_huh.png", name: "image.png" }],
			components: [
				{
					type: "ACTION_ROW",
					components: [
						{ type: 2, label: "Invite me", style: 5, url: `https://discord.com/oauth2/authorize?scope=bot%20applications.commands&client_id=${SenkoClient.user.id}&permissions=137439266880`, disabled: false },
						{ type: 2, label: "Support and Community", style: 5, url: "https://senkosworld.com/discord" }
						// { type: 2, label: "GitHub", style: 5, url: "https://github.com/Kitsune-Softworks/Senko" }
					]
				}
			],
			ephemeral: true
		});
	}
};