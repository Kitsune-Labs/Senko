// eslint-disable-next-line no-unused-vars
const { Interaction, MessageEmbed } = require("discord.js");

/**
 * @param {Interaction} interaction
 * @param {MessageEmbed[]} pages
 * @param {Number} timeout
 * @returns
 */
module.exports = async (interaction, pages, timeout = 120000, isEphemeral) => {
    let page = 0;

    const MessageStructure = {
        embeds: [],
        fetchReply: true,
        components: [
            {
                type: "ACTION_ROW",
                components: [
                    {
                        type: "BUTTON",
                        emoji: "<:WhiteArrow1Left:943299054568374322>",
                        style: "PRIMARY",
                        custom_id: "page_left"
                    },
                    {
                        type: "BUTTON",
                        emoji: "<:WhiteArrow1Right:943299054580928582>",
                        style: "PRIMARY",
                        custom_id: "page_right"
                    }
                ]
            }
        ]
    };

    // console.log(interaction.deferred);
    if (!interaction.deferred) await interaction.deferReply({ ephemeral: isEphemeral });

    MessageStructure.embeds[0] = pages[page];
    pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };

    const curPage = await interaction.editReply(MessageStructure);
    const filter = (i) => i.customId === "page_left" || i.customId === "page_right";
    const collector = await curPage.createMessageComponentCollector({ filter, time: timeout });

    collector.on("collect", async (i) => {
        switch (i.customId) {
            case "page_left":
                page = page > 0 ? --page : pages.length - 1;
                break;
            case "page_right":
                page = page + 1 < pages.length ? ++page : 0;
                break;
        }

        await i.deferUpdate();

        MessageStructure.embeds[0] = pages[page];
        pages[page].footer = { text: `Page ${page + 1} of ${pages.length}` };

        await i.editReply(MessageStructure);
        collector.resetTimer();
    });

    function disable() {
        MessageStructure.components[0].components[0].disabled = true;
        MessageStructure.components[0].components[1].disabled = true;

        interaction.editReply(MessageStructure);
    }

    collector.on("end", (_, reason) => {
        if (reason !== "messageDelete") {
            disable();
        }
    });

    // process.on("SIGTERM", ()=>{disable("sigterm");});
    // process.on("beforeExit", ()=>{disable("before");});
    // process.on("exit", ()=>{disable("exit");});
    // process.on("SIGINT", ()=>{disable("int");});

    return curPage;
};