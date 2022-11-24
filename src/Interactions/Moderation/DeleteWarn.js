// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { spliceArray } = require("@kitsune-labs/utilities");
const { updateSuperGuild } = require("../../API/super");

module.exports = {
	name: "delete-warn",
	desc: "delete a warn from a guild member",
	usableAnywhere: true,
	category: "admin",
	permissions: ["ManageGuild"],
	options: [
		{
			name: "warn-id",
			description: "The ID of the warn",
			type: 3,
			required: true
		}
	],
	whitelist: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData}) => {
		if (!interaction.member.permissions.has("ManageMembers")) return interaction.reply({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to moderate members to use this!",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/heh.png"
					}
				}
			],
			ephemeral: true
		});

		await interaction.deferReply();

		const warnId = interaction.options.getString("warn-id");

		for (var key in guildData.warns) {
			const userWarn = guildData.warns[key];

			for (var warn of userWarn) {
				if (warn.uuid === warnId) {
					spliceArray(userWarn, warn);

					await updateSuperGuild(interaction.guild, {
						warns: guildData.warns
					});

					(await interaction.guild.members.fetch(key)).send({
						embeds: [
							{
								title: `One of your warns has been deleted in ${interaction.guild.name}!`,
								description: `Here is some info about what warn was deleted\nWarn id: **${warnId}**\nWarn reason: ${warn.reason}\nWarn note: ${warn.note}`,
								color: senkoClient.api.Theme.light,
								thumbnail: { url: "https://assets.senkosworld.com/media/senko/book.png" }
							}
						]
					}).catch(()=>{});

					return interaction.followUp({
						embeds: [
							{
								title: "All done!",
								description: `I have deleted warn **${warnId}** from **${warn.userTag}**\n\n> ${warn.reason}\n> ${warn.note}`,
								color: senkoClient.api.Theme.light,
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
					color: senkoClient.api.Theme.dark,
					thumbnail: { url: "https://assets.senkosworld.com/media/senko/think.png" }
				}
			]
		});
	}
};