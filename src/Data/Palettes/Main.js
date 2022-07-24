const { randomArrayItem } = require("@kitsune-labs/utilities");

module.exports = {
	dark: 0xFF6633, // DARK
	light: 0xFC844C, // LIGHT
	blue: 0x242E40, // BLUE
	light_red: 0xe70034,
	dark_red: 0xb5011e,
	random: () => randomArrayItem([this.dark, this.light])
};