// eslint-disable-next-line no-unused-vars
const { Client, InteractionType } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print, sanitizeString } = require("../src/API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../src/Data/Icons.json");
const fetch = require("node-fetch");
const { fetchSuperUser, updateSuperUser } = require("../src/API/super.js");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async (interaction) => {
			if (interaction.type !== InteractionType.ModalSubmit) return;
			const accountData = await fetchSuperUser(interaction.user);

			switch(interaction.customId) {
			case "submit_suggestion":
				fetch("https://canary.discord.com/api/webhooks/940774968868880384/UPrHLI2DbmsUgbV5CSFn2gLWKVm4z6IINIOlp5sWFwFAIX49-ANhESPMebpWZ2wKNk_9", {
					method: "POST",
					headers: {
						"Content-type": "application/json"
					},
					body: JSON.stringify({
						username: `${interaction.user.tag} [${interaction.user.id}]`,
						avatar_url: interaction.user.displayAvatarURL({ dynamic: true }),
						content: "** **",
						embeds: [
							{
								title: "Suggestion",
								description: `${sanitizeString(interaction.fields[0].value)}`,
								color: SenkoClient.api.Theme.dark
							}
						]
					})
				});

				await interaction.editReply({
					embeds: [
						{
							title: `${Icons.check}  Suggestion Submitted!`,
							description: `Your suggestion: \n\n${sanitizeString(interaction.fields[0].value)}`
						}
					]
				});
				break;

			case "submit_about_me":
				accountData.LocalUser.profileConfig.aboutMe = `${sanitizeString(interaction.fields.getField("submit_about_me_1").value.replaceAll(/[\r\n]+/gm, "\n"))}`;
				await updateSuperUser(interaction.user, {
					LocalUser: accountData.LocalUser
				});

				await interaction.reply({
					embeds: [
						{
							title: `${Icons.exclamation}  I have updated your About Me ${interaction.user.username}`,
							description: "Check it out with **/profile**",
							color: SenkoClient.api.Theme.light,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/package.png"
							}
						}
					]
				});
				break;
			}
		});
	}
};