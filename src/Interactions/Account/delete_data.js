module.exports = {
    name: "delete_data",
    desc: "Delete all your Account data",
    no_data: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction) => {
        const AccountEmbed = {
            title: "Data Removal",
            description: "Please confirm that you want to delete all your data.\n\n**⚠️ This is irreversible! ⚠️**",
            color: SenkoClient.colors.dark
        };

        interaction.reply({
            embeds: [AccountEmbed],
            ephemeral: true,
            components: [
                {
                    type: 1,
                    components: [
                        { type: 2, label: "I wan't to delete ALL my data and I know this is irreversible.", style: 4, custom_id: "B0BB293E-C99E-467C-84DA-663BE1F5EF85" }
                    ]
                }
            ],
            fetchReply: true
        });
    }
};