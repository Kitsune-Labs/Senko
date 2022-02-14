const { spliceArray } = require("../Master.js");
const Icons = require("../../Data/Icons.json");
const RateLimitedUsers = [];

/**
 * @param {CommandInteraction} interaction
 * @param {Number} time
 * @returns true || false
 */
function rateLimit(interaction, time) {
    if (RateLimitedUsers.includes(interaction.user.id)) {
        interaction.reply({
            embeds: [
                {
                    title: `${Icons.exclamation}  Sorry, dear!`,
                    description: "I'm afraid I have to slow you down.",
                    color: "#FF6633",
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [ { attachment: "src/Data/content/senko/bummed.png", name: "image.png" }],

            ephemeral: true
        });

        return true;
    }

    RateLimitedUsers.push(interaction.user.id);

    setTimeout(() => {
        spliceArray(RateLimitedUsers, interaction.user.id);
    }, (time || 5) * 1000);
}

const { selfPerm } = require("./Guild");

function eRes({ title, description, interaction }) {
    if (!interaction) return console.error("No message given");
    if(selfPerm(interaction, "EMBED_LINKS") !== true) return interaction.reply({ content: `Please make sure I am able to use embeds!\n\n${description}` });
    if(selfPerm(interaction, "ATTACH_FILES") !== true) return interaction.reply({ content: `Please make sure I am able to use attach files!\n\n${description}` });

    const EmbedData = {
        title: (title || `${Icons.exclamation}  Oh dear, something went wrong.`),
        description: (description || "Try again later."),
        color: process.SenkoClient.colors.dark,
        thumbnail: {
            url: "attachment://image.png"
        }
    };

    const ImagesToUse = ["senko/huh.png", "senko/senko_think.png"];
    const ChosenImage = ImagesToUse[Math.floor(Math.random() * ImagesToUse.length)];

    interaction.reply({
        embeds: [EmbedData],
        files: [  { attachment:  `src/Data/content/${ChosenImage}`, name: "image.png" }],
        ephemeral: true
    });
}

module.exports = { rateLimit, eRes };