// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
const { fetchData, updateUser, randomArray } = require("../API/Master");
const { updateSuperGuild, fetchSuperGuild } = require("../API/super");
const Icons = require("../Data/Icons.json");
const Market = require("../Data/Shop/Items.json");
const HardLinks = require("../Data/HardLinks.json");
const { Bitfield } = require("bitfields");
const bits = require("../API/Bits.json");
const { randomArrayItem } = require("@kitsune-laboratories/utilities");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async (interaction) => {
			if (interaction.isButton()) {
				var guildData = await fetchSuperGuild(interaction.guild);
				var guildFlags = Bitfield.fromHex(guildData.flags);

				switch (interaction.customId) {
				case "confirm_super_channel_removal":
					await updateSuperGuild(interaction.guild, {
						Channels: []
					});

					interaction.update({
						embeds: [
							{
								title: `${Icons.exclamation}  Alright dear`,
								description: "All of the channels have been removed",
								color: SenkoClient.colors.light,
								thumbnail: {
									url: "attachment://image.png"
								}
							}
						],
						components: []
					});
					break;
				case "g_disable_bans":
					if (guildFlags.get(bits.ActionLogs.BanActionDisabled)) {
						guildFlags.set(bits.ActionLogs.BanActionDisabled, false);

						interaction.message.components[0].components[0].style = "DANGER";
						interaction.message.components[0].components[0].label = "Disable Ban Logs";
						interaction.update({ components: interaction.message.components });

						return updateSuperGuild(interaction.guild, {
							flags: guildFlags.toHex()
						});
					}

					guildFlags.set(bits.ActionLogs.BanActionDisabled, true);
					updateSuperGuild(interaction.guild, {
						flags: guildFlags.toHex()
					});

					interaction.message.components[0].components[0].style = "SUCCESS";
					interaction.message.components[0].components[0].label = "Enable Ban Logs";
					interaction.update({ components: interaction.message.components });
					break;
				case "g_disable_kicks":
					if (guildFlags.get(bits.ActionLogs.KickActionDisabled)) {
						guildFlags.set(bits.ActionLogs.KickActionDisabled, false);

						interaction.message.components[0].components[1].style = "DANGER";
						interaction.message.components[0].components[1].label = "Disable Kick Logs";
						interaction.update({ components: interaction.message.components });

						return updateSuperGuild(interaction.guild, {
							flags: guildFlags.toHex()
						});
					}

					guildFlags.set(bits.ActionLogs.KickActionDisabled, true);
					updateSuperGuild(interaction.guild, {
						flags: guildFlags.toHex()
					});

					interaction.message.components[0].components[1].style = "SUCCESS";
					interaction.message.components[0].components[1].label = "Enable Kick Logs";
					interaction.update({ components: interaction.message.components });
					break;
				case "g_disable_timeouts":
					if (guildFlags.get(bits.ActionLogs.TimeoutActionDisabled)) {
						guildFlags.set(bits.ActionLogs.TimeoutActionDisabled, false);

						interaction.message.components[0].components[2].style = "DANGER";
						interaction.message.components[0].components[2].label = "Disable Timeout Logs";
						interaction.update({ components: interaction.message.components });

						return updateSuperGuild(interaction.guild, {
							flags: guildFlags.toHex()
						});
					}

					guildFlags.set(bits.ActionLogs.TimeoutActionDisabled, true);
					updateSuperGuild(interaction.guild, {
						flags: guildFlags.toHex()
					});

					interaction.message.components[0].components[2].style = "SUCCESS";
					interaction.message.components[0].components[2].label = "Enable Timeout Logs";
					interaction.update({ components: interaction.message.components });
					break;
				}


				if (interaction.customId.startsWith("eat-")) {
					console.log(interaction.customId);

					const foodItem = interaction.customId.split("-")[1];

					if (interaction.user.id !== interaction.customId.split("-")[2]) return interaction.reply({
						embeds: [
							{
								title: `${Icons.exclamation}  You can't eat that!`,
								description: "That is not your food",
								color: SenkoClient.colors.dark,
								thumbnail: {
									url: "attachment://image.png"
								}
							}
						],
						files: [{ attachment: "./src/Data/content/senko/pout.png", name: "image.png" }],
						ephemeral: true
					});

					const item = Market[foodItem];
					const AccountData = await fetchData(interaction.user);

					new Promise((resolve) => {
						for (var index in AccountData.Inventory) {
							const Item = AccountData.Inventory[index];

							if (Item.codename === foodItem) {
								if (Item.amount > 1) {
									Item.amount--;

									updateUser(interaction.user, {
										Inventory: AccountData.Inventory
									});

									return resolve();
								}

								AccountData.Inventory.splice(index, 1);
								updateUser(interaction.user, {
									Inventory: AccountData.Inventory
								});

								return resolve();
							}
						}
					}).then(() => {
						const reactions = ["good", "delicious"];

						interaction.update({
							embeds: [
								{
									title: `You and Senko had ${item.name}!`,
									description: `Senko says it was ${randomArrayItem(reactions)}\n\n— 1x ${item.name} removed`,
									color: SenkoClient.colors.light,
									thumbnail: {
										url: randomArray([HardLinks.senkoBless, HardLinks.senkoEat, HardLinks.senkoDrink])
									}
								}
							],
							components: []
						});
					});
				}
			}
		});
	}
};