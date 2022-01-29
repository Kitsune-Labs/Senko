module.exports = {
    dark: "#4690FF",
    light: "#FFFFF9",
    blue: "#242E40",
    random: (() => {
        let RandomColors = ["#FF7C7C", "#4690FF", "#FF9933"];
        return RandomColors[Math.floor(Math.random() * RandomColors.length)];
    })
};