import { APIEmbed, ChatInputCommandInteraction, Interaction, CollectedMessageInteraction, InteractionCollector, InteractionEditReplyOptions } from "discord.js";
import { winston } from "../SenkoClient";

export default class Paginate {
	public CurrentPage = 1;
	private collector: InteractionCollector<any> | null = null;

	constructor(interaction: ChatInputCommandInteraction | Interaction, Pages: APIEmbed[], { Ephemeral = true, Time = 120000 }: { Ephemeral?: boolean; Time?: number } = {}) {
		if (Pages.length <= 0 || !Pages[0]) throw new Error("No pages provided.");

		const BaseStructure: InteractionEditReplyOptions = {
			embeds: [Pages[0]],
			components: [
				{
					type: 1,
					components: [
						{
							type: 2,
							emoji: "<:WhiteArrow1Left:943299054568374322>",
							style: 1,
							customId: "page_left",
							disabled: Pages.length == 1 ? true : false
						},
						{
							type: 2,
							emoji: "<:WhiteArrow1Right:943299054580928582>",
							style: 1,
							customId: "page_right",
							disabled: Pages.length == 1 ? true : false
						}
					]
				}
			]
		};

		if (interaction.isChatInputCommand()) interaction.deferReply({ ephemeral: Ephemeral });
		// @ts-ignore
		BaseStructure.embeds[0]!.footer = { text: `Page ${this.CurrentPage} of ${Pages.length}` };

		const RepliedMessage = interaction.isChatInputCommand() ? interaction.editReply(BaseStructure) : interaction.isAnySelectMenu() ? interaction.update(BaseStructure) : null;
		const filter = (int: any) => int.customId === "page_left" || int.customId === "page_right";

		if (!RepliedMessage) throw new Error("No message to paginate.");

		Promise.resolve(RepliedMessage).then((msg) => {
			this.collector = msg.createMessageComponentCollector({ filter, time: Time });
			this.collector.on("collect", async (collected: CollectedMessageInteraction) => {
				switch (collected.customId) {
					case "page_left":
						this.CurrentPage = this.CurrentPage > 0 ? --this.CurrentPage : Pages.length - 1;
						break;
					case "page_right":
						this.CurrentPage = this.CurrentPage + 1 < Pages.length ? ++this.CurrentPage : 0;
						break;
				}

				// @ts-ignore
				BaseStructure.embeds[0] = Pages[this.CurrentPage];
				// @ts-ignore
				BaseStructure.embeds[0].footer = { text: `Page ${this.CurrentPage + 1} of ${Pages.length}` };

				await collected.update(BaseStructure);
			}).once("end", async (_: unknown, reason: string) => {
				if (reason !== "messageDelete") {
					// @ts-ignore
					BaseStructure.components[0].components[0].disabled = true;
					// @ts-ignore
					BaseStructure.components[0].components[1].disabled = true;

					interaction.isChatInputCommand() ? interaction.editReply(BaseStructure) : interaction.isAnySelectMenu() ? interaction.update(BaseStructure) : null;
				}
			});
		});
	}

	public async end() {
		if (this.collector) {
			this.collector.stop();

			winston.log("info", `Stopped collecting interactions. Total interactions: ${this.collector.collected.size}`);
		}
	}
}