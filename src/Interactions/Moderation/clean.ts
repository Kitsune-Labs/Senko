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
	start: async ({ Senko, Interaction, GuildData }) => {
		if (!Bitfield.fromHex(GuildData.flags).get(bits.BETAs.ModCommands)) return Interaction.followUp({
			content: "Your guild has not enabled Moderation Commands, ask your guild Administrator to enable them with `/server configuration`"
		});

		if (!Interaction.guild!.members.me!.permissions.has(Permissions.ManageMessages)) return Interaction.followUp({
			embeds: [
				{
					title: "Oh dear...",
					description: "It looks like I can't manage messsages! (Make sure I have the \"Manage Messages\" permission)",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			]
		});

		// @ts-ignore
		if (!Interaction.member?.permissions.has(Permissions.ManageMessages)) return Interaction.followUp({
			embeds: [
				{
					title: "Sorry dear!",
					description: "You must be able to manage messages to use this!",
					color: Senko.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/heh.png"
					}
				}
			]
		});

		const amount = Interaction.options.getNumber("amount");

		// @ts-ignore
		Interaction.channel!.bulkDelete(amount).then((data: any) => {
			Interaction.followUp({
				content: data.size > 1 ? `I have removed ${data.size} messages` : `I have removed ${data.size} message`
			});
		}).catch((error: DiscordAPIError) => {
			Interaction.followUp({
				content: `There was an error!\n\n__${error}__`
			});
		});
	}
} as SenkoCommand;