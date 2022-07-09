// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, Message } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { randomNumber, randomArrayItem } = require("@kitsune-labs/utilities");
const { updateSuperUser } = require("../API/super");

module.exports = {
	name: "walk",
	desc: "Go on a walk with Nakano",
	userData: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	start: async (SenkoClient, interaction, GuildData, AccountData) => {
		const reponses = [];
		const chosenReponse = randomArrayItem(reponses);


		/**
		 * @type {Message}
		 */
		const messageResponse = {
			embeds: [
				{
					description: ""
				}
			]
		};

		if (randomNumber(100) > 90) {
			AccountData.LocalUser.profileConfig.Currency.Yen + 10;

			messageResponse.embeds[0].description += `\n\nSenko-san found ${Icons.yen}  10x on the ground and gave it to you`;
		}

		AccountData.RateLimits.Amount++;
		AccountData.RateLimits.Date = Date.now();

		await updateSuperUser(interaction.user, {
			LocalUser: AccountData.LocalUser,
			RateLimits: AccountData.RateLimits
		});

		interaction.followUp(messageResponse);
	}
};