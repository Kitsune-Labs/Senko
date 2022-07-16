/* eslint-disable quotes */
// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { randomArray, disableComponents } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async (interaction) => {
			if (interaction.isButton() && interaction.customId.startsWith("senko_talk_")) {
				if (interaction.message.embeds[0].footer.text !== interaction.user.tag) return;


				const fluffReactions = [
					{
						image: "fluffed.png",
						sounds: ["Uya", "Uya...", "mhMh"],
						text: ["D-Do you have to be so verbose?", "Please be more gentle with my tail!"]
					},
					{
						image: "fluffed2.png",
						sounds: ["Uya!", "HYaa", "mhMh"],
						text: ["Be more careful!"]
					}
				];

				const randomReaction = randomArray(fluffReactions);
				// Styles
				// 1 = Primary
				// 2 = Secondary
				// 3 = Success
				// 4 = Danger
				// 5 = Link

				const possibleResponses = {
					senko_talk_leave: [
						{
							embeds: [
								{
									title: "Senko-san",
									description: `See you later!\n\nI wish we could talk together more ${interaction.user.username}...`,
									color: SenkoClient.colors.dark,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/bummed.png" },
									footer: { text: interaction.user.tag }
								}
							]
						},
						{
							embeds: [
								{
									title: "Senko-san",
									description: `Have a good day ${interaction.user.username}!`,
									color: SenkoClient.colors.dark,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/happy1.png" },
									footer: { text: interaction.user.tag }
								}
							]
						},
						{
							embeds: [
								{
									title: "Senko-san",
									description: `Sayōnara ${interaction.user.username}!`,
									color: SenkoClient.colors.dark,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/happy1.png" },
									footer: { text: interaction.user.tag }
								}
							]
						}
					],
					senko_talk_fluff_tail: [
						{
							embeds: [
								{
									description: "S-sure dear...",
									thumbnail: {
										url: "https://assets.senkosworld.com/media/labs/placeholder.png"
									},
									footer: { text: interaction.user.tag }
								}
							],
							components: [
								{
									type: 1,
									components: [
										{ type: 2, label: "Consume the fluffy", style: 1, custom_id: "senko_talk_consume_the_fluff", emoji: Icons.tail1 }
									]
								}
							]
						}
					],
					senko_talk_consume_the_fluff: [
						{
							embeds: [
								{
									description: randomArray(randomReaction.text),
									thumbnail: { url: `https://assets.senkosworld.com/media/senko/${randomReaction.image}` },
									footer: { text: interaction.user.tag }
								}
							]
						}
					],
					senko_talk_1_hello: [
						{
							embeds: [
								{
									title: `${Icons.heart} Senko-san`,
									description: "Well hello then!\n\nI hope you're having a great day!",
									color: SenkoClient.colors.dark,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/happy.png" },
									footer: { text: interaction.user.tag }
								}
							]
						}
					],
					senko_talk_1_hru: [
						{
							embeds: [
								{
									title: `Senko-san`,
									description: "Im doing great; Thanks for asking!",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/happy.png" },
									footer: { text: interaction.user.tag }
								}
							],
							components: [
								{
									type: 1,
									components: [
										{ type: 2, label: "Want to go shopping later?", style: 1, custom_id: "senko_talk_1_shop", emoji: Icons.question },
										{ type: 2, label: "See you later!", style: 2, custom_id: "senko_talk_leave", emoji: "👋" }
									]
								}
							]
						},
						{
							embeds: [
								{
									title: `${Icons.tears} Senko-san`,
									description: "Not so great, my favorite spoon broke...",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/nervous.png" },
									footer: { text: interaction.user.tag }
								}
							],
							components: [
								{
									type: 1,
									components: [
										{ type: 2, label: "Is there any way I can help?", style: 1, custom_id: "senko_talk_1_any_way", emoji: Icons.question },
										{ type: 2, label: "Sorry I can't help...", style: 4, custom_id: "senko_talk_1_ch", emoji: Icons.tick }
									]
								}
							]
						}
					],
					senko_talk_1_any_way: [
						{
							embeds: [
								{
									title: `Senko-san`,
									description: "Sadly there isn't, unless you can somehow travel back to the past...",
									color: SenkoClient.colors.dark,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/think.png" },
									footer: { text: interaction.user.tag }
								}
							]
						}
					],
					senko_talk_1_ch: [
						{
							embeds: [
								{
									title: `Senko-san`,
									description: "It's okay dear\n\nthere isn't a way to get another one like this anyways...",
									color: SenkoClient.colors.dark,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/heh2.png" },
									footer: { text: interaction.user.tag }
								}
							]
						}
					],
					senko_talk_2_fine: [
						{
							embeds: [
								{
									description: "Thats good to hear!",
									thumbnail: {
										url: "https://assets.senkosworld.com/media/labs/placeholder.png"
									},
									footer: { text: interaction.user.tag }
								}
							]
						}
					],
					senko_talk_2_doingwell: [
						{
							embeds: [
								{
									description: "That doesnt sound good...",
									thumbnail: {
										url: "https://assets.senkosworld.com/media/labs/placeholder.png"
									},
									footer: { text: interaction.user.tag }
								}
							]
						}
					],
					senko_talk_2_notdoinggreat: [
						{
							embeds: [
								{
									description: "Is there anyway I could make it better?",
									thumbnail: {
										url: "https://assets.senkosworld.com/media/labs/placeholder.png"
									},
									footer: { text: interaction.user.tag }
								}
							],
							components: [
								{
									type: 1,
									components: [
										{ type: 2, label: "Can I fluff your tail?", style: 3, custom_id: "senko_talk_fluff_tail", emoji: Icons.tail1 },
										{ type: 2, label: "There isn't", style: 4, custom_id: "senko_talk_leave" }
									]
								}
							]
						}
					]
				};

				if (Object.keys(possibleResponses).includes(interaction.customId)) {
					// disableComponents(interaction);
					await interaction.reply(randomArray(possibleResponses[interaction.customId]));
				}
			}
		});
	}
};