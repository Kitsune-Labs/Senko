// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const Paginate = require("../../API/Pagination/Main");

module.exports = {
	name: "updates",
	desc: "View the latest (or previous) updates to Senko!",
	defer: true,
	ephemeral: true,
	usableAnywhere: true,
	category: "utility",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction}) => {
		Paginate(interaction, [
			{
				title: "Senko v4.1.3",
				description: "__**Senko**__\n— Updated French translations for /fluff\n— Updated ban embed for manual bans to match Senko's /ban command\n— Fixed issues where buttons wouldn't work properly\n\n__**Updated Commands**__\n> **/account**\n— Added support for data retention days until deletion. If you need special access to keep your data forever, contact me in the [Community Server](https://discord.gg/senko)\n\n**",
				color: senkoClient.api.Theme.light
			},
			{
				title: "Senko v4.1.0",
				description: "__**Senko**__\n— Senko is testing some different language support for some commands (/ban is in English and Français)\n\n__**Updated Commands**__\n> **/ban**\n— Command has been revamped\n\n__**New Commands**__\n**/updates**\n— You can now view the latest (or previous) updates with this command through the bot!",
				color: senkoClient.api.Theme.light
			},
			{
				title: "Senko v4.0.1",
				description: "__**Senko**__\n— Fixed breaking issues with 4.0.0",
				color: senkoClient.api.Theme.light
			},
			{
				title: "Senko v4.0.0",
				description: "__**Senko**__\n— The backend logging system has had an upgrade which will make it easier to find and fix bugs!\n— Senko has been moved to better hardware! This means she should respond faster!\n\n__**New Commands**__\n> **/account <data, settings>**\n— Request, delete your data, or change your account settings with this new command!\n> **/profile-settings**\n— Gone are the days of having to do /config title or /config banner, now you can simply use /profile-settings and click a button to edit your profile card!\n> **/claim weekley**\n— Fixed a bug where it would only give you 130 yen\n— Now weekly gives you 200+ more (instead of 100+ more) than doing /claim daily 7 times!\n\n__**Updated Commands**__\n> **/server**\n — Revamped the command to be easier to use\n\n__**Removed Commands**__\n> **/config**, **/about-me**, **/delete <data>**\n— Replaced with a newer easier to use command",
				color: senkoClient.api.Theme.light
			}
		], 60000, true);
	}
};