// eslint-disable-next-line no-unused-vars
const { CommandInteraction, Client } = require("discord.js");
const DiscordModal = require("discord-modal");

module.exports = {
    name: "submit-dev",
    desc: "Submit feedback",
    options: [
        {
            name: "suggestion",
            description: "Want something added, changed, or removed? Message us!",
            type: 1
        },
        {
            name: "issue",
            description: "Have an issue? We want to hear about it!",
            type: 1
        }
    ],
    defaultPermission: false,
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} SenkoClient
     */
    start: async (SenkoClient, interaction) => {
        const Command = interaction.options.getSubcommand();

        switch (Command) {
            case "suggestion":
                var textinput = new DiscordModal.TextInput()
                .setCustomId("submit_suggestion")
                .setTitle("Submit a Suggestion")
                .addComponents(
                    new DiscordModal.TextInputField()
                    .setLabel("What would you like to suggest?")
                    .setStyle("paragraph")
                    .setCustomId("submit_text")
                    .setPlaceholder("Type your suggestion here")
                );

               SenkoClient.TextInputs.open(interaction, textinput);
            break;
        }
    }
};