import type { SenkoClientTypes } from "../types/AllTypes";
import { ButtonStyle, ComponentType, ChannelType, Events } from "discord.js";
import { randomArrayItem } from "@kitsune-labs/utilities";
import { updateSuperGuild, updateSuperUser, fetchSuperUser, fetchMarket, fetchSuperGuild } from "../API/super";
import Icons from "../Data/Icons.json";
import HardLinks from "../Data/HardLinks.json";

export default class {
	async execute(SenkoClient: SenkoClientTypes) {
		SenkoClient.on(Events.InteractionCreate, async (interaction: any) => {
			if (interaction.isButton()) {
				switch (interaction.customId) {
					case "confirm_super_channel_removal":
						await updateSuperGuild(interaction.guild, {
							Channels: []
						});

						interaction.update({
							embeds: [{
								title: `${Icons.exclamation}  Alright dear`,
								description: "All of the channels have been removed",
								color: SenkoClient.Theme.light,
								thumbnail: {
									url: "attachment://image.png"
								}
							}],
							components: []
						});
						break;
				}
			}

			if (interaction.isButton() && interaction.customId.startsWith("eat-")) {
				const Market = await fetchMarket();
				const foodItem = interaction.customId.split("-")[1];

				if (interaction.user.id !== interaction.customId.split("-")[2]) return interaction.reply({
					embeds: [{
						title: `${Icons.exclamation}  You can't eat that!`,
						description: "That is not your food",
						color: SenkoClient.Theme.dark,
						thumbnail: {
							url: "https://cdn.senko.gg/public/senko/pout.png"
						}
					}],
					ephemeral: true
				});

				const item = Market[foodItem];
				const AccountData: any = await fetchSuperUser(interaction.user);

				new Promise<void>((resolve) => {
					if (AccountData.LocalUser.profileConfig.Inventory[foodItem]) {
						if (AccountData.LocalUser.profileConfig.Inventory[foodItem] > 1) {
							AccountData.LocalUser.profileConfig.Inventory[foodItem]--;

							updateSuperUser(interaction.user, {
								LocalUser: AccountData.LocalUser
							});

							return resolve();
						}

						delete AccountData.LocalUser.profileConfig.Inventory[foodItem];
						updateSuperUser(interaction.user, {
							LocalUser: AccountData.LocalUser
						});

						return resolve();
					}
				}).then(() => {
					const reactions = ["good", "delicious"];

					interaction.update({
						embeds: [{
							title: `You and Senko had ${item?.name}!`,
							description: `Senko says it was ${randomArrayItem(reactions)}\n\n— 1x ${item?.name} removed`,
							color: SenkoClient.Theme.light,
							thumbnail: {
								url: randomArrayItem([HardLinks.senkoBless, HardLinks.senkoEat, HardLinks.senkoDrink])
							}
						}],
						components: []
					});
				});
			}

			if (interaction.isButton() || interaction.isChannelSelectMenu() && interaction.customId.startsWith("log:")) {
				const guildData = await fetchSuperGuild(interaction.guild);

				switch (interaction.customId.split(":")[1]) {
					case "deleted-messages":
						interaction.reply({
							content: "Select a channel to log deleted messages to. (p.s. you can search for channels by typing in the search bar)",
							components: [{
								type: ComponentType.ActionRow,
								customId: "log:deleted-menu",
								components: [{
									type: ComponentType.ChannelSelect,
									customId: "log:deleted-menu-channel",
									// eslint-disable-next-line camelcase
									channel_types: [ChannelType.GuildText]
								}]
							}],
							ephemeral: true
						});

						break;
					case "edited-messages":
						interaction.reply({
							content: "Select a channel to log edited messages to. (p.s. you can search for channels by typing in the search bar)",
							components: [{
								type: ComponentType.ActionRow,
								customId: "log:edited-menu",
								components: [{
									type: ComponentType.ChannelSelect,
									customId: "log:edited-menu-channel",
									// eslint-disable-next-line camelcase
									channel_types: [ChannelType.GuildText]
								}]
							}],
							ephemeral: true
						});
						break;
					case "remove-deleted-messages":
						var dCache = guildData!.AdvancedMessageLogging.message_deletions;
						// eslint-disable-next-line camelcase
						guildData!.AdvancedMessageLogging.message_deletions = null;

						await updateSuperGuild(interaction.guild, {
							AdvancedMessageLogging: guildData!.AdvancedMessageLogging
						});

						interaction.reply({
							content: `Deleted messages will no longer be logged to <#${dCache}>`,
							components: [],
							ephemeral: true
						});

						break;
					case "remove-edited-messages":
						var eCache = guildData!.AdvancedMessageLogging.message_edits;
						// eslint-disable-next-line camelcase
						guildData!.AdvancedMessageLogging.message_edits = null;

						await updateSuperGuild(interaction.guild, {
							AdvancedMessageLogging: guildData!.AdvancedMessageLogging
						});

						interaction.reply({
							content: `Edited messages will no longer be logged to <#${eCache}>`,
							components: [],
							ephemeral: true
						});
						break;
					case "deleted-menu-channel":
						// eslint-disable-next-line camelcase
						guildData!.AdvancedMessageLogging.message_deletions = interaction.values[0];

						await updateSuperGuild(interaction.guild, {
							AdvancedMessageLogging: guildData!.AdvancedMessageLogging
						});

						interaction.update({
							content: `Deleted messages will now be logged to <#${interaction.values[0]}>`,
							components: []
						});

						break;
					case "edited-menu-channel":
						// eslint-disable-next-line camelcase
						guildData!.AdvancedMessageLogging.message_edits = interaction.values[0];

						await updateSuperGuild(interaction.guild, {
							AdvancedMessageLogging: guildData!.AdvancedMessageLogging
						});

						interaction.update({
							content: `Edited messages will now be logged to <#${interaction.values[0]}>`,
							components: []
						});

						break;
					case "refresh":
						var EditCheck = guildData!.AdvancedMessageLogging.message_edits ? true : false;
						var DeleteCheck = guildData!.AdvancedMessageLogging.message_deletions ? true : false;

						interaction.update({
							embeds: [{
								title: "Advanced Message Log Settings",
								description: `> ${DeleteCheck ? `Deleted messages will be sent to <#${guildData!.AdvancedMessageLogging.message_deletions}>` : "Deleted messages will be sent to the default message logging channel if applicable"}\n\n> ${EditCheck ? `Edited messages will be sent to <#${guildData!.AdvancedMessageLogging.message_edits}>` : "Edited messages will be sent to the default message logging channel if applicable"}`,
								color: SenkoClient.Theme.light
							}],
							ephemeral: true,
							components: [{
								type: ComponentType.ActionRow,
								components: [{
									type: ComponentType.Button,
									label: DeleteCheck ? "Update Deleted Messages Channel" : "Setup Deleted Messages Channel",
									style: DeleteCheck ? ButtonStyle.Primary : ButtonStyle.Success,
									customId: "log:deleted-messages"
								},
								{
									type: ComponentType.Button,
									label: EditCheck ? "Update Edited Messages Channel" : "Setup Edited Messages Channel",
									style: EditCheck ? ButtonStyle.Primary : ButtonStyle.Success,
									customId: "log:edited-messages"
								}
								]
							},
							{
								type: ComponentType.ActionRow,
								components: [{
									type: ComponentType.Button,
									label: "Remove Deleted Messages Channel",
									style: ButtonStyle.Danger,
									customId: "log:remove-deleted-messages",
									disabled: DeleteCheck ? false : true
								},
								{
									type: ComponentType.Button,
									label: "Remove Edited Messages Channel",
									style: ButtonStyle.Danger,
									customId: "log:remove-edited-messages",
									disabled: EditCheck ? false : true
								}
								]
							},
							{
								type: ComponentType.ActionRow,
								components: [{
									type: ComponentType.Button,
									emoji: {
										name: "🔃"
									},
									style: ButtonStyle.Secondary,
									customId: "log:refresh"
								}]
							}
							]
						});
						break;
				}
			}
		});
	}
}