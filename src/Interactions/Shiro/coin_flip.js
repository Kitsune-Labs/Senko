// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const Icons = require("../../Data/Icons.json");
const { wait } = require("../../API/Master.js");
const { addYen } = require("../../API/Master");

module.exports = {
	name: "coin-flip",
	desc: "Play a game of coinflip with Shiro.",
	category: "fun",
	options: [
		{
			name: "choice",
			description: "You can choose heads or tails.",
			type: 3,
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
	start: async ({senkoClient, interaction}) => {
		await interaction.reply({
			embeds: [
				{
					title: "Ding!",
					description: "Shiro flipped the coin and we're now anticipating the outcome.",
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/shiro/sneak1.png"
					}
				}
			],
			fetchReply: true
		});

		const Choices = {
			"0": "heads",
			"1": "tails",
			"heads": "0",
			"tails": "1"
		};

		const RNG = Math.floor(Math.random() * 2);
		const UserChoice = interaction.options.getString("choice");

		await wait(2000);

		if (Choices[RNG] === UserChoice) {
			interaction.editReply({
				embeds: [
					{
						title: "Thunk!",
						description: "The coin flipped and the outcome is...\n\nA tie!?!?",
						color: senkoClient.api.Theme.dark,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/shiro/surprised1.png"
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
							url: "https://assets.senkosworld.com/media/shiro/superior.png"
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
							url: "https://assets.senkosworld.com/media/shiro/pout1.png"
						}
					}
				]
			});
		}
	}
};