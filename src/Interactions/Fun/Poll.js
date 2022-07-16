// eslint-disable-next-line no-unused-vars
const { CommandInteraction } = require("discord.js");
const { cleanUserString } = require("../../API/Master");

module.exports = {
	name: "poll",
	desc: "Create a poll",
	options: [
		{
			name: "topic",
			description: "Description",
			type: 3,
			required: true
		},
		{
			name: "option",
			description: "Option 1",
			type: 3,
			required: true
		},
		{
			name: "option-2",
			description: "Option 2",
			type: 3,
			required: true
		},
		{
			name: "option-3",
			description: "Option 3",
			type: 3,
			required: false
		},
		{
			name: "option-4",
			description: "Option 4",
			type: 3,
			required: false
		},
		{
			name: "option-5",
			description: "Option 5",
			type: 3,
			required: false
		},
		{
			name: "option-6",
			description: "Option 6",
			type: 3,
			required: false
		},
		{
			name: "option-7",
			description: "Option 7",
			type: 3,
			required: false
		},
		{
			name: "option-8",
			description: "Option 8",
			type: 3,
			required: false
		}
	],
	no_data: true,
	usableAnywhere: true,
	/**
     * @param {CommandInteraction} interaction
     */
	start: async (SenkoClient, interaction) => {
		const Topic = cleanUserString(interaction.options.getString("topic"));
		let OptionString = "";
		let MaxOptions = 0;
		const Numbers = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"];
		let Reactions = [];

		for (var Option of interaction.options._hoistedOptions) {
			if (Option.name !== "topic") {
				OptionString += `${Numbers[MaxOptions]}  ${cleanUserString(Option.value)}\n`;
				Reactions.push(Numbers[MaxOptions]);
				MaxOptions++;
			}
		}

		const MesG = await interaction.reply({
			embeds: [
				{
					author: {
						name: interaction.member.nickname || interaction.member.user.username,
						iconURL: interaction.user.avatarURL({ dynamic: true })
					},
					description: `**${Topic}**\n\n${OptionString}\n\nWhat will you pick?`,
					color: SenkoClient.colors.light,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/hat_think.png"
					}
				}
			],
			fetchReply: true
		});

		for (var reaction of Reactions) {
			await MesG.react(reaction);
		}
	}
};