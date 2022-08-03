const { Bitfield } = require("bitfields");
const BitData = require("../API/Bits.json");
const Icons = require("../Data/Icons.json");
const { updateSuperUser, fetchSuperUser, fetchMarket } = require("../API/super");

module.exports = {
	/**
	 * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async Interaction => {
			if (!Interaction.isButton() || !Interaction.isSelectMenu()) return;

			const ShopItems = await fetchMarket();
			const accountFlags = Bitfield.fromHex(AccountData.LocalUser.accountConfig.flags);
			const AccountData = await fetchSuperUser(Interaction.user);

			function setFlag(item, value) {
				const flags = Bitfield.fromHex(AccountData.LocalUser.accountConfig.flags);
				flags.set(item, value);
				AccountData.LocalUser.accountConfig.flags = flags.toHex();
			}

			if (Interaction.isButton()) {
				switch (Interaction.customId) {
				case "user_privacy":
					if (accountFlags.get(BitData.privacy)) {
						setFlag(BitData.privacy, false);

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						Interaction.message.embeds[0].fields[0].value = Icons.tick;
						Interaction.message.components[0].components[0].style = "DANGER";

						Interaction.update({
							embeds: [ Interaction.message.embeds[0] ],
							ephemeral: true,
							components: Interaction.message.components
						});
					} else {
						setFlag(BitData.privacy, true);

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						Interaction.message.embeds[0].fields[0].value = Icons.check;
						Interaction.message.components[0].components[0].style = "SUCCESS";

						Interaction.update({
							embeds: [ Interaction.message.embeds[0] ],
							ephemeral: true,
							components: Interaction.message.components
						});
					}

					break;
				case "user_dm_achievements":
					if (accountFlags.get(BitData.DMAchievements)) {
						setFlag(BitData.DMAchievements, false);

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						Interaction.message.embeds[0].fields[1].value = Icons.tick;
						Interaction.message.components[0].components[1].style = "DANGER";

						Interaction.update({
							embeds: [ Interaction.message.embeds[0] ],
							ephemeral: true,
							components: Interaction.message.components
						});
					} else {
						setFlag(BitData.DMAchievements, true);

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						Interaction.message.embeds[0].fields[1].value = Icons.check;
						Interaction.message.components[0].components[1].style = "SUCCESS";

						Interaction.update({
							embeds: [ Interaction.message.embeds[0] ],
							ephemeral: true,
							components: Interaction.message.components
						});
					}
					break;
				}
			}

			if (Interaction.isSelectMenu()) {
				const ReplyEmbed = {
					content: null,
					embeds: [
						{
							title: "Profile Updated!",
							color: SenkoClient.colors.light
						}
					],
					components: []
				};

				const InteractionValue = Interaction.values[0].replace("title_", "").replace("banner_change_", "").replace("color_change_", "");
				const ShopItem = ShopItems[InteractionValue];

				if (Interaction.values[0].startsWith("banner_")) {
					if (InteractionValue === "default") {
						AccountData.LocalUser.profileConfig.banner = "DefaultBanner.png";

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						ReplyEmbed.embeds[0].description = "Your banner has been reset";
						Interaction.update(ReplyEmbed);
						return;
					}

					AccountData.LocalUser.profileConfig.banner = InteractionValue;

					await updateSuperUser(Interaction.user, {
						LocalUser: AccountData.LocalUser
					});

					ReplyEmbed.embeds[0].description = `Your banner is now set to __${ShopItem.name}__!`;
					Interaction.update(ReplyEmbed);
				} else if (Interaction.values[0].startsWith("color_")) {
					if (InteractionValue === "default") {
						AccountData.LocalUser.profileConfig.cardColor = "#FF9933";

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						ReplyEmbed.embeds[0].description = "Your color has been reset";
						Interaction.update(ReplyEmbed);
						return;
					}
					AccountData.LocalUser.profileConfig.cardColor = ShopItem.color;

					await updateSuperUser(Interaction.user, {
						LocalUser: AccountData.LocalUser
					});

					ReplyEmbed.embeds[0].description = `Your color is now set to __${ShopItem.name}__`;
					Interaction.update(ReplyEmbed);
				} else if (Interaction.values[0].startsWith("title_")) {
					if (InteractionValue === "none") {
						AccountData.LocalUser.profileConfig.title = null;
						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						ReplyEmbed.embeds[0].description = "Your title has been removed";
						Interaction.update(ReplyEmbed);
						return;
					}
					AccountData.LocalUser.profileConfig.title = InteractionValue.toString();

					await updateSuperUser(Interaction.user, {
						LocalUser: AccountData.LocalUser
					});

					ReplyEmbed.embeds[0].description = `Your title is now set to __${ShopItem.name}__!`;
					Interaction.update(ReplyEmbed);
				}
			}
		});
	}
};