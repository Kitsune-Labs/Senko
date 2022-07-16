// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const HardLinks = require("../../Data/HardLinks.json");
const { spliceArray } = require("../../API/Master");
const { fetchMarket } = require("../../API/super");

module.exports = {
	name: "eat",
	desc: "eat",
	userData: true,
	/**
	 * @param {CommandInteraction} interaction
	 * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, accountData) => {
		const Market = await fetchMarket();
		const possibleItems = [];
		const chosenItems = {
			0: { name: null, id: null },
			1: { name: null, id: null },
			2: { name: null, id: null },
			3: { name: null, id: null }
		};

		for (const item of Object.keys(accountData.LocalUser.profileConfig.Inventory)) {
			const mItem = Market[item];

			if (mItem && mItem.class == "food") {
				possibleItems.push(item);
			}
		}

		for (var i = 0; i <= 4; i++) {
			const Item = possibleItems[Math.floor(Math.random() * possibleItems.length)];

			if (Item && chosenItems[i]) {
				chosenItems[i].name = await Market[Item].name;
				chosenItems[i].id = Item;

				spliceArray(possibleItems, Item);
			}
		}

		if (chosenItems[0].id === null) return interaction.reply({
			embeds: [
				{
					title: `${Icons.exclamation}  We ran out of food!`,
					description: "We should probably buy some more soon...",
					color: SenkoClient.colors.dark,
					thumbnail: {
						url: "https://assets.senkosworld.com/media/senko/nervous.png"
					}
				}
			],
			ephemeral: true
		});

		const messageStruct = {
			embeds: [
				{
					title: `${Icons.question}  What should we have to eat?`,
					description: "",
					color: SenkoClient.colors.light,
					thumbnail: {
						url: HardLinks.senkoThink
					}
				}
			],
			components: [
				{
					type: 1,
					components: []
				}
			]
		};

		console.log(chosenItems);

		if (chosenItems[0].name != null) {
			messageStruct.components[0].components.push({ type: 2, label: chosenItems[0].name, style: 2, custom_id: `eat-${chosenItems[0].id}-${interaction.user.id}` });
			messageStruct.embeds[0].description += `\n1. ${chosenItems[0].name}`;
		}
		if (chosenItems[1].name != null) {
			messageStruct.components[0].components.push({ type: 2, label: chosenItems[1].name, style: 2, custom_id: `eat-${chosenItems[1].id}-${interaction.user.id}` });
			messageStruct.embeds[0].description += `\n2. ${chosenItems[1].name}`;
		}
		if (chosenItems[2].name != null) {
			messageStruct.components[0].components.push({ type: 2, label: chosenItems[2].name, style: 2, custom_id: `eat-${chosenItems[2].id}-${interaction.user.id}` });
			messageStruct.embeds[0].description += `\n3. ${chosenItems[2].name}`;
		}
		if (chosenItems[3].name != null) {
			messageStruct.components[0].components.push({ type: 2, label: chosenItems[3].name, style: 2, custom_id: `eat-${chosenItems[3].id}-${interaction.user.id}` });
			messageStruct.embeds[0].description += `\n4. ${chosenItems[3].name}`;
		}

		interaction.reply(messageStruct);
	}
};