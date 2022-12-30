// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction, ApplicationCommandOptionType: CommandOption } = require("discord.js");
const { Bitfield } = require("bitfields");
const _super = require("../API/super.js");

module.exports = {
	name: "flag",
	desc: "developer tool",
	options: [
		{
			name: "view",
			description: "view a flag",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "user",
					description: "user",
					type: CommandOption.User,
					required: true
				},
				{
					name: "flag",
					description: "flag",
					type: CommandOption.String,
					required: true,
					choices: [
						{
							name: "Private",
							value: "Private"
						},
						{
							name: "DMAchievements",
							value: "DMAchievements"
						},
						{
							name: "IndefiniteData",
							value: "IndefiniteData"
						}
					]
				}
			]
		},
		{
			name: "set",
			description: "set a flag",
			type: CommandOption.Subcommand,
			options: [
				{
					name: "user",
					description: "user",
					type: CommandOption.User,
					required: true
				},
				{
					name: "flag",
					description: "flag",
					type: CommandOption.String,
					required: true,
					choices: [
						{
							name: "Private",
							value: "Private"
						},
						{
							name: "DMAchievements",
							value: "DMAchievements"
						},
						{
							name: "IndefiniteData",
							value: "IndefiniteData"
						}
					]
				}
			]
		}
	],
	usableAnywhere: true,
	category: "utility",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction}) => {
		const user = interaction.options.getUser("user");
		const flag = interaction.options.getString("flag");
		const flagBit = senkoClient.api.BitData[flag];
		const userData = await _super.fetchSuperUser(user);
		if (!userData) return interaction.reply({content: `User not found ${userData}`, ephemeral: true});
		const flags = Bitfield.fromHex(userData.LocalUser.accountConfig.flags);

		switch (interaction.options.getSubcommand()) {
		case "view":
			interaction.reply({content: `Flag ${flag} is ${flags.get(flag)}`, ephemeral: true});
			break;
		case "set":
			flags.set(flagBit, !flags.get(flagBit));

			userData.LocalUser.accountConfig.flags = flags.toHex();

			await _super.updateSuperUser(user, {
				LocalUser: userData.LocalUser
			});

			interaction.reply({content: `${flag} is now ${flags.get(flagBit)}`, ephemeral: true});
			break;
		}
	}
};