const DataConfig = require("../Data/DataConfig.json");
const { CheckPermission, print } = require("../API/Master");
const { fetchSuperGuild, fetchConfig, fetchSuperUser } = require("../API/super.js");
const Icons = require("../Data/Icons.json");

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		/**
         * @type {import("discord.js").InteractionCollector}
         */
		SenkoClient.on("interactionCreate", async (interaction) => {
			if (!interaction.isCommand() || interaction.user.bot || interaction.replied || !interaction.guild) return;
			const dataConfig = await fetchConfig();

			dataConfig.OutlawedUsers = JSON.parse(dataConfig.OutlawedUsers);

			if (dataConfig.OutlawedUsers[interaction.member.id]) return interaction.reply({
				embeds: [
					{
						title: `${Icons.exclamation} You are outlawed!`,
						description: `${dataConfig.OutlawedUsers[interaction.member.id]}\n\nThere is no mistake.`,
						color: SenkoClient.colors.dark_red,
						thumbnail: {
							url: "attachment://image.png"
						}
					}
				],
				ephemeral: true,
				files: [{ attachment: "./src/Data/content/senko/pout.png", name: "image.png" }]
			});

			const InteractionCommand = SenkoClient.SlashCommands.get(interaction.commandName);
			const superGuildData = await fetchSuperGuild(interaction.guild);
			const AccountData = await fetchSuperUser(interaction.user);

			if (!InteractionCommand) return interaction.reply({embeds:[{title:"Woops!", description:`I can't seem to find "${interaction.commandName}", I will attempt to find it for you, come talk to me in a few minutes!`, color:SenkoClient.colors.dark, thumbnail:{url:"attachment://image.png"}}], ephemeral:true, files:[{attachment:"./src/Data/content/senko/heh.png", name:"image.png"}]});

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
						color: SenkoClient.colors.dark
					}
				],
				ephemeral: true
			};

			const permissionMessage = {
				content: "Oh dear...\n\nIt looks like im missing some permissions, here is what I am missing:\n\n",
				ephemeral: true
			};

			for (var permission of DataConfig.clientPermissions) {
				if (!CheckPermission(interaction, permission)) {
					permissionEmbed.embeds[0].description += `${permission}\n`;
					permissionMessage.content += `${permission}\n`;
				}
			}

			if (!permissionEmbed.embeds[0].description.endsWith("\n")) {
				if (CheckPermission(interaction, "EMBED_LINKS")) return interaction.reply(permissionEmbed);
				return interaction.reply(permissionMessage);
			}

			if (superGuildData.Channels.length > 0 && !superGuildData.Channels.includes(interaction.channelId) && !InteractionCommand.usableAnywhere) {
				var messageStruct1 = {
					embeds: [
						{
							title: "S-Sorry dear!",
							description: `${interaction.guild.name} has requested you use ${superGuildData.Channels.map(i=>`<#${i}>`)}!`,
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: "attachment://image.png"
							}
						}
					],
					ephemeral: true,
					files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }]
				};

				await interaction.deferReply({ ephemeral: true });
				return interaction.followUp(messageStruct1);
			}

			print("teal", "CS", interaction.commandName);

			InteractionCommand.start(SenkoClient, interaction, superGuildData, AccountData).catch(e => {
				const messageStruct = {
					embeds: [
						{
							title: "Woops!",
							description: `I seem to have dropped ${InteractionCommand.name}, I will attempt to fix it please come back soon!`,
							color: SenkoClient.colors.dark,
							thumbnail: {
								url: "attachment://image.png"
							}
						}
					],
					ephemeral: true,
					files: [{ attachment: "./src/Data/content/senko/heh.png", name: "image.png" }]
				};

				if (interaction.deferred) {
					interaction.followUp(messageStruct);
				} else {
					interaction.reply(messageStruct);
				}

				print("red", "ERROR", `${interaction.commandName} failed!`);

				console.log(e);
			});
		});
	}
};