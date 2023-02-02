// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, PermissionFlagsBits, ApplicationCommandOptionType: CommandOption, ChannelType, ButtonStyle } = require("discord.js");
const { fetchConfig, fetchSuperUser, fetchMarket } = require("../../API/super");
const Icons = require("../../Data/Icons.json");
const { Bitfield } = require("bitfields");
const BitData = require("../../API/Bits.json");
const { stringEndsWithS } = require("../../API/Master");
const Achievements = require("../../Data/Achievements.json");

module.exports = {
	name: "profile",
	desc: "View your profile, or someone else's",
	options: [
		{
			name: "user",
			description: "Someone else",
			required: false,
			type: CommandOption.User
		}
	],
	defer: true,
	category: "account",
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, userData, xpAmount}) => {
		const User = interaction.options.getUser("user") || interaction.user;
		if (User !== interaction.user) userData = await fetchSuperUser(User, true);

		if (!userData) return interaction.reply({ content: "This person doesn't have a profile!", ephemeral: true });

		const ShopItems = await fetchMarket();
		const AccountFlags = Bitfield.fromHex(userData.LocalUser.accountConfig.flags);
		const xp = userData.LocalUser.accountConfig.level.xp;
		const level = userData.LocalUser.accountConfig.level.level;

		if (User.id !== interaction.user.id && AccountFlags.get(BitData.privacy)) return interaction.reply({
			content: "Sorry! This user has set their profile to private.",
			ephemeral: true
		});

		const { OutlawedUsers } = await fetchConfig();

		const xpMath = xpAmount - xp;

		const MessageBuilt = {
			embeds: [
				{
					description: `${userData.LocalUser.profileConfig.Status ? `${ShopItems[userData.LocalUser.profileConfig.Status].status} - ` : ""} ${ShopItems[userData.LocalUser.profileConfig.title] ? ShopItems[userData.LocalUser.profileConfig.title].title : ""} **${stringEndsWithS(User.username || User.username)}** Profile${OutlawedUsers[User.id] ? ` [${Icons.BANNED}]` : ""}\n\n${Icons.medal}  Level **${level}** (${xpMath > 0 ? xpMath : 0} xp left)\n${Icons.yen}  **${userData.LocalUser.profileConfig.Currency.Yen}** yen\n${Icons.tofu}  **${userData.LocalUser.profileConfig.Currency.Tofu}** tofu\n${Icons.tail1}  **${userData.Stats.Fluffs}** fluffs\n\n${userData.LocalUser.profileConfig.aboutMe !== null ? `**About Me**\n${userData.LocalUser.profileConfig.aboutMe}\n\n` : ""}`,
					// \n${Icons.medal}  **${userData.LocalUser.profileConfig.achievements.length}/${Object.keys(Achievements).length}** achievements\n\n
					color: parseInt(userData.LocalUser.profileConfig.cardColor.replace("#", "0x")) || senkoClient.api.Theme.light,
					image: {
						url: `https://assets.senkosworld.com/media/banners/${ShopItems[userData.LocalUser.profileConfig.banner.replace(".png", "")].banner}`
					},
					thumbnail: {
						url: User.displayAvatarURL()
					}
				}
			]
		};

		let BadgeString = "**Badges**\n";
		let BAmount = 0;

		for (var index in userData.LocalUser.profileConfig.Inventory) {
			const sItem = ShopItems[index];

			if (sItem && sItem.badge !== undefined /*&& BAmount < 10*/) {
				if (BAmount === 10) BadgeString += "\n";
				BadgeString += `${sItem.badge || Icons.tick} `;

				BAmount++;
			}
		}

		if (BAmount != 0) MessageBuilt.embeds[0].description += BadgeString;

		interaction.followUp(MessageBuilt);
	}
};