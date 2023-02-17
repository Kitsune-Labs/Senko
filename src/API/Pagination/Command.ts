import type { Embed, CommandInteraction } from "discord.js";

export default async function(interaction: CommandInteraction, pages: Embed[] | any, timeout = 120000, isEphemeral = false): Promise<void> {
	if (pages.length <= 0) throw new Error("No pages provided.");

	let page = 0;

	const MessageStructure = {
		embeds: [],
		fetchReply: true,
		components: [
			{
				type: 1,
				components: [
					{
						type: 2,
						emoji: "<:WhiteArrow1Left:943299054568374322>",
						style: 1,
						custom_id: "page_left",
						disabled: false
					},
					{
						type: 2,
						emoji: "<:WhiteArrow1Right:943299054580928582>",
						style: 1,
						custom_id: "page_right",
						disabled: false
					}
				]
			}
		]
	};

	if (pages.length == 1) {
		// @ts-ignore
		MessageStructure.components[0].components[0].disabled = true;
		// @ts-ignore
		MessageStructure.components[0].components[1].disabled = true;
	}

	if (!interaction.deferred) await interaction.deferReply({ ephemeral: isEphemeral });

	// @ts-ignore
	MessageStructure.embeds[0] = pages[page];
	// @ts-ignore
	pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };

	const curPage = await interaction.editReply(MessageStructure);
	const filter = (i: any) => i.customId === "page_left" || i.customId === "page_right";
	const collector = curPage.createMessageComponentCollector({ filter, time: timeout });

	collector.on("collect", async (i) => {
		switch (i.customId) {
		case "page_left":
			page = page > 0 ? --page : pages.length - 1;
			break;
		case "page_right":
			page = page + 1 < pages.length ? ++page : 0;
			break;
		}

		await i.deferUpdate();

		// @ts-ignore
		MessageStructure.embeds[0] = pages[page];
		// @ts-ignore
		pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };

		await i.editReply(MessageStructure);
		collector.resetTimer();
	});

	function disable() {
		// @ts-ignore
		MessageStructure.components[0].components[0].disabled = true;
		// @ts-ignore
		MessageStructure.components[0].components[1].disabled = true;

		interaction.editReply(MessageStructure);
	}

	collector.on("end", (_, reason) => {
		if (reason !== "messageDelete") {
			disable();
		}
	});
}