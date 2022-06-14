module.exports = {
	/**
     * @param {Client} SenkoClient
     */
	execute: async (SenkoClient) => {
		const FireStoreAdmin = require("firebase-admin");
		const FireStore = FireStoreAdmin.firestore();

		SenkoClient.on("interactionCreate", async Interaction => {
			if (Interaction.isButton()) {
				switch (Interaction.customId) {
				case "B0BB293E-C99E-467C-84DA-663BE1F5EF85":
					console.log(Interaction.member.id);

					FireStore.collection("Users").doc(Interaction.member.id).delete().then(() => {
						Interaction.update({
							embeds: [
								{
									title: "Data Removal",
									description: "🗑️  Your data has been removed",
									color: SenkoClient.colors.dark,
									thumbnail: { url: "attachment://image.png" }
								}
							],
							components: [],
							ephemeral: true
						});
					}).catch(err => {
						console.log(err);

						Interaction.update({
							embeds: [
								{
									title: "Data Removal",
									description: "⚠️  There was an issue removing your data",
									color: SenkoClient.colors.dark,
									thumbnail: { url: "attachment://image.png" }
								}
							],
							components: [],
							ephemeral: true
						});
					});
					break;
				}
			}
		});
	}
};