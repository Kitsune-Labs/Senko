// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType: CommandOption, ChannelType, ButtonStyle } = require("discord.js");
const { randomArrayItem } = require("@kitsune-labs/utilities");

const responses = [
	"Yes", "No", "What do you think?",
	"Maybe", "Never", "Yep", "Perhaps",
	"Nah", "It is certain",
	"It is decidedly so", "Without a doubt",
	"Yes, definitely", "You may rely on it",
	"As I see it, yes", "As I see it, no",
	"Most likely", "Outlook good", "Signs point to yes",
	"Signs point to no", "Ask again later", "I better not tell you now...",
	"I cannot predict it", "Concentrate and ask again",
	"Don't count on it", "My reply is no",
	"My sources say no", "My sources say yes",
	"Outlook not so good", "Very doubtful"
];

module.exports = {
	name: "8ball",
	desc: "Ask me any question!",
	options: [
		{
			name: "text",
			description: "text",
			required: true,
			type: CommandOption.String
		}
	],
	category: "fun",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({interaction}) => {
		interaction.reply({
			embeds: [
				{
					title: interaction.options.get("text").value,
					description: randomArrayItem(responses)
				}
			]
		});
	}
};