import { randomArrayItem } from "@kitsune-labs/utilities";

export default {
	dark: 0xFF6633, // DARK
	light: 0xFC844C, // LIGHT
	blue: 0x242E40, // BLUE
	light_red: 0xe70034,
	dark_red: 0xb5011e,
	random: () => {
		return randomArrayItem([0xFF6633, 0xFC844C]);
	}
};