import Icons from "../../Data/Icons.json";
import HardLinks from "../../Data/HardLinks.json";
import { fetchMarket } from "../../API/super";
import { spliceArray } from "@kitsune-labs/utilities";
import type { SenkoCommand } from "../../types/AllTypes";

export default {
	name: "eat",
	desc: "eat",
	userData: true,
	category: "fun",
	start: async ({senkoClient, interaction, userData}) => {
		const Market = await fetchMarket();
		const possibleItems = [];
		const chosenItems = {
			0: { name: null, id: null },
			1: { name: null, id: null },
			2: { name: null, id: null },
			3: { name: null, id: null }
		};

		for (const item of Object.keys(userData.LocalUser.profileConfig.Inventory)) {
			const mItem = Market[item];

			if (mItem && mItem.class == "Consumables") {
				possibleItems.push(item);
			}
		}

		for (var i = 0; i <= 4; i++) {
			const Item = possibleItems[Math.floor(Math.random() * possibleItems.length)];

			// @ts-expect-error
			if (Item && chosenItems[i]) {
				// @ts-expect-error
				chosenItems[i].name = await Market[Item].name;
				// @ts-expect-error
				chosenItems[i].id = Item;

				// @ts-expect-error
				spliceArray(possibleItems, Item);
			}
		}

		if (chosenItems[0].id === null) return interaction.reply({
			embeds: [
				{
					title: `${Icons.exclamation}  We ran out of food!`,
					description: "We should probably buy some more soon...",
					color: senkoClient.api.Theme.dark,
					thumbnail: {
						url: "https://cdn.senko.gg/public/senko/nervous.png"
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
					color: senkoClient.api.Theme.light,
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

		// console.log(chosenItems);

		if (chosenItems[0].name != null) {
			// @ts-expect-error
			messageStruct.components[0]!.components.push({ type: 2, label: chosenItems[0].name, style: 2, custom_id: `eat-${chosenItems[0].id}-${interaction.user.id}` });
			messageStruct.embeds[0]!.description += `\n1. ${chosenItems[0].name}`;
		}
		if (chosenItems[1].name != null) {
			// @ts-expect-error
			messageStruct.components[0]!.components.push({ type: 2, label: chosenItems[1].name, style: 2, custom_id: `eat-${chosenItems[1].id}-${interaction.user.id}` });
			messageStruct.embeds[0]!.description += `\n2. ${chosenItems[1].name}`;
		}
		if (chosenItems[2].name != null) {
			// @ts-expect-error
			messageStruct.components[0]!.components.push({ type: 2, label: chosenItems[2].name, style: 2, custom_id: `eat-${chosenItems[2].id}-${interaction.user.id}` });
			messageStruct.embeds[0]!.description += `\n3. ${chosenItems[2].name}`;
		}
		if (chosenItems[3].name != null) {
			// @ts-expect-error
			messageStruct.components[0]!.components.push({ type: 2, label: chosenItems[3].name, style: 2, custom_id: `eat-${chosenItems[3].id}-${interaction.user.id}` });
			messageStruct.embeds[0]!.description += `\n4. ${chosenItems[3].name}`;
		}

		interaction.reply(messageStruct);
	}
} as SenkoCommand;