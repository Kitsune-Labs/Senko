/* eslint-disable */

const { print } = require("../API/dev/functions.js");
const Icons = require("../Data/Icons.json");
const { Client } = require("discord.js");
const math = require("../API/modules/mathjs");

module.exports = {
    /**
     * @param {Client} SenkoClient
     */
    execute: async (SenkoClient) => {
        SenkoClient.on("interactionCreate", async Interaction => {
            if (!Interaction.isSelectMenu()) return;


            switch (Interaction.values[0]) {
                case "solve_simplify":
                    var Problem = Interaction.message.embeds[0].fields[0].value;

                    try {
                        let answer = await math.simplify(Problem)

                        if (Interaction.message.embeds[0].fields[1]) {
                            Interaction.message.embeds[0].fields[1].value = `${answer}`;
                        } else {
                            Interaction.message.embeds[0].fields.push({ name: "Simplify Output", value: `${answer}`})
                        }

                        Interaction.update({
                            embeds: Interaction.message.embeds,
                            components: Interaction.message.components
                        })
                    } catch (err) {
                        if (Interaction.message.embeds[0].fields[1]) {
                            Interaction.message.embeds[0].fields[1].value = `${err}`;
                        } else {
                            Interaction.message.embeds[0].fields.push({ name: "Simplify Output", value: `${err}`})
                        }

                        Interaction.update(Interaction.message)
                    }
                break;

                case "solve_derivative":
                    var Problem = Interaction.message.embeds[0].fields[0].value.slice(1, -1);

                    try {
                        let answer = await math.derivative(Problem, { x: 4 })

                        if (Interaction.message.embeds[0].fields[1]) {
                            Interaction.message.embeds[0].fields[1].value = `${answer}`;
                        } else {
                            Interaction.message.embeds[0].fields.push({ name: "Derivative Output", value: `${answer}`})
                        }

                        Interaction.update({
                            embeds: Interaction.message.embeds,
                            components: Interaction.message.components
                        })
                    } catch (err) {
                        if (Interaction.message.embeds[0].fields[1]) {
                            Interaction.message.embeds[0].fields[1].value = `${err}`;
                        } else {
                            Interaction.message.embeds[0].fields.push({ name: "Derivative Output", value: `${err}`})
                        }

                        Interaction.update(Interaction.message)
                    }
                break
            }
        });
    }
};