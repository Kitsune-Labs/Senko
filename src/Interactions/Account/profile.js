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
			type: "USER"
		}
	],
	defer: true,
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		const User = interaction.options.getUser("user") || interaction.user;
		accountData = await fetchSuperUser(User, true);

		if (!accountData) return interaction.reply({ content: "This person doesn't have a profile!", ephemeral: true });

		const ShopItems = await fetchMarket();
		const AccountFlags = Bitfield.fromHex(accountData.LocalUser.accountConfig.flags);

		if (User.id !== interaction.user.id && AccountFlags.get(BitData.privacy)) return interaction.reply({
			content: "Sorry! This user has set their profile to private.",
			ephemeral: true
		});

		const { OutlawedUsers } = await fetchConfig();

		const MessageBuilt = {
			embeds: [
				{
					description: `${ShopItems[accountData.LocalUser.profileConfig.title] ? ShopItems[accountData.LocalUser.profileConfig.title].title : ""} **${stringEndsWithS(User.username || User.username)}** Profile${OutlawedUsers.includes(User.id) ? ` [${Icons.BANNED}]` : ""}\n\n${accountData.LocalUser.profileConfig.aboutMe !== null ? `**__About Me__**\n${accountData.LocalUser.profileConfig.aboutMe}\n\n` : ""}${Icons.yen}  **${accountData.LocalUser.profileConfig.Currency.Yen}** yen\n${Icons.tofu}  **${accountData.LocalUser.profileConfig.Currency.Tofu}** tofu\n${Icons.tail1}  **${accountData.Stats.Fluffs}** fluffs\n${Icons.medal}  **${accountData.LocalUser.profileConfig.achievements.length}/${Object.keys(Achievements).length}** achievements\n\n`,
					image: {
						url: `attachment://${ShopItems[accountData.LocalUser.profileConfig.banner] ? ShopItems[accountData.LocalUser.profileConfig.banner].banner.endsWith(".png") ? "banner.png" : "banner.gif" : "banner.png"}`
					},
					color: accountData.LocalUser.profileConfig.cardColor || SenkoClient.colors.light
				}
			],
			files: [{ attachment: `src/Data/content/banners/${ShopItems[accountData.LocalUser.profileConfig.banner] ? ShopItems[accountData.LocalUser.profileConfig.banner].banner : ShopItems.DefaultBanner.banner}`, name: ShopItems[accountData.LocalUser.profileConfig.banner] ? ShopItems[accountData.LocalUser.profileConfig.banner].banner.endsWith(".png") ? "banner.png" : "banner.gif" : "banner.png" }]
		};

		let BadgeString = "**__Badges__**\n";
		let BAmount = 0;

		// AccountData.Inventory.map(x => ShopItems[x.codename] && ShopItems[x.codename].badge ? ShopItems[x.codename].badge : "").join("")

		for (var index in accountData.LocalUser.profileConfig.Inventory) {
			const sItem = ShopItems[index];

			if (sItem && sItem.badge !== undefined /*&& BAmount < 10*/) {
				BadgeString += `${sItem.badge || Icons.tick} `;

				BAmount++;
			}
		}

		if (BAmount != 0) MessageBuilt.embeds[0].description += BadgeString;

		if (SenkoClient.guilds.cache.get("777251087592718336").members.cache.get(User.id).roles.cache.has("810018023364231179")) {
			let a = MessageBuilt.embeds[0].description.split("Profile");

			MessageBuilt.embeds[0].description = `${a[0]} Profile  [ <:SD:974835483328794665><:M:974835596214296576><:K:974835596142993428> ] ${a[1]}`;
		}

		interaction.followUp(MessageBuilt);
	}
};