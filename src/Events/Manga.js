// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const Paginate = require("../API/Pagination/Event");
const Manga = require("../Data/MangaList.json");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async Interaction => {
			if (Interaction.isSelectMenu() && Interaction.values[0].match("read_")) {
				let Page = 1;
				const SelectedManga = Manga[Interaction.values[0].replace("read_", "")];
				const Embeds = [];

				let MangaDescription = null;

				switch (Interaction.values[0].replace("read_", "")) {
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
						color: SenkoClient.colors.random()
					});

					Page++;
				}

				Paginate(Interaction, Embeds, 120000, false);
			}
		});
	}
};
