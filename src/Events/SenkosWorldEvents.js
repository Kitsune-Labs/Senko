// eslint-disable-next-line no-unused-vars
const { Client } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const { print } = require("../API/Master.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../Data/Icons.json");
const config = require("../Data/DataConfig.json");
const VoteList = new Map();

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	// eslint-disable-next-line no-unused-vars
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async interaction => {
			if (interaction.isButton()) {
				switch (interaction.customId) {
				case "upvote_suggestion":
					if (VoteList.has(interaction.message.id) && await VoteList.get(interaction.message.id).users.includes(interaction.user.id)) return interaction.reply({ content: "🗿", ephemeral: true });

					interaction.message.embeds[0].fields[0].value = `${interaction.message.embeds[0].fields[0].value.split("\n")[0]}\n${parseInt(interaction.message.embeds[0].fields[0].value.split("\n")[1]) + 1}\`\`\``;

					if (VoteList.has(interaction.message.id)) {
						const Users = await VoteList.get(interaction.message.id).users;
						Users.push(interaction.user.id);

						VoteList.set(interaction.message.id, { users: Users });
					} else {
						VoteList.set(interaction.message.id, { users: new Array([interaction.user.id]) });
					}

					interaction.update({
						embeds: [interaction.message.embeds[0]]
					});
					break;
				case "downvote_suggestion":
					if (VoteList.has(interaction.message.id) && await VoteList.get(interaction.message.id).users.includes(interaction.user.id)) return interaction.reply({ content: "🗿", ephemeral: true });
					interaction.message.embeds[0].fields[1].value = `${interaction.message.embeds[0].fields[1].value.split("\n")[0]}\n${parseInt(interaction.message.embeds[0].fields[1].value.split("\n")[1]) + 1}\`\`\``;

					if (VoteList.has(interaction.message.id)) {
						const Users = await VoteList.get(interaction.message.id).users;
						Users.push(interaction.user.id);

						VoteList.set(interaction.message.id, { users: Users });
					} else {
						VoteList.set(interaction.message.id, { users: new Array([interaction.user.id]) });
					}

					interaction.update({
						embeds: [interaction.message.embeds[0]]
					});
					break;
				case "suggestion_voters":
					interaction.reply({
						embeds: [
							{
								title: "Suggestion Voters",
								description: `${VoteList.has(interaction.message.id) ? VoteList.get(interaction.message.id).users.map(user => `<@${user}>`).join("\n") : "No one has voted yet!"}`
							}
						],
						ephemeral: true
					});
					break;
				case "senko_color":
					if (interaction.member.roles.cache.has("777257201219403816")) {
						await interaction.member.roles.remove("777257201219403816");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777257201219403816> from your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777257201219403816");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777257201219403816> to your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "shiro_color":
					if (interaction.member.roles.cache.has("777257276033597441")) {
						await interaction.member.roles.remove("777257276033597441");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777257276033597441> from your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777257276033597441");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777257276033597441> to your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "suzu_color":
					if (interaction.member.roles.cache.has("777259097632407552")) {
						await interaction.member.roles.remove("777259097632407552");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777259097632407552> from your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777259097632407552");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777259097632407552> to your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "sora_color":
					if (interaction.member.roles.cache.has("777259001548111923")) {
						await interaction.member.roles.remove("777259001548111923");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777259001548111923> from your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777259001548111923");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777259001548111923> to your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "Koenji_color":
					if (interaction.member.roles.cache.has("777645674492854322")) {
						await interaction.member.roles.remove("777645674492854322");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777645674492854322> from your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777645674492854322");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777645674492854322> to your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "Nakano_color":
					if (interaction.member.roles.cache.has("777645607585185793")) {
						await interaction.member.roles.remove("777645607585185793");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777645607585185793> from your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777645607585185793");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777645607585185793> to your roles",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;


				case "sw_announcements":
					if (interaction.member.roles.cache.has("777656121430376448")) {
						await interaction.member.roles.remove("777656121430376448");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777656121430376448> from your roles\n\nYou will no longer receive pings for announcements",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777656121430376448");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777656121430376448> to your roles\n\nYou will now receive pings for announcements",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "sw_news":
					if (interaction.member.roles.cache.has("777656183703076885")) {
						await interaction.member.roles.remove("777656183703076885");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777656183703076885> from your roles\n\nYou will no longer receive pings for community news",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777656183703076885");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777656183703076885> to your roles\n\nYou will now receive pings for community news",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "sw_events":
					if (interaction.member.roles.cache.has("777656896852328450")) {
						await interaction.member.roles.remove("777656896852328450");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&777656896852328450> from your roles\n\nYou will no longer receive pings for community events",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("777656896852328450");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&777656896852328450> to your roles\n\nYou will now receive pings for community events",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "sw_manga":
					if (interaction.member.roles.cache.has("885714280073297931")) {
						await interaction.member.roles.remove("885714280073297931");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&885714280073297931> from your roles\n\nYou will no longer receive pings for new Senko manga releases",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("885714280073297931");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&885714280073297931> to your roles\n\nYou will now receive pings for new Senko manga releases",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;


				case "sw_senkos-lab":
					if (interaction.member.roles.cache.has("939235387681947728")) {
						await interaction.member.roles.remove("939235387681947728");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&939235387681947728> from your roles\n\nI wish you didn't have to leave",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("939235387681947728");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&939235387681947728> to your roles\n\nYou can now view my lab",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;

				case "sw_senkodates":
					if (interaction.member.roles.cache.has("962822738349813831")) {
						await interaction.member.roles.remove("962822738349813831");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&962822738349813831> from your roles\n\nYou will no longer receive pings when I get updated",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("962822738349813831");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&962822738349813831> to your roles\n\nYou will now receive pings when I get updated",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;
				case "mc_server":
					if (interaction.member.roles.cache.has("972564820589162557")) {
						await interaction.member.roles.remove("972564820589162557");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role removed`,
									description: "I've removed <@&972564820589162557> from your roles\n\nYou will no longer receive MC Server pings",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					} else {
						await interaction.member.roles.add("972564820589162557");

						interaction.reply({
							embeds: [
								{
									title: `${Icons.check}  Role added`,
									description: "I've added <@&972564820589162557> to your roles\n\nYou will now receive MC Server pings",
									color: SenkoClient.colors.light,
									thumbnail: { url: "https://assets.senkosworld.com/media/senko/package.png" }
								}
							],
							ephemeral: true
						});
					}
					break;
				case "sw_expanded_rules":
					interaction.reply({
						embeds: [
							{
								color: SenkoClient.colors.dark_red,
								title: "Expanded Guidelines",
								description: "**Politics**\nDo not talk about any non-fictional politics.\nYou may talk about politics in <#992340185259978834> as long as it is civil.\n\n**Drug Content**\nDo not post or talk about illegal drug related content"
							}
						],
						ephemeral: true
					});
					break;
				}
			}
		});
	}
};