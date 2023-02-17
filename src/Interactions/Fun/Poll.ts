import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import type { SenkoCommand, SenkoMessageOptions } from "../../types/AllTypes";

export default {
	name: "poll",
	desc: "Create a poll",
	options: [
		{
			name: "topic",
			description: "Description",
			type: CommandOption.String,
			required: true
		},
		{
			name: "option",
			description: "Option 1",
			type: CommandOption.String,
			required: true
		},
		{
			name: "option-2",
			description: "Option 2",
			type: CommandOption.String,
			required: true
		},
		{
			name: "option-3",
			description: "Option 3",
			type: CommandOption.String,
			required: false
		},
		{
			name: "option-4",
			description: "Option 4",
			type: CommandOption.String,
			required: false
		},
		{
			name: "option-5",
			description: "Option 5",
			type: CommandOption.String,
			required: false
		},
		{
			name: "option-6",
			description: "Option 6",
			type: CommandOption.String,
			required: false
		},
		{
			name: "option-7",
			description: "Option 7",
			type: CommandOption.String,
			required: false
		},
		{
			name: "option-8",
			description: "Option 8",
			type: CommandOption.String,
			required: false
		},
		{
			name: "option-9",
			description: "Option 9",
			type: CommandOption.String,
			required: false
		}
	],
	usableAnywhere: true,
	category: "fun",
	start: async ({senkoClient, interaction}) => {
		// @ts-expect-error
		const Topic = interaction.options.getString("topic");
		let OptionString = "";
		let MaxOptions = 0;
		const Numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
		const Reactions = [];

		// @ts-expect-error
		for (var Option of interaction.options._hoistedOptions) {
			if (Option.name !== "topic") {
				OptionString += `${Numbers[MaxOptions]}  ${Option.value}\n`;
				Reactions.push(Numbers[MaxOptions]);
				MaxOptions++;
			}
		}

		const MesG = await interaction.reply({
			embeds: [
				{
					author: {
						// @ts-expect-error
						name: interaction.member!.nickname || interaction.member!.user.username,
						// @ts-expect-error
						iconURL: interaction.user.avatarURL({ dynamic: true })
					},
					description: `**${Topic}**\n\n${OptionString}\n\nWhat will you pick?`,
					color: senkoClient.api.Theme.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/hat_think.png"
					}
				}
			],
			fetchReply: true
			// TODO: change "any"
		} as SenkoMessageOptions) as any;

		for (var reaction of Reactions) {
			await MesG.react(reaction);
		}
	}
} as SenkoCommand;