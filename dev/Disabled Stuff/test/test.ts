import type { SenkoCommand } from "../../../src/types/AllTypes";

export default {
	name: "test",
	desc: "Test TS command!",
	category: "admin",
	start: async ({ interaction }) => {
		interaction.reply({
			content: "<:Sb:1080039600526987294><:Eb:1080039053807845418><:Nb:1080039470981718016><:Kb:1080039468435787787><:Ob:1080039472789471282><:hifin:1080041916558757929><:Sb:1080039600526987294><:Ab:1080039048363638847><:Nb:1080039470981718016>",
			embeds: [
				{
					description: "<:Sb:1080039600526987294><:Eb:1080039053807845418><:Nb:1080039470981718016><:Kb:1080039468435787787><:Ob:1080039472789471282><:hifin:1080041916558757929><:Sb:1080039600526987294><:Ab:1080039048363638847><:Nb:1080039470981718016>"
				}
			],
			ephemeral: true
		});
	}
} as SenkoCommand;