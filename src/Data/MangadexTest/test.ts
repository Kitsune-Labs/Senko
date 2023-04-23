import { wait } from "@kitsune-labs/utilities";
import axios from "axios";
import { writeFileSync } from "fs";
import MangaData from "./MangaChapters.json";
import written from "./test.json";

const chapters: any = {};

async function t() {
	const chapterLength = MangaData.data.filter((chapter: any) => chapter.attributes.translatedLanguage === "en").length;
	let currentChapter = 1;

	for (const chapter of MangaData.data) {
		if (chapter.attributes.translatedLanguage === "en") {
			axios({
				method: "get",
				url: `https://api.mangadex.org/at-home/server/${chapter.id}`
			}).then(({ data }) => {
				// @ts-ignore
				if (!written[chapter.attributes.chapter]) {
					chapters[chapter.attributes.chapter] = {
						id: chapter.id,
						volume: chapter.attributes.volume,
						chapter: chapter.attributes.chapter,
						title: chapter.attributes.title,
						images: []
					};

					for (const image of data.chapter.data) {
						chapters[chapter.attributes.chapter].images.push(`https://uploads.mangadex.org/data/${data.chapter.hash}/${image}`);
					}

					writeFileSync("./src/Data/MangadexTest/test.json", JSON.stringify(chapters, null, 4));

					currentChapter++;
					console.log(`${currentChapter}/${chapterLength}`);
				}
			});
		}

		await wait(2000);
	}
}

t();