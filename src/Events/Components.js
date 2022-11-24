// eslint-disable-next-line no-unused-vars
const { Client, ButtonStyle } = require("discord.js");
const { randomArray } = require("../API/Master");
const { updateSuperGuild, updateSuperUser, fetchSuperUser, fetchMarket } = require("../API/super");
const Icons = require("../Data/Icons.json");
const HardLinks = require("../Data/HardLinks.json");
const { randomArrayItem } = require("@kitsune-labs/utilities");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async (interaction) => {
			if (interaction.isButton()) {
				const Market = await fetchMarket();

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
								color: SenkoClient.api.Theme.light,
								thumbnail: {
									url: "attachment://image.png"
								}
							}
						],
						components: []
					});
					break;
				}

				if (interaction.customId.startsWith("eat-")) {
					const foodItem = interaction.customId.split("-")[1];

					if (interaction.user.id !== interaction.customId.split("-")[2]) return interaction.reply({
						embeds: [
							{
								title: `${Icons.exclamation}  You can't eat that!`,
								description: "That is not your food",
								color: SenkoClient.api.Theme.dark,
								thumbnail: {
									url: "https://assets.senkosworld.com/media/senko/pout.png"
								}
							}
						],
						ephemeral: true
					});

					const item = Market[foodItem];
					const AccountData = await fetchSuperUser(interaction.user);

					new Promise((resolve) => {
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
							embeds: [
								{
									title: `You and Senko had ${item.name}!`,
									description: `Senko says it was ${randomArrayItem(reactions)}\n\n— 1x ${item.name} removed`,
									color: SenkoClient.api.Theme.light,
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