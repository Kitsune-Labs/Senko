// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { addYen, randomNumber, randomArray } = require("../../API/Master");

const Responses = [
	"There there _USER_, everything will be okay...",
	"Oh dear you're so spoiled!",
	"*Senko-san starts to hum*",
	`${Icons.heart}  Everything is fine, I'm sure.`
];

module.exports = {
	name: "cuddle",
	desc: "Cuddle with Senko-san!",
	category: "fun",
	/**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction) => {
		const MessageStruct = {
			embeds: [
				{
					description: `**${randomArray(Responses).replace("_USER_", interaction.user.username)}**`,
					color: SenkoClient.colors.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/cuddle.png"
					}
				}
			]
		};

		if (randomNumber(100) > 75) {
			addYen(interaction.user, 10);

			MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  10x added for interaction`;
		}


		interaction.reply(MessageStruct);
	}
};