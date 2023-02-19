import type { SenkoCommand } from "../../types/AllTypes";
import { PermissionFlagsBits as Permissions } from "discord.js";
import type { DiscordAPIError } from "discord.js";
import { Bitfield } from "bitfields";
import bits from "../../API/Bits.json";

export default {
	name: "clean",
	desc: "clean",
	usableAnywhere: true,
	category: "admin",
	defer: true,
	ephemeral: true,
	permissions: [Permissions.ManageMessages],
	options: [
		{
			name: "amount",
			description: "The amount of messages to delete",
			required: true,
			type: 10,
			minValue: 1,
			maxValue: 100
		}
	],
	whitelist: true,
	// @ts-ignore
	start: async ({senkoClient, interaction, guildData}) => {
		if (!Bitfield.fromHex(guildData.flags).get(bits.BETAs.ModCommands)) return interaction.followUp({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`"
		});

		if (!interaction.guild!.members.me!.permissions.has(Permissions.ManageMessages)) return interaction.followUp({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't manage messsages! (Make sure I have the \"Manage Messages\" permission)",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			]
		});

		// @ts-expect-error
		if (!interaction.member!.permissions.has(Permissions.ManageMessages)) return interaction.followUp({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to manage messages to use this!",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			]
		});

		// @ts-expect-error
		const amount = interaction.options.getNumber("amount");

		// @ts-expect-error
		interaction.channel!.bulkDelete(amount).then((data: any) => {
			interaction.followUp({
				content: data.size > 1 ? `I have removed ${data.size} messages` : `I have removed ${data.size} message`
			});
		}).catch((error: DiscordAPIError) => {
			interaction.followUp({
				content: `There was an error!\n\n__${error}__`
			});
		});
	}
} as SenkoCommand;