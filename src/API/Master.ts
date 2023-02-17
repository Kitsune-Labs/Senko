import type { User } from "discord.js";
import { updateSuperUser, fetchSuperUser } from "./super";
// import { Bitfield } from "bitfields";
// import { wait } from "@kitsune-labs/utilities";

// import Achievements from "../Data/Achievements.json";
import config from "../Data/DataConfig.json";
// import Icons from "../Data/Icons.json";
// import bits from "./Bits.json";

export function stringEndsWithS(string: string) {
	return string.endsWith("s") ? `${string}'` : `${string}'s`;
}

/**
 * Add yen to a user's profile.
 * @param {User} message.author
 * @param {Number} amount
 */
export async function addYen(user: User, amount: number) {
	const Data = await fetchSuperUser(user);

	Data!.LocalUser.profileConfig.Currency.Yen = Data!.LocalUser.profileConfig.Currency.Yen + amount * config.multiplier;
	updateSuperUser(user, {
		LocalUser: Data!.LocalUser
	});
}

/**
 * Remove yen from a user's profile.
 * @param {User} user
 * @param {Number} amount
 */
export async function removeYen(user: User, amount: number) {
	const Data = await fetchSuperUser(user);

	Data!.LocalUser.profileConfig.Currency.Yen = Data!.LocalUser.profileConfig.Currency.Yen - amount;
	updateSuperUser(user, {
		LocalUser: Data!.LocalUser
	});
}

/**
 * @param {string} Content
 * @returns {string}
 */
export function clean(Content: string) {
	return Content.toString().replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
}

/**
 * Disables all components on a message.
 * @param {Interaction} interaction
 */
export async function disableComponents(interaction: any) {
	for (const component of interaction.message.components[0].components) {
		component.disabled = true;
	}

	interaction.channel.messages.cache.get(interaction.message.id).edit({
		components: interaction.message.components
	});
}

/**
 *
 * @param {number} LastDate
 * @param {number} Cooldown
 * @returns `bool`
 */
export function calcTimeLeft(LastDate: number, Cooldown: number) {
	return Date.now() - LastDate > Cooldown;
}

// /**
//  * @param {Interaction} interaction
//  * @param {String} AchievementName
//  * @returns {}
//  * @deprecated
//  */
// export async function awardAchievement(interaction: CommandInteraction | any, AchievementName: any) {
// 	await wait(300);

// 	// eslint-disable-next-line no-async-promise-executor
// 	new Promise(async (resolve, reject) => {
// 		const userData = await fetchSuperUser(interaction.user);

// 		if (userData.Achievements.includes(AchievementName) || !Object.keys(Achievements).at(AchievementName)) return reject(false);

// 		const userFlags = Bitfield.fromHex(userData.LocalUser.config.flags);
// 		const Achievement = Achievements[AchievementName];

// 		const messageStruct = {
// 			content: `${interaction.user}`,
// 			embeds: [
// 				{
// 					title: `${Icons.medal}  Achievement Gained!`,
// 					description: `**${Achievement.name}**\n\n${Achievement.description}`,
// 					color: Achievement.color || "ORANGE"
// 				}
// 			]
// 		} as Message | any;

// 		const data = {
// 			Achievements: [...userData.Achievements, AchievementName]
// 		} as any;

// 		if (Achievement.yenReward) {
// 			data.Currency = {
// 				Yen: userData.Currency.Yen + Achievement.yenReward
// 			};

// 			messageStruct.embeds[0].description += `\n\n— ${Icons.yen}  ${Achievement.yenReward} rewarded`;
// 		}


// 		// updateUser(interaction.user, data);


// 		if (userFlags.get(bits.DMAchievements)) {
// 			interaction.user.send(messageStruct);
// 		} else {
// 			interaction.channel.send(messageStruct);
// 		}

// 		return resolve(true);
// 	});
// }