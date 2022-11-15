// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");
const { randomArray } = require("../API/Master");

module.exports = {
	name: "talk",
	desc: "Speak to Senko-san",
	defer: false,
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} SenkoClient
	 */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		if (interaction.user.id !== "609097445825052701") return;

		// Styles
		// 1 = Primary
		// 2 = Secondary
		// 3 = Success
		// 4 = Danger
		// 5 = Link

		const possibleResponses = [//{
		// 	embeds: [{
		// 		title: "Senko-san",
		// 		description: `Nanoja!\n\nDo you have a question ${interaction.user.username}?`,
		// 		color: SenkoClient.api.Theme.light,
		// 		thumbnail: {
		// 			url: "https://assets.senkosworld.com/media/labs/placeholder.png"
		// 		},
		// 		footer: {
		// 			text: interaction.user.tag
		// 		}
		// 	}],
		// 	components: [{
		// 		type: 1,
		// 		components: [{
		// 			type: 2,
		// 			label: "I wanted to say hello!",
		// 			style: 1,
		// 			custom_id: "senko_talk_1_hello",
		// 			emoji: Icons.sparkle
		// 		},
		// 		{
		// 			type: 2,
		// 			label: "How are you?",
		// 			style: 1,
		// 			custom_id: "senko_talk_1_hru",
		// 			emoji: Icons.question
		// 		},
		// 		{
		// 			type: 2,
		// 			label: "What are you up to?",
		// 			style: 1,
		// 			custom_id: "senko_talk_1_wruu2",
		// 			emoji: Icons.question
		// 		}]
		// 	}]
		// },
			{
				embeds: [{
					description: "How have you been dear?",
					thumbnail: {
						url: "https://assets.senkosworld.com/media/labs/placeholder.png"
					},
					footer: {
						text: interaction.user.tag
					}
				}],
				components: [{
					type: 1,
					components: [{
						type: 2,
						label: "I'm fine, thanks!",
						style: 3,
						custom_id: "senko_talk_2_fine"
					},
					{
						type: 2,
						label: "Things could be better.",
						style: 2,
						custom_id: "senko_talk_2_doingwell"
					},
					{
						type: 2,
						label: "Not so great...",
						style: 4,
						custom_id: "senko_talk_2_notdoinggreat"
					}
					]
				}]
			}
		];

		interaction.reply(randomArray(possibleResponses));
	}
};