import type { SenkoCommand } from "../types/AllTypes";

export default {
	name: "test",
	desc: "Test TS command!",
	category: "admin",
	start: async ({interaction}) => {
		interaction.reply({
			content: "Hello!"
		});
	}
} as SenkoCommand;