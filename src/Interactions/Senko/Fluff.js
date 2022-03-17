// eslint-disable-next-line no-unused-vars
const { Client, Interaction } = require("discord.js");
// eslint-disable-next-line no-unused-vars
const Icons = require("../../Data/Icons.json");
const { updateUser, randomArray, randomNumber, addYen } = require("../../API/Master.js");

const UserInput = [
    "_USER_ strokes Senko's tail",
    "_USER_ fluffs Senko-san",
    "_USER_ caresses Senko's tail",
    "_USER_ ingulfs in Senko's fluffy tail",
    "_USER_ hugs Senko's silky tail"
];

const Responses = [
    `${Icons.flushed}  Please be more gentle with my tail!`,
    `${Icons.exclamation}  Do you have to be so verbose?`,
    `${Icons.question}  You can't stay like that forever, can you?`
];

const Sounds = [
    "euH",
    "mhMh",
    "Uya!",
    "HYaa",
    "Umu~",
    "Uya..."
];

module.exports = {
    name: "fluff",
    desc: "Mofumofu!",
    userData: true,
    /**
     * @param {Interaction} interaction
     * @param {Client} SenkoClient
     */
    // eslint-disable-next-line no-unused-vars
    start: async (SenkoClient, interaction, GuildData, { Stats }) => {
        Stats.Fluffs++;

        await updateUser(interaction.user, {
            Stats: {
                Fluffs: Stats.Fluffs
            }
        });

        const MessageStruct = {
            embeds: [
                {
                    title: `${randomArray(Sounds)}`,
                    description: `${randomArray(Responses)}\n\n*${randomArray(UserInput).replace("_USER_", interaction.user.username)}*`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    }
                }
            ],
            files: [{ attachment: `./src/Data/content/senko/${randomArray(["fluffed", "fluffed_2"])}.png`, name: "image.png" }]
        };

        if (randomNumber(100) > 75) {
            addYen(interaction.user, 10);

            MessageStruct.embeds[0].description += `\n\n— ${Icons.yen}  10x added for interaction`;
        }

        interaction.reply(MessageStruct);
    }
};