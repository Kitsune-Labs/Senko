import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import Icons from "../../Data/Icons.json";
import { wait } from "@kitsune-labs/utilities";
import { addYen } from "../../API/Master";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "rock-paper-scissors",
	desc: "Play a game of rock paper scissors with Shiro.",
	category: "fun",
	options: [
		{
			name: "choice",
			description: "Choose your move",
			type: CommandOption.String,
			required: true,
			choices: [
				{
					name: "🪨",
					value: "rps_rock"
				},
				{
					name: "🗞️",
					value: "rps_paper"
				},
				{
					name: "✂️",
					value: "rps_scissors"
				}
			]
		}
	],
	start: async ({ senkoClient, interaction }) => {
		const BotChoices = ["rps_rock", "rps_paper", "rps_scissors"];
		const BotChoice = BotChoices[Math.floor(Math.random() * BotChoices.length)] as string;
		// @ts-ignore
		const UserChoice = interaction.options.getString("choice");

		await interaction.reply({
			embeds: [
				{
					title: "Rock, Paper, Scissors",
					description: "Shiro seems determined to win",
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/shiro/sneak1.png"
					}
				}
			],
			fetchReply: true
		});

		const things: any = {
			// eslint-disable-next-line camelcase
			rps_rock: "🪨",
			// eslint-disable-next-line camelcase
			rps_paper: "🗞️",
			// eslint-disable-next-line camelcase
			rps_scissors: "✂️"
		};

		await wait(3000);

		if (UserChoice === BotChoice) {
			return interaction.editReply({
				embeds: [
					{
						title: `${things[UserChoice]} vs ${things[BotChoice]}`,
						description: "It's a tie!\n\nShiro looks confused",
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/surprised1.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_rock" && BotChoice === "rps_scissors") {
			await addYen(interaction.user, 30);

			return interaction.editReply({
				embeds: [
					{
						title: "🪨 vs ✂️",
						description: `Shiro lost!\n\nShiro does not look happy...\n\n— ${Icons.yen}  30x added`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/pout1.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_paper" && BotChoice === "rps_rock") {
			await addYen(interaction.user, 30);
			return interaction.editReply({
				embeds: [
					{
						title: "🗞️ vs 🪨",
						description: `Shiro lost!\n\nShiro does not look happy...\n\n— ${Icons.yen}  30x added`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/pout1.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_scissors" && BotChoice === "rps_paper") {
			await addYen(interaction.user, 30);
			return interaction.editReply({
				embeds: [
					{
						title: "✂️ vs 🗞️",
						description: `Shiro lost!\n\nShiro does not look happy...\n\n— ${Icons.yen}  30x added`,
						color: senkoClient.api.Theme.light,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/pout1.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_rock" && BotChoice === "rps_paper") {
			return interaction.editReply({
				embeds: [
					{
						title: "🪨 vs 🗞️",
						description: "Shiro won!\n\nShiro looks happy!",
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/ShiroSmug.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_paper" && BotChoice === "rps_scissors") {
			return interaction.editReply({
				embeds: [
					{
						title: "🗞️ vs ✂️",
						description: "Shiro won!\n\nShiro looks happy!",
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/ShiroSmug.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_scissors" && BotChoice === "rps_rock") {
			return interaction.editReply({
				embeds: [
					{
						title: "✂️ vs 🪨",
						description: "Shiro won!\n\nShiro looks happy!",
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/shiro/ShiroSmug.png"
						}
					}
				]
			});
		}
	}
} as SenkoCommand;