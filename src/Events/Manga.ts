import { randomArrayItem } from "@kitsune-labs/utilities";
import Paginate from "../API/Pagination/Event";
import Manga from "../Data/MangaList.json";
import type { SenkoClientTypes } from "../types/AllTypes";

export default class {
	async execute(senkoClient: SenkoClientTypes) {
		senkoClient.on("interactionCreate", async Interaction => {
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
						color: randomArrayItem([senkoClient.api.Theme.light, senkoClient.api.Theme.dark, senkoClient.api.Theme.dark_red, senkoClient.api.Theme.light_red])
					});

					Page++;
				}

				// @ts-ignore
				Paginate(Interaction, Embeds, 120000, false);
			}
		});
	}
}
