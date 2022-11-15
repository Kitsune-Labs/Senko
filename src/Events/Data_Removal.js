const { fetchSupabaseApi } = require("../API/super");

const Supabase = fetchSupabaseApi();

module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		SenkoClient.on("interactionCreate", async Interaction => {
			if (Interaction.isButton()) {
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
		});
	}
};