// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client } = require("discord.js");
const { fetchConfig, fetchSuperUser, fetchMarket } = require("../../API/super");
const Icons = require("../../Data/Icons.json");
const { Bitfield } = require("bitfields");
const BitData = require("../../API/Bits.json");
const { stringEndsWithS } = require("../../API/Master");
const Achievements = require("../../Data/Achievements.json");

module.exports = {
	name: "profile",
	desc: "Your profile, or someone else's",
	options: [
		{
			name: "user",
			description: "Someone else",
			required: false,
			type: 6
		}
	],
	defer: true,
	category: "account",
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, accountData, XpLeft) => {
		const User = interaction.options.getUser("user") || interaction.user;
		if (User !== interaction.user) accountData = await fetchSuperUser(User, true);

		if (!accountData) return interaction.reply({ content: "This person doesn't have a profile!", ephemeral: true });

		const ShopItems = await fetchMarket();
		const AccountFlags = Bitfield.fromHex(accountData.LocalUser.accountConfig.flags);
		const xp = accountData.LocalUser.accountConfig.level.xp;
		const level = accountData.LocalUser.accountConfig.level.level;

		if (User.id !== interaction.user.id && AccountFlags.get(BitData.privacy)) return interaction.reply({
			content: "Sorry! This user has set their profile to private.",
			ephemeral: true
		});

		const { OutlawedUsers } = await fetchConfig();

		const xpMath = XpLeft - xp;

		const MessageBuilt = {
			embeds: [
				{
					description: `${ShopItems[accountData.LocalUser.profileConfig.title] ? ShopItems[accountData.LocalUser.profileConfig.title].title : ""} **${stringEndsWithS(User.username || User.username)}** Profile${OutlawedUsers.includes(User.id) ? ` [${Icons.BANNED}]` : ""}\n\n${Icons.medal}  Level **${level}** (${xpMath > 0 ? xpMath : 0} xp left)\n${Icons.yen}  **${accountData.LocalUser.profileConfig.Currency.Yen}** yen\n${Icons.tofu}  **${accountData.LocalUser.profileConfig.Currency.Tofu}** tofu\n${Icons.tail1}  **${accountData.Stats.Fluffs}** fluffs\n\n${accountData.LocalUser.profileConfig.aboutMe !== null ? `**About Me**\n${accountData.LocalUser.profileConfig.aboutMe}\n\n` : ""}`,
					// \n${Icons.medal}  **${accountData.LocalUser.profileConfig.achievements.length}/${Object.keys(Achievements).length}** achievements\n\n
					color: parseInt(accountData.LocalUser.profileConfig.cardColor.replace("#", "0x")) || SenkoClient.colors.light,
					image: {
						url: `https://assets.senkosworld.com/media/banners/${ShopItems[accountData.LocalUser.profileConfig.banner.replace(".png", "")].banner}`
					},
					thumbnail: {
						url: User.displayAvatarURL()
					}
				}
			]
		};

		let BadgeString = "**Badges**\n";
		let BAmount = 0;

		for (var index in accountData.LocalUser.profileConfig.Inventory) {
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