// eslint-disable-next-line no-unused-vars
const { Client, CommandInteraction } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { v4: uuidv4 } = require("uuid");

module.exports = {
	name: "canvas",
	desc: "canvas",
	usableAnywhere: true,
	category: "admin",
	/**
     * @param {CommandInteraction} interaction
     * @param {Client} senkoClient
     */
	start: async ({senkoClient, interaction, guildData}) => {
		const canvas = createCanvas(500, 700);
		const ctx = canvas.getContext("2d");

		ctx.fillStyle = "#303030";
		ctx.fillRect(0, 0, canvas.width, canvas.height);

		ctx.font = "30px Hack-Bold";
		ctx.rotate(0.1);
		ctx.fillText("Awesome!", 50, 100);

		// Draw line under text
		var text = ctx.measureText("Awesome!");
		ctx.strokeStyle = "rgba(0,0,0,0.5)";
		ctx.beginPath();
		ctx.lineTo(100, 500);
		ctx.lineTo(50 + text.width, 102);
		ctx.stroke();

		interaction.reply({
			ephemeral: true,
			files: [canvas.toBuffer()]
		});
	}
};