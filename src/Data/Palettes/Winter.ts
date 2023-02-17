import { randomArrayItem } from "@kitsune-labs/utilities";

export default {
	dark: 0x4690FF,
	light: 0xFFFFF9,
	blue: 0x242E40,
	light_red: 0xFF7C7C,
	dark_red: 0xb5011e,
	random: () => {
		return randomArrayItem([0xFF7C7C, 0x242E40, 0xFFFFF9, 0x4690FF]);
	}
};