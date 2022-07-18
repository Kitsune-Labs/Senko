const { randomArrayItem } = require("@kitsune-labs/utilities");

module.exports = {
	dark: 0x4690FF,
	light: 0xFFFFF9,
	blue: 0x242E40,
	light_red: 0xFF7C7C,
	dark_red: 0xb5011e,
	random: () => randomArrayItem([this.light_red, this.blue, this.light])
};