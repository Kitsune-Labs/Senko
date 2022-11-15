// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const jszip = require("jszip");
const supabase = require("../API/super").fetchSupabaseApi();

module.exports = {
	name: "account",
	desc: "Account related stuff",
	options: [
		{
			name: "data",
			description: "Account data",
			type: 2,
			options: [
				{
					name: "request",
					description: "Request your account data",
					type: 1
				},
				{
					name: "delete",
					description: "Delete your account data",
					type: 1
				}
			]
		},
		{
			name: "settings",
			description: "Account settings",
			type: 1
		}
	],
	usableAnywhere: true,
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, userData}) => {
		switch (interaction.options.getSubcommand()) {
		case "request":
			await interaction.deferReply({ ephemeral: true });

			var zip = new jszip();

			zip.file("user.json", JSON.stringify(userData));

			var array = {};
			var { data } = await supabase.from("Guilds").select("*");

			for (var index in data) {
				var guild = data[index];

				for (var index2 in guild.warns) {
					var warn = guild.warns[index2];

					if (index2 == interaction.user.id || warn.moderatorId === interaction.user.id) {
						for (var warn2 of warn) {
							if (array[guild.guildId]) {
								array[guild.guildId].push(warn2);
							} else {
								array[guild.guildId] = [warn2];
							}
						}
					}
				}
			}

			if (Object.keys(array).length > 0) {
				var guilds = zip.folder("guilds");

				for (var key in array) {
					guilds.file(`${key}.json`, JSON.stringify(array[key]));
				}
			}

			zip.generateAsync({ type: "nodebuffer" }).then(async content => {
				await interaction.followUp({
					files: [{
						attachment: content,
						name: "Account_Data.zip"
					}]
				});
			});
			break;
		case "delete":
			interaction.reply({
				embeds: [
					{
						title: "Data Removal",
						description: "Please confirm that you want to delete all your data.\n\n**⚠️ This is irreversible! ⚠️**",
						color: senkoClient.api.Theme.dark,
						thumbnail: { url: "https://assets.senkosworld.com/media/senko/upset2.png" }
					}
				],
				components: [
					{
						type: 1,
						components: [
							{ type: 2, label: "I wan't to delete ALL my data and I know this is irreversible.", style: 4, custom_id: "B0BB293E-C99E-467C-84DA-663BE1F5EF85" }
						]
					}
				],
				ephemeral: true
			});
			break;
		case "settings":
			var AccountFlags = senkoClient.api.Bitfield.fromHex(userData.LocalUser.accountConfig.flags);

			var AccountEmbed = {
				title: "Account Settings",
				fields: [],
				color: senkoClient.api.Theme.light
			};

			var Components = [
				{
					type: 1,
					components: [
						{ type: 2, label: "Change Privacy", style: 3, custom_id: "user_privacy" },
						{ type: 2, label: "DM Achievements", style: 3, custom_id: "user_dm_achievements", disabled: true }
					]
				}
			];

			if (AccountFlags.get(senkoClient.api.BitData.privacy)) {
				AccountEmbed.fields.push({ name: "Private Profile", value: senkoClient.api.Icons.enabled, inline: true });
				Components[0].components[0].style = 3;
			} else {
				AccountEmbed.fields.push({ name: "Private Profile", value: senkoClient.api.Icons.disabled, inline: true });
				Components[0].components[0].style = 4;
			}

			if (AccountFlags.get(senkoClient.api.BitData.DMAchievements)) {
				AccountEmbed.fields.push({ name: "DM Achievements", value: senkoClient.api.Icons.enabled, inline: true });
				Components[0].components[1].style = 3;
			} else {
				AccountEmbed.fields.push({ name: "DM Achievements", value: senkoClient.api.Icons.disabled, inline: true });
				Components[0].components[1].style = 4;
			}

			interaction.reply({
				embeds: [AccountEmbed],
				ephemeral: true,
				components: Components
			});
			break;
		}
	}
};