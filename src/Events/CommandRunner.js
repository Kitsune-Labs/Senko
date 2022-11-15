const DataConfig = require("../Data/DataConfig.json");
const { print, error } = require("@kitsune-labs/utilities");


const { CheckPermission } = require("../API/Master");
const { fetchSuperGuild, fetchConfig, fetchSuperUser, updateSuperUser } = require("../API/super.js");
const Icons = require("../Data/Icons.json");
const { InteractionType } = require("discord.js");
const { randomNumber } = require("@kitsune-labs/utilities");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		/**
         * @type {import("discord.js").InteractionCollector}
         */
		SenkoClient.on("interactionCreate", async (interaction) => {
			if (interaction.type !== InteractionType.ApplicationCommand || interaction.user.bot || interaction.replied || !interaction.guild) return;
			const dataConfig = await fetchConfig();

			dataConfig.OutlawedUsers = JSON.parse(dataConfig.OutlawedUsers);

			if (dataConfig.OutlawedUsers[interaction.member.id]) return interaction.reply({
				embeds: [
					{
						title: `${Icons.exclamation} You are outlawed!`,
						description: `${dataConfig.OutlawedUsers[interaction.member.id]}\n\nThere is no mistake.`,
						color: SenkoClient.api.Theme.dark_red,
						thumbnail: {
							url: "https://assets.senkosworld.com/media/senko/pout.png"
						}
					}
				],
				ephemeral: true
			});

			const InteractionCommand = SenkoClient.api.Commands.get(interaction.commandName);
			const superGuildData = await fetchSuperGuild(interaction.guild);
			const accountData = await fetchSuperUser(interaction.user);

			if (!InteractionCommand) return interaction.reply({embeds:[{title:"Woops!", description:`I can't seem to find "${interaction.commandName}", I will attempt to find it for you, come talk to me in a few minutes!`, color:SenkoClient.api.Theme.dark, thumbnail:{url:"https://assets.senkosworld.com/media/senko/heh.png"}}], ephemeral:true});

			if (InteractionCommand.defer){
				if(InteractionCommand.ephemeral&&InteractionCommand.ephemeral===true){
					await interaction.deferReply({ephemeral:true});
				} else {
					await interaction.deferReply();
				}
			}

			const permissionEmbed = {
				embeds: [
					{
						title: "Oh dear...",
						description: "It looks like im missing some permissions, here is what I am missing:\n\n",
						color: SenkoClient.api.Theme.dark
					}
				],
				ephemeral: true
			};

			const permissionMessage = {
				content: "Oh dear...\n\nIt looks like im missing some permissions, here is what I am missing:\n\n",
				ephemeral: true
			};

			for (var permission of DataConfig.clientPermissions) {
				if (!CheckPermission(interaction.guild, permission)) {
					permissionEmbed.embeds[0].description += `${permission}\n`;
					permissionMessage.content += `${permission}\n`;
				}
			}

			if (!permissionEmbed.embeds[0].description.endsWith("\n")) {
				if (CheckPermission(interaction.guild, "EmbedLinks")) return interaction.reply(permissionEmbed);
				return interaction.reply(permissionMessage);
			}

			if (superGuildData.Channels.length > 0 && !superGuildData.Channels.includes(interaction.channelId) && !InteractionCommand.usableAnywhere) {
				var messageStruct1 = {
					embeds: [
						{
							title: "S-Sorry dear!",
							description: `${interaction.guild.name} has requested you use ${superGuildData.Channels.map(i=>`<#${i}>`)}!`,
							color: SenkoClient.api.Theme.dark,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/heh.png"
							}
						}
					],
					ephemeral: true
				};

				await interaction.deferReply({ ephemeral: true });
				return interaction.followUp(messageStruct1);
			}

			print("#fc844c", "CS", interaction.commandName);

			//! Start level
			let xp = accountData.LocalUser.accountConfig.level.xp;
			let level = accountData.LocalUser.accountConfig.level.level;
			const Amount = 300 * (level * 5);

			if (xp > Amount) {
				level += Math.floor(xp / Amount);
				xp = xp % Amount;
			} else {
				xp = xp + randomNumber(25);
			}

			if (level > accountData.LocalUser.accountConfig.level.level) {
				interaction.channel.send({
					content: `${interaction.user}`,
					embeds: [
						{
							title: "Congratulations dear!",
							description: `You are now level **${level}**`,
							color: SenkoClient.api.Theme.light,
							thumbnail: {
								url: interaction.user.displayAvatarURL()
							}
						}
					]
				});
			}

			accountData.LocalUser.accountConfig.level.xp = xp;
			accountData.LocalUser.accountConfig.level.level = level;

			updateSuperUser(interaction.user, {
				LocalUser: accountData.LocalUser
			});

			//! End level

			updateSuperUser(interaction.user, {
				LastUsed: new Date().toISOString()
			});

			InteractionCommand.start({
				senkoClient: SenkoClient,
				interaction: interaction,
				guildData: superGuildData,
				userData: accountData,
				xpAmount: Amount
			}).catch(err => {
				const messageStruct = {
					embeds: [
						{
							title: "Woops!",
							description: `I seem to have dropped ${InteractionCommand.name}, I will attempt to fix it please come back soon!`,
							color: SenkoClient.api.Theme.dark,
							thumbnail: {
								url: "https://assets.senkosworld.com/media/senko/heh.png"
							}
						}
					],
					ephemeral: true
				};

				if (interaction.deferred) {
					interaction.followUp(messageStruct);
				} else {
					interaction.reply(messageStruct);
				}

				error(err);

				SenkoClient.api.statusLog.send({
					content: "<@609097445825052701>",
					embeds: [
						{
							title: "Senko - Command Error",
							description: JSON.stringify(err),
							color: SenkoClient.api.Theme.light
						}
					]
				});
			});
		});
	}
};