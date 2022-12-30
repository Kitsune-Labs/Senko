const { randomArrayItem: randomArray, randomNumber, wait, spliceArray, print } = require("@kitsune-labs/utilities");
// eslint-disable-next-line no-unused-vars
const { User, Interaction } = require("discord.js");
const { updateSuperUser, fetchSuperUser } = require("./super");
const Achievements = require("../Data/Achievements.json");
const config = require("../Data/DataConfig.json");
const Icons = require("../Data/Icons.json");
const { Bitfield } = require("bitfields");
const bits = require("./Bits.json");

// /**
//  * @param {String} Color
//  * @param {String} Type
//  * @param {String} content
//  * @returns {}
//  */
// function print(Color, Type, content) {
// 	console.log(`[${chalk.hex(Color || "#252525").underline(Type)}]: ${content}`);
// }

/**
 * Returns a string with an apostrophe and 's' appended if the string does not
 * already end with 's', otherwise returns the string.
 * @param {string} string - The string to be checked and modified.
 */
function stringEndsWithS(string) {
	return string.endsWith("s") ? `${string}'` : `${string}'s`;
}

/**
 * Add yen to a user's profile.
 * @param {User} message.author
 * @param {Number} amount
 */
async function addYen(user, amount) {
	let Data = await fetchSuperUser(user);

	Data.LocalUser.profileConfig.Currency.Yen = Data.LocalUser.profileConfig.Currency.Yen + amount * config.multiplier;
	updateSuperUser(user, {
		LocalUser: Data.LocalUser
	});
}

/**
 * Remove yen from a user's profile.
 * @param {User} user
 * @param {Number} amount
 */
async function removeYen(user, amount) {
	let Data = await fetchSuperUser(user);

	Data.LocalUser.profileConfig.Currency.Yen = Data.LocalUser.profileConfig.Currency.Yen - amount;
	updateSuperUser(user, {
		LocalUser: Data.LocalUser
	});
}

/**
 * @param {string} Content
 * @returns {string}
 */
function clean(Content) {
	return Content.toString().replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
}

/**
 * Disables all components on a message.
 * @param {Interaction} interaction
 */
async function disableComponents(interaction) {
	for (var component of interaction.message.components[0].components) {
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
function calcTimeLeft(LastDate, Cooldown) {
	return Date.now() - LastDate > Cooldown;
}

/**
 * @param {Interaction} interaction
 * @param {String} AchievementName
 * @returns {}
 * @deprecated
 */
async function awardAchievement(interaction, AchievementName) {
	await wait(300);

	// eslint-disable-next-line no-async-promise-executor
	new Promise(async (resolve, reject) => {
		const userData = await fetchSuperUser(interaction.user);

		if (userData.Achievements.includes(AchievementName) || !Object.keys(Achievements).at(AchievementName)) return reject(false);

		const userFlags = Bitfield.fromHex(userData.LocalUser.config.flags);
		const Achievement = Achievements[AchievementName];

		const messageStruct = {
			content: `${interaction.user}`,
			embeds: [
				{
					title: `${Icons.medal}  Achievement Gained!`,
					description: `**${Achievement.name}**\n\n${Achievement.description}`,
					color: Achievement.color || "ORANGE"
				}
			]
		};

		const data = {
			Achievements: [...userData.Achievements, AchievementName]
		};


		if (Achievement.yenReward) {
			data.Currency = {
				Yen: userData.Currency.Yen + Achievement.yenReward
			};

			messageStruct.embeds[0].description += `\n\n— ${Icons.yen}  ${Achievement.yenReward} rewarded`;
		}


		// updateUser(interaction.user, data);


		if (userFlags.get(bits.DMAchievements)) {
			interaction.user.send(messageStruct);
		} else {
			interaction.channel.send(messageStruct);
		}

		return resolve(true);
	});
}

module.exports = {
	print,
	wait,
	spliceArray,
	stringEndsWithS,
	addYen,
	removeYen,
	randomNumber,
	randomArray,
	clean,
	disableComponents,
	calcTimeLeft,
	awardAchievement
};