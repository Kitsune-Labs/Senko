// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType: CommandOption, ChannelType, ButtonStyle } = require("discord.js");
const { Bitfield } = require("bitfields");
const _super = require("../API/super.js");

module.exports = {
	name: "flag",
	options: [
		{
			name: "view",
			description: "view a flag",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "user",
					description: "user",
					type: CommandOption.User,
					required: true
				},
				{
					name: "flag",
					description: "flag",
					type: CommandOption.String,
					required: true,
					choices: [
						{
							name: "Private",
							value: "Private"
						},
						{
							name: "DMAchievements",
							value: "DMAchievements"
						},
						{
							name: "IndefiniteData",
							value: "IndefiniteData"
						}
					]
				}
			]
		},
		{
			name: "set",
			description: "set a flag",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "user",
					description: "user",
					type: CommandOption.User,
					required: true
				},
				{
					name: "flag",
					description: "flag",
					type: CommandOption.String,
					required: true,
					choices: [
						{
							name: "Private",
							value: "Private"
						},
						{
							name: "DMAchievements",
							value: "DMAchievements"
						},
						{
							name: "IndefiniteData",
							value: "IndefiniteData"
						}
					]
				}
			]
		},
		{
			name: "view-guild",
			description: "view guild flags",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "guild-id",
					description: "guild id",
					type: CommandOption.String,
					required: true
				}
			]
		}
	],
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction}) => {
		const user = interaction.options.getUser("user") || {};
		const flag = interaction.options.getString("flag") || "";
		const flagBit = senkoClient.api.BitData[flag] || false;
		const BitData = senkoClient.api.BitData;
		const userData = await _super.fetchSuperUser(user) || {};
		if (!userData) return interaction.reply({content: `User not found ${userData}`, ephemeral: true});
		const flags = userData.LocalUser ? Bitfield.fromHex(userData.LocalUser.accountConfig.flags) || {} : {};

		switch (interaction.options.getSubcommand()) {
		case "view-guild":
			var guild = await senkoClient.guilds.fetch(interaction.options.getString("guild-id")).catch(() => {
				return interaction.reply({content: "Guild not found", ephemeral: true});
			});
			var guildData = await _super.fetchSuperGuild(guild, false);
			if (!guildData) return interaction.reply({content: `Guild not found: ${guildData}`, ephemeral: true});
			var guildFlags = Bitfield.fromHex(guildData.flags);

			var message = `BanActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.BanActionDisabled)}\`\`\`\nKickActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.KickActionDisabled)}\`\`\`\nTimeoutActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.TimeoutActionDisabled)}\`\`\`\n\nModCommands: \`\`\`${guildFlags.get(BitData.BETAs.ModCommands)}\`\`\``;

			interaction.reply({content: message, ephemeral: true});
			break;
		case "view":
			interaction.reply({content: `Flag ${flag} is ${flags.get(flag)}`, ephemeral: true});
			break;
		case "set":
			flags.set(flagBit, !flags.get(flagBit));

			userData.LocalUser.accountConfig.flags = flags.toHex();

			await _super.updateSuperUser(user, {
				LocalUser: userData.LocalUser
			});

			interaction.reply({content: `${flag} is now ${flags.get(flagBit)}`, ephemeral: true});
			break;
		}
	}
};