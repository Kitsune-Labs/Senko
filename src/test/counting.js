// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Guild } = require("discord.js");
const config = require("../Data/DataConfig.json");
const { updateSuperGuild } = require("../API/super");

module.exports = {
	name: "counting",
	desc: "counting",
	options: [
		{
			name: "info",
			description: "Counting Information",
			type: 1
		},
		{
			name: "edit",
			description: "Edit the counting settings",
			type: 2,
			options: [
				{
					name: "channel",
					description: "The channel to send the counting messages",
					type: 1,
					options: [
						{
							name: "channel",
							description: "channel",
							type: "CHANNEL",
							required: true
						}
					]
				},
				{
					name: "number",
					description: "The next number that has to be counted",
					type: 1,
					options: [
						{
							name: "number",
							description: "number",
							type: "NUMBER",
							minValue: 1,
							required: true
						}
					]
				}
			]
		}
	],
	/**
     * @param {Client} SenkoClient
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction, GuildData) => {
		if (interaction.user.id !== "609097445825052701") return interaction.reply({ content: "🗿", ephemeral: true });

		switch (interaction.options.getSubcommandGroup()) {
		case "info":
			interaction.reply({
				embeds: [
					{
						title: "Counting Information",
						description: `The next number is ${Number}`,
						color: SenkoClient.colors.dark,
						thumbnail: { url: "attachment://image.png" }
					}
				],
				files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }]
			});
			break;
		case "edit":
			switch (interaction.options.getSubcommand()) {
			case "channel":
				var channel = interaction.options.getChannel("channel");
				GuildData.Counting.channel = channel.id;

				await updateSuperGuild(interaction.guild, {
					Counting: GuildData.Counting
				});

				interaction.reply({
					embeds: [
						{
							title: "Counting Information",
							description: `Channel set to ${channel}`,
							color: SenkoClient.colors.dark,
							thumbnail: { url: "attachment://image.png" }
						}
					],
					files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }],
					ephemeral: true
				});
				break;
			case "number":
				var number = interaction.options.getNumber("number");
				GuildData.Counting.number = number;

				await updateSuperGuild(interaction.guild, {
					Counting: GuildData.Counting
				});

				interaction.reply({
					embeds: [
						{
							title: "Counting Information",
							description: `Number set to ${number}`,
							color: SenkoClient.colors.dark,
							thumbnail: { url: "attachment://image.png" }
						}
					],
					files: [{ attachment: "./src/Data/content/senko/senko_package.png", name: "image.png" }],
					ephemeral: true
				});
				break;
			}
			break;
		}

		// GuildData.Counting.number = Math.ceil(Number);

		// await updateSuperGuild(interaction.guild, {
		//     Counting: GuildData.Counting
		// });

		// interaction.reply({ content: "k", ephemeral: true });
	}
};