import { Bitfield } from "bitfields";
import BitData from "../API/Bits.json";
import Icons from "../Data/Icons.json";
import { updateSuperUser, fetchSuperUser, fetchMarket } from "../API/super";
import { ButtonStyle, Events } from "discord.js";
import type { SenkoClientTypes } from "../types/AllTypes";


export default class {
	async execute(senkoClient: SenkoClientTypes) {
		senkoClient.on(Events.InteractionCreate, async Interaction => {
			//if (!Interaction.isButton() || !Interaction.isStringSelectMenu()) return;
			const AccountData = await fetchSuperUser(Interaction.user);
			const accountFlags = Bitfield.fromHex(AccountData!.LocalUser.accountConfig.flags);

			function setFlag(item: any, value: any) {
				const flags = Bitfield.fromHex(AccountData!.LocalUser.accountConfig.flags);
				flags.set(item, value);
				AccountData!.LocalUser.accountConfig.flags = flags.toHex();
			}


			if (Interaction.isButton()) {
				switch (Interaction.customId) {
					case "user_privacy":
						if (accountFlags.get(BitData.Private)) {
							setFlag(BitData.Private, false);

							await updateSuperUser(Interaction.user, {
								LocalUser: AccountData!.LocalUser
							});

							Interaction.message.embeds[0]!.fields[0]!.value = Icons.disabled;
							Interaction.message.components[0]!.components[0]!.data.style = ButtonStyle.Danger;

							Interaction.update({
								embeds: [Interaction.message.embeds[0]],
								ephemeral: true,
								components: Interaction.message.components
							});
						} else {
							setFlag(BitData.Private, true);

							await updateSuperUser(Interaction.user, {
								LocalUser: AccountData!.LocalUser
							});

							Interaction.message.embeds[0]!.fields[0]!.value = Icons.enabled;
							Interaction.message.components[0]!.components[0]!.data.style = ButtonStyle.Success;

							Interaction.update({
								embeds: [Interaction.message.embeds[0]],
								ephemeral: true,
								components: Interaction.message.components
							});
						}

						break;
					case "user_dm_achievements":
						if (accountFlags.get(BitData.DMAchievements)) {
							setFlag(BitData.DMAchievements, false);

							await updateSuperUser(Interaction.user, {
								LocalUser: AccountData!.LocalUser
							});

							Interaction.message.embeds[0]!.fields[1]!.value = Icons.disabled;
							Interaction.message.components[0]!.components[1]!.data.style = ButtonStyle.Danger;

							Interaction.update({
								embeds: [Interaction.message.embeds[0]],
								ephemeral: true,
								components: Interaction.message.components
							});
						} else {
							setFlag(BitData.DMAchievements, true);

							await updateSuperUser(Interaction.user, {
								LocalUser: AccountData!.LocalUser
							});

							Interaction.message.embeds[0]!.fields[1]!.value = Icons.enabled;
							Interaction.message.components[0]!.components[1]!.data.style = ButtonStyle.Success;

							Interaction.update({
								embeds: [Interaction.message.embeds[0]],
								ephemeral: true,
								components: Interaction.message.components
							});
						}
						break;
				}
			}

			if (Interaction.isStringSelectMenu()) {
				const ReplyEmbed = {
					content: null,
					embeds: [
						{
							title: "Profile Updated!",
							color: senkoClient.Theme.light
						}
					],
					components: []
				};

				const ShopItems = await fetchMarket();
				const InteractionValue = Interaction.values[0]!.replace("title_", "").replace("banner_change_", "").replace("color_change_", "");
				const ShopItem = ShopItems[InteractionValue];

				if (Interaction.values[0]?.startsWith("banner_")) {
					if (InteractionValue === "default") {
						AccountData!.LocalUser.profileConfig.banner = "DefaultBanner.png";

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData!.LocalUser
						});

						// @ts-expect-error
						ReplyEmbed.embeds[0]!.description = "Your banner has been reset";
						Interaction.update(ReplyEmbed);
						return;
					}

					AccountData!.LocalUser.profileConfig.banner = InteractionValue;

					await updateSuperUser(Interaction.user, {
						LocalUser: AccountData!.LocalUser
					});

					// @ts-expect-error
					ReplyEmbed.embeds[0]!.description = `Your banner is now set to __${ShopItem.name}__!`;
					Interaction.update(ReplyEmbed);
				} else if (Interaction.values[0]?.startsWith("color_")) {
					if (InteractionValue === "default") {
						AccountData!.LocalUser.profileConfig.cardColor = "#FF9933";

						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData!.LocalUser
						});

						// @ts-expect-error
						ReplyEmbed.embeds[0]!.description = "Your color has been reset";
						Interaction.update(ReplyEmbed);
						return;
					}
					// @ts-expect-error
					AccountData!.LocalUser.profileConfig.cardColor = ShopItem.color;

					await updateSuperUser(Interaction.user, {
						LocalUser: AccountData!.LocalUser
					});

					// @ts-expect-error
					ReplyEmbed.embeds[0]!.description = `Your color is now set to __${ShopItem.name}__`;
					Interaction.update(ReplyEmbed);
				} else if (Interaction.values[0]?.startsWith("title_")) {
					if (InteractionValue === "none") {
						AccountData!.LocalUser.profileConfig.title = null;
						await updateSuperUser(Interaction.user, {
							LocalUser: AccountData!.LocalUser
						});

						// @ts-expect-error
						ReplyEmbed.embeds[0]!.description = "Your title has been removed";
						Interaction.update(ReplyEmbed);
						return;
					}
					AccountData!.LocalUser.profileConfig.title = InteractionValue.toString();

					await updateSuperUser(Interaction.user, {
						LocalUser: AccountData!.LocalUser
					});

					// @ts-expect-error
					ReplyEmbed.embeds[0]!.description = `Your title is now set to __${ShopItem.name}__!`;
					Interaction.update(ReplyEmbed);
				}
			}
		});
	}
}