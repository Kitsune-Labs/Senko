const { MessageAttachment } = require("discord.js");
const { rateLimit } = require("../../API/v4/InteractionFunctions.js");
const Icons = require("../../Data/Icons.json");
const { updateUser } = require("../../API/Master.js");

const Reactions = {
    User: [
        "strokes Senko's tail",
        "fluffs Senko",
        "caresses Senko's tail",
        "ingulfs in Senko's fluffy tail",
        "hugs Senko's silky tail"
    ],

    Senko: [
        "euH", "mhMh", "Uya!", "Uh-Uya!", "HYaa", "UYAAA!", "Umu~", "Uya..."
    ],

    say: [
        "Please be more gentle to my tail!",
        "Do you have to be so verbose?",
        "You can't stay like that forever, can you?"
    ]
};

module.exports = {
    name: "fluff",
    desc: "Mofumofu!",
    userData: true,
    /**
     * @param {CommandInteraction} interaction
     */
    start: async (SenkoClient, interaction, GuildData, { Stats }) => {
        // if (Stats.Fluffs >= 10) awardAchievement(interaction.user, "NewFloofer");
        // if (Stats.Fluffs >= 50) awardAchievement(interaction.user, "AdeptFloofer");
        // if (Stats.Fluffs >= 100) awardAchievement(interaction.user, "MasterFloofer");

        const Images = ["fluffed", "fluffed_2"];

        if (rateLimit(interaction, 1)) return;
        Stats.Fluffs++;

        await updateUser(interaction.user, {
            Stats: {
                Fluffs: Stats.Fluffs
            }
        });

        interaction.reply({
            embeds: [
                {
                    title: `${Icons.tail1} ${Reactions.Senko[Math.floor(Math.random() * Reactions.Senko.length)]}`,
                    description: `${interaction.member.nickname || interaction.user.username} ${Reactions.User[Math.floor(Math.random() * Reactions.User.length)]}\n\n${Reactions.say[Math.floor(Math.random() * Reactions.say.length)]}`,
                    color: SenkoClient.colors.light,
                    thumbnail: {
                        url: "attachment://image.png"
                    },
                    footer: {
                        text: `You've fluffed my tail ${Stats.Fluffs} times.`
                    }
                }
            ],
            files: [new MessageAttachment(`src/Data/content/senko/${Images[Math.floor(Math.random() * Images.length)]}.png`, "image.png")]
        });
    }
};