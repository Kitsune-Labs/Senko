import type { SenkoCommand } from "../../types/AllTypes";
import Paginate from "../../API/Pagination/Command";

export default {
	name: "updates",
	desc: "View the latest (or previous) updates to Senko!",
	defer: true,
	ephemeral: true,
	usableAnywhere: true,
	category: "utility",
	start: async ({ senkoClient, interaction }) => {
		Paginate(interaction, [
			{
				title: "Senko v5.0.0",
				description: "I'm excited to announce the arrival of version 5! There aren't many small changes or additions in this version but it does have a big change...\n\nVersion 5 marks the day Senko has been rewritten in typescript!\n\nI have also reverted the removal of the timestamp in the deleted message embed\nAnd finally, a new domain has been created for Senko and can be found at https://senko.gg/ !\nFinally, an issue with timeout logs has also been fixed",
				color: senkoClient.api.Theme.light
			},
			{
				title: "Senko v4.3.0",
				description: "> **Senko**\nFixed a possible issue where deleted messages may not be sent to a logging channel due to the channel not being cached. > **Updated Commands**\n**/server message-logging**\nAdded advanced support to allow separate channels for deleted/edited messages\n\n**/warn**\nAn issue with warning members when no user roles were made/given should now be fixed\n\n**/whois**\nFixed an issue that would break the interaction if the user has a banner",
				color: senkoClient.api.Theme.light
			},
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
} as SenkoCommand;