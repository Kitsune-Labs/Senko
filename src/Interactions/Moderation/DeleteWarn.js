// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { spliceArray } = require("@kitsune-labs/utilities");
const { updateSuperGuild } = require("../../API/super");

module.exports = {
	name: "delete-warn",
	desc: "delete a warn from a guild member",
	options: [
		{
			name: "warn-id",
			description: "The ID of the warn",
			type: "STRING",
			required: true
		}
	],
	usableAnywhere: true,
	category: "admin",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		if (!interaction.member.permissions.has("MODERATE_MEMBERS")) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to moderate members to use this!",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		await interaction.deferReply();

		const warnId = interaction.options.getString("warn-id");

		for (var key in GuildData.warns) {
			const userWarn = GuildData.warns[key];

			for (var warn of userWarn) {
				if (warn.uuid === warnId) {
					spliceArray(userWarn, warn);

					await updateSuperGuild(interaction.guild, {
						warns: GuildData.warns
					});

					(await interaction.guild.members.fetch(key)).send({
						embeds: [
							{
								title: `One of your warns has been deleted in ${interaction.guild.name}!`,
								description: `Here is some info about what warn was deleted\nWarn id: **${warnId}**\nWarn reason: ${warn.reason}\nWarn note: ${warn.note}`,
								color: SenkoClient.colors.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/book.png" }
							}
						]
					}).catch(()=>{});

					return interaction.followUp({
						embeds: [
							{
								title: "All done!",
								description: `I have deleted warn **${warnId}** from **${warn.userTag}**\n\n> ${warn.reason}\n> ${warn.note}`,
								color: SenkoClient.colors.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/book.png" }
							}
						]
					});
				}
			}
		}

		interaction.followUp({
			embeds: [
				{
					title: "I looked around",
					description: `But I cannot find a warning that has **${warnId}** for it's ID...`,
					color: SenkoClient.colors.dark,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/think.png" }
				}
			]
		});
	}
};