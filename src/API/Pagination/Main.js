// eslint-disable-next-line no-unused-vars
const { Interaction, MessageEmbed, Embed } = require("discord.js");

/**
 * @async
 * @param {Interaction} interaction
 * @param {MessageEmbed[]} pages
 * @param {number} timeout
 * @param {boolean} isEphemeral
 * @returns {Embed}
 */
module.exports = async (interaction, pages, timeout = 120000, isEphemeral) => {
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
						custom_id: "page_left"
					},
					{
						type: 2,
						emoji: "<:WhiteArrow1Right:943299054580928582>",
						style: 1,
						custom_id: "page_right"
					}
				]
			}
		]
	};

	if (pages.length == 1) {
		MessageStructure.components[0].components[0].disabled = true;
		MessageStructure.components[0].components[1].disabled = true;
	}

	if (!interaction.deferred) await interaction.deferReply({ ephemeral: isEphemeral });

	MessageStructure.embeds[0] = pages[page];
	pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };

	const curPage = await interaction.editReply(MessageStructure);
	const filter = (i) => i.customId === "page_left" || i.customId === "page_right";
	const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

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

		MessageStructure.embeds[0] = pages[page];
		pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };

		await i.editReply(MessageStructure);
		collector.resetTimer();
	});

	function disable() {
		MessageStructure.components[0].components[0].disabled = true;
		MessageStructure.components[0].components[1].disabled = true;

		interaction.editReply(MessageStructure);
	}

	collector.on("end", (_, reason) => {
		if (reason !== "messageDelete") {
			disable();
		}
	});

	return curPage;
};