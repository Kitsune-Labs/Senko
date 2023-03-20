import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import Icons from "../../Data/Icons.json";
import { addYen } from "../../API/Master";
import { wait } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "coin-flip",
	desc: "Play a game of coinflip with Shiro.",
	category: "fun",
	options: [
		{
			name: "choice",
			description: "You can choose heads or tails.",
			type: CommandOption.String,
			required: true,
			choices: [
				{
					name: "heads",
					value: "heads"
				},
				{
					name: "tails",
					value: "tails"
				}
			]
		}
	],
	/**
	 * @param {CommandInteraction} interaction
	 */
	start: async ({ senkoClient, interaction }) => {
		await interaction.reply({
			embeds: [
				{
					title: "Ding!",
					description: "Shiro flipped the coin and we're now anticipating the outcome.",
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/shiro/sneak1.png"
					}
				}
			],
			fetchReply: true
		});

		const Choices: any = {
			"0": "heads",
			"1": "tails",
			"heads": "0",
			"tails": "1"
		};

		const RNG = Math.floor(Math.random() * 2);
		// @ts-ignore
		const UserChoice = interaction.options.getString("choice", true);

		await wait(2000);

		if (Choices[RNG] === UserChoice) {
			interaction.editReply({
				embeds: [
					{
						title: "Thunk!",
						description: "The coin flipped and the outcome is...\n\nA tie!?!?",
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/surprised1.png"
						}
					}
				]
			});
		}

		if (RNG > Choices[UserChoice]) {
			interaction.editReply({
				embeds: [
					{
						title: "Bonk!",
						description: "The coin flipped and the outcome is...\n\nShiro won...",
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/superior.png"
						}
					}
				]
			});
		}

		if (RNG < Choices[UserChoice]) {
			await addYen(interaction.user, 30);
			interaction.editReply({
				embeds: [
					{
						title: "Ting!",
						description: `The coin flipped and the outcome is...\n\nYou won!\n\n— ${Icons.yen}  30x added`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/pout1.png"
						}
					}
				]
			});
		}
	}
} as SenkoCommand;