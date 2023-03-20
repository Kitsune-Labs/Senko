import { wait } from "@kitsune-labs/utilities";
import axios from "axios";
import { appendFileSync } from "fs";
import MangaData from "./MangaChapter.json";
import written from "../../test.json";

const chapters: any = {};

async function t() {
	for (const chapter of MangaData.data) {
		if (chapter.attributes.translatedLanguage === "en") {
			axios({
				method: "get",
				url: `https://api.mangadex.org/at-home/server/${chapter.id}`
			}).then(({ data }) => {
				// @ts-ignore
				if (!written[chapter.id]) {
					chapters[chapter.id] = {
						volume: chapter.attributes.volume,
						chapter: chapter.attributes.chapter,
						title: chapter.attributes.title,
						images: []
					};

					for (const image of data.chapter.data) {
						chapters[chapter.id].images.push(`https://uploads.mangadex.org/data/${data.chapter.hash}/${image}`);
					}

					appendFileSync("./test.json", JSON.stringify(chapters, null, 4));
				}
			});
		}

		await wait(2000);
	}
}

t();