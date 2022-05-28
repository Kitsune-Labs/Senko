const { randomArray } = require("../../API/Master");

module.exports = {
    dark: "#FF6633", // DARK
    light: "#FF9933", // LIGHT
    blue: "#242E40", // BLUE
    light_red: "#e70034",
    dark_red: "#b5011e",
    random: (() => {
        let RandomColors = ["#FF6633", "#FF9933"];
        return RandomColors[Math.floor(Math.random() * RandomColors.length)];
    })
};