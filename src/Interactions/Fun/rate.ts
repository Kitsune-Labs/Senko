import type { SenkoCommand } from "../../types/AllTypes";
import { ApplicationCommandOptionType as CommandOption } from "discord.js";

export default {
	name: "rate",
	desc: "Rate something",
	options: [
		{
			name: "thing",
			description: "What should I rate?",
			type: CommandOption.String,
			required: true
		}
	],
	usableAnywhere: true,
	category: "fun",
	start: async ({ Senko, Interaction }) => {
		const Item = Interaction.options.getString("thing", true);

		const MessageBuild = {
			embeds: [
				{
					title: "Let me think...",
					description: `I rate **${Item}** a ${Math.floor(Math.random() * 10)}/10!`,
					color: Senko.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/think.png"
					}
				}
			]
		};

		if (Item.toLowerCase() === "senko" || Item.toLowerCase() === "senko-san") {
			MessageBuild.embeds[0]!.title = "I don't need to think!";
			MessageBuild.embeds[0]!.description = "I'm obviously a 10/10!";

			MessageBuild.embeds[0]!.thumbnail.url = "https://cdn.senko.gg/public/senko/bless.png";
		}

		Interaction.reply(MessageBuild);
	}
} as SenkoCommand;