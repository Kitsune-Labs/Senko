// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");
const { wait } = require("../../API/Master.js");
const { addYen } = require("../../API/Master");

module.exports = {
	name: "rock-paper-scissors",
	desc: "Play a game of rock paper scissors with Shiro.",
	category: "fun",
	options: [
		{
			name: "choice",
			description: "Choose your move",
			type: 3,
			required: true,
			choices: [
				{
					name: "đŞ¨",
					value: "rps_rock"
				},
				{
					name: "đď¸",
					value: "rps_paper"
				},
				{
					name: "âď¸",
					value: "rps_scissors"
				}
			]
		}
	],
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction) => {
		const BotChoices = ["rps_rock", "rps_paper", "rps_scissors"];
		const BotChoice = BotChoices[Math.floor(Math.random() * BotChoices.length)];
		const UserChoice = interaction.options.getString("choice");

		interaction.reply({
			embeds: [
				{
					title: "Rock, Paper, Scissors",
					description: "Shiro seems determined to win",
					color: SenkoClient.colors.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/shiro/sneak1.png"
					}
				}
			],
			fetchReply: true
		});

		const things = {
			rps_rock: "đŞ¨",
			rps_paper: "đď¸",
			rps_scissors: "âď¸"
		};

		await wait(3000);

		if (UserChoice === BotChoice) {
			return interaction.editReply({
				embeds: [
					{
						title: `${things[UserChoice]} vs ${things[BotChoice]}`,
						description: "It's a tie!\n\nShiro looks confused",
						color: SenkoClient.colors.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/surprised1.png"
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
						title: "đŞ¨ vs âď¸",
						description: `Shiro lost!\n\nShiro does not look happy...\n\nâ ${Icons.yen}  30x added`,
						color: SenkoClient.colors.light,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/pout1.png"
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
						title: "đď¸ vs đŞ¨",
						description: `Shiro lost!\n\nShiro does not look happy...\n\nâ ${Icons.yen}  30x added`,
						color: SenkoClient.colors.light,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/pout1.png"
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
						title: "âď¸ vs đď¸",
						description: `Shiro lost!\n\nShiro does not look happy...\n\nâ ${Icons.yen}  30x added`,
						color: SenkoClient.colors.light,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/pout1.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_rock" && BotChoice === "rps_paper") {
			return interaction.editReply({
				embeds: [
					{
						title: "đŞ¨ vs đď¸",
						description: "Shiro won!\n\nShiro looks happy!",
						color: SenkoClient.colors.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/ShiroSmug.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_paper" && BotChoice === "rps_scissors") {
			return interaction.editReply({
				embeds: [
					{
						title: "đď¸ vs âď¸",
						description: "Shiro won!\n\nShiro looks happy!",
						color: SenkoClient.colors.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/ShiroSmug.png"
						}
					}
				]
			});
		}

		if (UserChoice === "rps_scissors" && BotChoice === "rps_rock") {
			return interaction.editReply({
				embeds: [
					{
						title: "âď¸ vs đŞ¨",
						description: "Shiro won!\n\nShiro looks happy!",
						color: SenkoClient.colors.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/ShiroSmug.png"
						}
					}
				]
			});
		}
	}
};