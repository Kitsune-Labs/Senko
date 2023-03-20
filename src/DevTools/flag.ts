import { ApplicationCommandOptionType as CommandOption, Guild } from "discord.js";
import { Bitfield } from "bitfields";
import type { SenkoCommand } from "../types/AllTypes";
import { fetchSuperGuild, fetchSuperUser, updateSuperUser } from "../API/super";

export default {
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
	start: async ({ senkoClient, interaction }) => {
		const user = interaction.options.getUser("user", true);
		const flag = interaction.options.getString("flag", true);
		// @ts-expect-error
		const flagBit = senkoClient.api.BitData[flag];
		const BitData = senkoClient.api.BitData;

		const userData = await fetchSuperUser(user);
		if (!userData) return interaction.reply({ content: `User not found ${userData}`, ephemeral: true });
		const flags = Bitfield.fromHex(userData.LocalUser.accountConfig.flags);

		switch (interaction.options.getSubcommand()) {
			case "view-guild":
				var guild = await senkoClient.guilds.fetch(interaction.options.getString("guild-id", true)).catch(() => {
					return interaction.reply({ content: "Guild not found", ephemeral: true });
				}) as Guild;

				var guildData = await fetchSuperGuild(guild, false);
				if (!guildData) return interaction.reply({ content: `Guild not found: ${guildData}`, ephemeral: true });
				var guildFlags = Bitfield.fromHex(guildData.flags);

				var message = `BanActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.BanActionDisabled)}\`\`\`\nKickActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.KickActionDisabled)}\`\`\`\nTimeoutActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.TimeoutActionDisabled)}\`\`\`\n\nModCommands: \`\`\`${guildFlags.get(BitData.BETAs.ModCommands)}\`\`\``;

				interaction.reply({ content: message, ephemeral: true });
				break;
			case "view":
				// @ts-expect-error
				interaction.reply({ content: `Flag ${flag} is ${flags.get(flag)}`, ephemeral: true });
				break;
			case "set":
				flags.set(flagBit, !flags.get(flagBit));

				userData.LocalUser.accountConfig.flags = flags.toHex();

				await updateSuperUser(user, {
					LocalUser: userData.LocalUser
				});

				interaction.reply({ content: `${flag} is now ${flags.get(flagBit)}`, ephemeral: true });
				break;
		}
	}
} as SenkoCommand;