// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { updateUser, randomArray, randomNumber, addYen } = require("../../API/Master");

const Responses = [
    `${Icons.flushed}`,
    "You're so spoiled!"
];

const Sounds = [
    "Umu~",
    "Uya",
    "Uyaan"
];

module.exports = {
    name: "smile",
    desc: ":)",
    userData: true,
    defer: true,
    /**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, { RateLimits, Stats }) => {
        Stats.Smiles++;

        await updateUser(interaction.user, {
            Stats: {
                Smiles: Stats.Smiles
            }
        });

        const MessageStruct = {
            embeds: [
                {
                    title: `${randomArray(Sounds)}`,
                    description: `${randomArray(Responses)}`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: `./src/Data/content/senko/${randomArray(["smile", "happy"])}.png`, name: "image.png" }]
        };

        if (randomNumber(100) > 75) {
            addYen(interaction.user, 5);

            MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  5x added for interaction`;
        }

        interaction.followUp(MessageStruct);
    }
};