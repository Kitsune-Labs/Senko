import { ApplicationCommandOptionType as CommandOption, ButtonStyle, ComponentType } from "discord.js";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "poll",
	desc: "poll",
	category: "admin",
	options: [
		{
			name: "question",
			description: "The question to ask",
			type: CommandOption.String,
			required: true
		},
		{
			name: "option-1",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1,
			required: true
		},
		{
			name: "option-2",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-3",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-4",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-5",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-6",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-7",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-8",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-9",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		},
		{
			name: "option-10",
			description: "option",
			type: CommandOption.String,
			maxLength: 50,
			minLength: 1
		}
	],
	start: async ({ Senko, Interaction }) => {
		const options = Interaction.options.data.filter((option) => option.name.startsWith("option-"));
		const voteCounts = new Array(options.length).fill(0);

		const PollMessage: any = {
			embeds: [
				{
					description: `**${Interaction.options.get("question", true)?.value}**\n\n${options.map((option, index) => `${index + 1}. ${option.value} (0 votes)`).join("\n")}`,
					color: Senko.Theme.light,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/hat_think.png"
					}
				}
			],
			components: []
		};

		options.map((option, index) => {
			if (index < 5) {
				if (!PollMessage.components[0]) PollMessage.components.push({
					type: ComponentType.ActionRow,
					components: []
				});

				PollMessage.components[0]?.components.push({
					type: ComponentType.Button,
					style: ButtonStyle.Secondary,
					label: option.value,
					customId: `poll-${index}`
				});
			} else {
				if (!PollMessage.components[1]) PollMessage.components.push({
					type: ComponentType.ActionRow,
					components: []
				});

				PollMessage.components[1]?.components.push({
					type: ComponentType.Button,
					style: ButtonStyle.Secondary,
					label: option.value,
					customId: `poll-${index}`
				});
			}
		});

		const Message = await Interaction.reply(PollMessage);

		const filter = (i: any) => i.customId.startsWith("poll-");
		const collector = Message.createMessageComponentCollector({ filter, componentType: ComponentType.Button });
		const userVotes = new Map();

		collector.on("collect", async (i) => {
			// @ts-ignore
			const index = parseInt(i.customId.split("-")[1]);

			if (index >= 0 && index < voteCounts.length) {
				const previousVote = userVotes.get(i.user.id);

				if (previousVote === index) {
					i.reply({ content: "You have already voted for this option!", ephemeral: true });
					return;
				}

				if (previousVote !== undefined) {
					voteCounts[previousVote] -= 1;
				}

				userVotes.set(i.user.id, index);
				voteCounts[index] += 1;

				PollMessage.embeds[0].description = `**${Interaction.options.get("question", true)?.value}**\n\n${options.map((option, index) => `${index + 1}. ${option.value} (${voteCounts[index]} votes)`).join("\n")}`;
				await i.update({ embeds: PollMessage.embeds, components: PollMessage.components });
			}
		});
	}
} as SenkoCommand;