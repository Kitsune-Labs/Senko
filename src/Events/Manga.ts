import { randomArrayItem } from "@kitsune-labs/utilities";
import { Events } from "discord.js";
import Manga from "../Data/MangaList.json";
import type { SenkoClientTypes } from "../types/AllTypes";
import Paginate from "../API/Paginate";

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		senkoClient.on(Events.InteractionCreate, async Interaction => {
			if (Interaction.isStringSelectMenu() && Interaction.values[0]!.match("read_")) {
				let Page = 1;
				// @ts-ignore
				const SelectedManga = Manga[Interaction.values[0]!.replace("read_", "")];
				const Embeds = [];

				let MangaDescription = null;

				switch (Interaction.values[0]!.replace("read_", "")) {
					case "Tail_1":
						MangaDescription = "Vol. 1, Ch. 1";
						break;
					case "Tail_2":
						MangaDescription = "Vol. 1, Ch. 2";
						break;
					case "Tail_3":
						MangaDescription = "Vol. 1, Ch. 3";
						break;
					case "Tail_4":
						MangaDescription = "Vol. 1, Ch. 4";
						break;
					case "Tail_5":
						MangaDescription = "Vol. 1, Ch. 5";
						break;
					case "Tail_6":
						MangaDescription = "Vol. 1, Ch. 6";
						break;
					case "Tail_7":
						MangaDescription = "Vol. 1, Ch. 7";
						break;
					case "Tail_8":
						MangaDescription = "Vol. 2, Ch. 8";
						break;
					case "Tail_10":
						MangaDescription = "Vol. 2, Ch. 10";
						break;
				}

				for (let i = 1; i <= Object.keys(SelectedManga).length; i++) {
					Embeds.push({
						title: "Sewayaki Kitsune no Senko-san",
						description: `[${MangaDescription}](${SelectedManga[Page]})`,
						image: {
							url: SelectedManga[Page]
						},
						color: randomArrayItem([senkoClient.Theme.light, senkoClient.Theme.dark, senkoClient.Theme.dark_red, senkoClient.Theme.light_red])
					});

					Page++;
				}

				new Paginate(Interaction, Embeds, {
					Time: 120000,
					Ephemeral: false
				});
			}
		});
	}
}
