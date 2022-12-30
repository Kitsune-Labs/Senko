const { ButtonStyle } = require("discord.js");
const { fetchSupabaseApi, updateSuperUser } = require("../API/super");
const Supabase = fetchSupabaseApi();

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async Interaction => {
			if (Interaction.isButton()) {
				if (Interaction.customId.startsWith("removal:")) {
					switch (Interaction.customId.split(":")[1]) {
					case "30":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 30
						});

						for (var a of Interaction.message.components[1].components) {
							a.data.style = ButtonStyle.Primary;
							a.data.disabled = false;
						}

						Interaction.message.components[1].components[0].data.style = ButtonStyle.Success;
						Interaction.message.components[1].components[0].data.disabled = true;

						Interaction.update({
							embeds: [
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__30__** days without use.",
									color: SenkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					case "60":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 60
						});

						for (var a2 of Interaction.message.components[1].components) {
							a2.data.style = ButtonStyle.Primary;
							a2.data.disabled = false;
						}

						Interaction.message.components[1].components[1].data.style = ButtonStyle.Success;
						Interaction.message.components[1].components[1].data.disabled = true;

						Interaction.update({
							embeds: [
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__60__** days without use.",
									color: SenkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					case "365":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 365
						});

						for (var a3 of Interaction.message.components[1].components) {
							a3.data.style = ButtonStyle.Primary;
							a3.data.disabled = false;
						}

						Interaction.message.components[1].components[2].data.style = ButtonStyle.Success;
						Interaction.message.components[1].components[2].data.disabled = true;

						Interaction.update({
							embeds: [
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__365__** days without use.",
									color: SenkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					case "7777777":
						await updateSuperUser(Interaction.user, {
							DeletionDays: 7777777
						});

						for (var a4 of Interaction.message.components[1].components) {
							a4.data.style = ButtonStyle.Primary;
							a4.data.disabled = false;
						}

						Interaction.message.components[1].components[3].data.style = ButtonStyle.Success;
						Interaction.message.components[1].components[3].data.disabled = true;

						Interaction.update({
							embeds: [
								Interaction.message.embeds[0],
								{
									title: "Data Settings",
									description: "Your data will be deleted in **__7777777__** days without use.",
									color: SenkoClient.api.Theme.light
								}
							],
							components: Interaction.message.components
						});
						break;
					}
				} else {
					switch (Interaction.customId) {
					case "B0BB293E-C99E-467C-84DA-663BE1F5EF85":
						await Supabase.from("Users").delete().eq("id", Interaction.member.id);

						Interaction.update({
							embeds: [
								{
									title: "Data Removal",
									description: "🗑️  Your data has been removed",
									color: SenkoClient.api.Theme.dark,
									thumbnail: { url: "attachment://image.png" }
								}
							],
							components: [],
							ephemeral: true
						});
						break;
					}
				}
			}
		});
	}
};