const { randomArrayItem: randomArray, randomNumber, wait, spliceArray } = require("@kitsune-labs/utilities");
// eslint-disable-next-line no-unused-vars
const { User, Interaction, Permissions } = require("discord.js");
const { updateSuperUser, fetchSuperUser } = require("./super");
const Achievements = require("../Data/Achievements.json");
const config = require("../Data/DataConfig.json");
const chalk = require("@kitsune-labs/chalk-node");
const Icons = require("../Data/Icons.json");
const { Bitfield } = require("bitfields");
const bits = require("./Bits.json");

/**
 * @param {String} Color
 * @param {String} Type
 * @param {String} content
 */
function print(Color, Type, content) {
	console.log(`[${chalk.hex(Color || "#252525").underline(Type)}]: ${content}`);
}

/**
 * @param {String} string
 */
function stringEndsWithS(string) {
	return string.endsWith("s") ? `${string}'` : `${string}'s`;
}

/**
 * @param {Interaction} interaction
 */
function getName(interaction) {
	return interaction.member.nickname || interaction.member.user.username;
}

/**
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
 * @param {Interaction} interaction
 * @param {String} Permission
 */
function hasPerm(interaction, Permission) {
	if (interaction.member.permissions.has(Permission)) return true;
	return false;
}

/**
 * @param {Interaction} interaction
 * @param {String} Permission
 * @param {Number} ClientID
 */
function selfPerm(interaction, Permission, ClientID) {
	if (interaction.guild.members.cache.get(ClientID ? ClientID : process.SenkoClient.user.id).permissions.has(Permission)) return true;
	return false;
}

/**
 * @param {Interaction} interaction
 * @param {String} Permission
 */
async function CheckPermission(interaction, Permission) {
	let perms = interaction.channel.permissionsFor(interaction.user, Permission);
	const bitPermissions = new Permissions(perms.bitfield);
	const Result = bitPermissions.has([Permissions.FLAGS[Permission]]);

	if (Result) return true;
	return false;
}

async function rateLimitCoolDown(interaction, RateLimits, Stat) {
	const TimeStamp = Date.now();

	if (!config.cooldowns.daily - (TimeStamp - RateLimits[Stat].Date) >= 0) {
		RateLimits[Stat].Amount = 0;
		RateLimits[Stat].Date = TimeStamp;

		await updateSuperUser(interaction.user, {
			RateLimits: RateLimits
		});

		return {
			maxed: false,
			current: RateLimits[Stat].Amount,
			TimeStamp: TimeStamp
		};
	}

	return {
		maxed: true,
		current: RateLimits[Stat].Amount,
		TimeStamp: TimeStamp
	};
}

async function addStats(interaction, CurrentStats, Stat) {
	CurrentStats.RateLimits[Stat].Amount = CurrentStats.Amount++;
	CurrentStats.RateLimits[Stat].Date = Date.now();

	await updateSuperUser(interaction.user, {
		RateLimits: CurrentStats.RateLimits
	});
}

function randomBummedImageName() {
	const Images = [
		"huh",
		"senko_think"
	];

	return randomArray(Images);
}

function clean(Content) {
	return Content.toString().replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
}

const Characters = ["\"", "'", "\\", "/", "!", "~", "`", "_", "-", "|", "{", "}", "[", "]", ";", ":", ">", "<", ",", ".", "=", "+", "*", "\n"];

function strip(Content) {
	for (var char of Characters) {
		Content = Content.replaceAll(char, "");
	}
	return Content;
}

async function disableComponents(interaction) {
	for (var component of interaction.message.components[0].components) {
		component.disabled = true;
	}

	interaction.channel.messages.cache.get(interaction.message.id).edit({
		components: interaction.message.components
	});
}

function calcTimeLeft(LastDate, Cooldown) {
	return Date.now() - LastDate > Cooldown;
}

function insertString(firstString, index, string) {
	if (index > 0) return firstString.substring(0, index) + string + firstString.substr(index);
	return string + firstString;
}

/**
 * @param {Interaction} interaction
 * @param {String} AchievementName
 * @returns {Boolean}
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

function cleanUserString(string) {
	return string.replaceAll("s/eese popc/ild p", "[blocked]").replaceAll("s eese popc ild p", "[blocked]").replaceAll("seese popc ild p", "[blocked]");
}

module.exports = {
	print,
	wait,
	spliceArray,
	stringEndsWithS,
	addYen,
	removeYen,
	hasPerm,
	selfPerm,
	getName,
	CheckPermission,
	rateLimitCoolDown,
	addStats,
	randomNumber,
	randomBummedImageName,
	randomArray,
	clean,
	strip,
	disableComponents,
	calcTimeLeft,
	insertString,
	awardAchievement,
	cleanUserString
};