import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import { randomArrayItem } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";

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

export default {
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
	start: async ({ Interaction }) => {
		Interaction.reply({
			embeds: [
				{
					title: Interaction.options.getString("text", true),
					description: randomArrayItem(responses)
				}
			]
		});
	}
} as SenkoCommand;