const { randomArrayItem } = require("@kitsune-labs/utilities");

module.exports = {
	dark: "#4690FF",
	light: "#FFFFF9",
	blue: "#242E40",
	light_red: "#e70034",
	dark_red: "#b5011e",
	random: () => randomArrayItem(["#FF7C7C", "#4690FF", "#FF9933"])
};