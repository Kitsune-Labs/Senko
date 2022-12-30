const clip = require("prompt");
const prompt = clip.start();


prompt.get([
	"[Badges, Titles, Banners, Colors, Consumables, Materials, Manga, Music, Misc]\nClass",
	"ID",
	"Name",
	"Description",
	"Price",
	"Amount per-sale",
	"Maximum Amount",
	"Banner | blank for none",
	"Title | blank for none",
	"Color | blank for none",
	"Badge | blank for none"
	// "Banner | blank for none",
	// "Banner | blank for none",
	// "Banner | blank for none"
// eslint-disable-next-line no-unused-vars
], (e, result) => {
	console.log(result);
});