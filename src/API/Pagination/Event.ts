import type { Interaction, Embed, ButtonInteraction, CollectedInteraction } from "discord.js";

export default async function(interaction: (Interaction|any), pages: Embed[], timeout = 120000, IsEphemeral = false): Promise<void> {
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
						customId: "page_left",
						disabled: false
					},
					{
						type: 2,
						emoji: "<:WhiteArrow1Right:943299054580928582>",
						style: 1,
						customId: "page_right",
						disabled: false
					}
				]
			}
		],
		ephemeral: IsEphemeral || true
	};

	if (pages.length == 1) {
		MessageStructure.components[0]!.components[0]!.disabled = true;
		MessageStructure.components[0]!.components[1]!.disabled = true;
	}

	// @ts-ignore
	MessageStructure.embeds[0] = pages[page];
	// @ts-ignore
	pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };

	const curPage = await interaction.update(MessageStructure);
	const filter = (i: ButtonInteraction) => i.customId === "page_left" || i.customId === "page_right";
	const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

	collector.on("collect", async (i: (CollectedInteraction|any)) => {
		switch (i.customId) {
		case "page_left":
			page = page > 0 ? --page : pages.length - 1;
			break;
		case "page_right":
			page = page + 1 < pages.length ? ++page : 0;
			break;
		}

		// @ts-ignore
		MessageStructure.embeds[0] = pages[page];
		// @ts-ignore
		pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };
		await i.update(MessageStructure);

		collector.resetTimer();
	});

	function disable() {
		MessageStructure.components[0]!.components[0]!.disabled = true;
		MessageStructure.components[0]!.components[1]!.disabled = true;

		interaction.editReply(MessageStructure);
	}

	collector.on("end", (_: unknown, reason: string) => {
		if (reason !== "messageDelete") {
			disable();
		}
	});
}