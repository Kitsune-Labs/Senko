import { ApplicationCommandOptionType as CommandOption } from "discord.js";
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
	start: async ({senkoClient, interaction}) => {
		const user = interaction.options.getUser("user") || {};
		// @ts-ignore
		const flag = interaction.options.getString("flag") || "";
		// @ts-ignore
		const flagBit = senkoClient.api.BitData[flag] || false;
		const BitData = senkoClient.api.BitData;
		// @ts-ignore
		const userData = await fetchSuperUser(user) || {};
		if (!userData) return interaction.reply({content: `User not found ${userData}`, ephemeral: true});
		// @ts-ignore
		const flags = userData.LocalUser ? Bitfield.fromHex(userData.LocalUser.accountConfig.flags) || {} : {};

		// @ts-ignore
		switch (interaction.options.getSubcommand()) {
		case "view-guild":
			// @ts-ignore
			var guild = await senkoClient.guilds.fetch(interaction.options.getString("guild-id")).catch(() => {
				return interaction.reply({content: "Guild not found", ephemeral: true});
			});
			// @ts-ignore
			var guildData = await fetchSuperGuild(guild, false);
			if (!guildData) return interaction.reply({content: `Guild not found: ${guildData}`, ephemeral: true});
			var guildFlags = Bitfield.fromHex(guildData.flags);

			var message = `BanActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.BanActionDisabled)}\`\`\`\nKickActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.KickActionDisabled)}\`\`\`\nTimeoutActionDisabled: \`\`\`${guildFlags.get(BitData.ActionLogs.TimeoutActionDisabled)}\`\`\`\n\nModCommands: \`\`\`${guildFlags.get(BitData.BETAs.ModCommands)}\`\`\``;

			interaction.reply({content: message, ephemeral: true});
			break;
		case "view":
			// @ts-ignore
			interaction.reply({content: `Flag ${flag} is ${flags.get(flag)}`, ephemeral: true});
			break;
		case "set":
			// @ts-ignore
			flags.set(flagBit, !flags.get(flagBit));

			// @ts-ignore
			userData.LocalUser.accountConfig.flags = flags.toHex();

			// @ts-ignore
			await updateSuperUser(user, {
				// @ts-ignore
				LocalUser: userData.LocalUser
			});

			// @ts-ignore
			interaction.reply({content: `${flag} is now ${flags.get(flagBit)}`, ephemeral: true});
			break;
		}
	}
} as SenkoCommand;