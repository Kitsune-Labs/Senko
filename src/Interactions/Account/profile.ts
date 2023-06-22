import { ApplicationCommandOptionType as CommandOption } from "discord.js";
import { fetchConfig, fetchSuperUser, fetchMarket } from "../../API/super";
import Icons from "../../Data/Icons.json";
import { Bitfield } from "bitfields";
import BitData from "../../API/Bits.json";
import { stringEndsWithS } from "../../API/Master";
import type { SenkoCommand } from "../../types/AllTypes";
// import Achievements from "../../Data/Achievements.json";

export default {
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
	start: async ({ Senko, Interaction, Member }) => {
		const User = Interaction.options.getUser("user") || Interaction.user;
		let MemberData = await Member.data.fetch();

		if (User !== Interaction.user) MemberData = await fetchSuperUser(User, false);

		if (!MemberData) return Interaction.reply({ content: "This person doesn't have a profile!", ephemeral: true });

		const ShopItems = await fetchMarket();
		const AccountFlags = Bitfield.fromHex(MemberData.LocalUser.accountConfig.flags);
		const xp = MemberData.LocalUser.accountConfig.level.xp;
		const level = MemberData.LocalUser.accountConfig.level.level;

		if (User.id !== Interaction.user.id && AccountFlags.get(BitData.Private)) return Interaction.reply({
			content: "Sorry! This user has set their profile to private.",
			ephemeral: true
		});

		// @ts-ignore
		const { OutlawedUsers } = await fetchConfig();
		// FIXME: Need to be able to get the right amount of xp from the user if they're not the one who ran the command
		const xpMath = Member.Profile.Rank.AmountLeft - xp;

		const MessageBuilt = {
			embeds: [
				{
					// @ts-ignore
					description: `${MemberData.LocalUser.profileConfig.Status ? `${ShopItems[MemberData.LocalUser.profileConfig.Status].status} - ` : ""} ${MemberData.LocalUser.profileConfig.title ? ShopItems[MemberData.LocalUser.profileConfig.title].title : ""} **${stringEndsWithS(User.username || User.username)}** Profile${OutlawedUsers[User.id] ? ` [${Icons.BANNED}]` : ""}\n\n${Icons.medal}  Level **${level}** (${xpMath > 0 ? xpMath : 0} xp left)\n${Icons.yen}  **${MemberData.LocalUser.profileConfig.Currency.Yen}** yen\n${Icons.tofu}  **${MemberData.LocalUser.profileConfig.Currency.Tofu}** tofu\n${Icons.tail1}  **${MemberData.Stats.Fluffs}** fluffs\n\n${MemberData.LocalUser.profileConfig.aboutMe !== null ? `**About Me**\n${MemberData.LocalUser.profileConfig.aboutMe}\n\n` : ""}`,
					// \n${Icons.medal}  **${MemberData.LocalUser.profileConfig.achievements.length}/${Object.keys(Achievements).length}** achievements\n\n
					color: parseInt(MemberData.LocalUser.profileConfig.cardColor.replace("#", "0x")) || Senko.Theme.light,
					image: {
						// @ts-ignore
						url: `https://cdn.senko.gg/public/banners/${ShopItems[MemberData.LocalUser.profileConfig.banner.replace(".png", "")].banner}`
					},
					thumbnail: {
						url: User.displayAvatarURL()
					}
				}
			]
		};

		let BadgeString = "**Badges**\n";
		let BAmount = 0;

		for (var index in MemberData.LocalUser.profileConfig.Inventory) {
			const sItem = ShopItems[index];

			if (sItem && sItem.badge !== undefined /*&& BAmount < 10*/) {
				if (BAmount === 10) BadgeString += "\n";
				BadgeString += `${sItem.badge || Icons.tick} `;

				BAmount++;
			}
		}

		if (BAmount != 0) MessageBuilt.embeds[0]!.description += BadgeString;

		Interaction.followUp(MessageBuilt);
	}
} as SenkoCommand;