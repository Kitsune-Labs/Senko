/* eslint-disable no-useless-escape */
/**
 * @param {String} string
 */
module.exports.owoify = (string) => {
    const Faces = ["OwO", "UwU", ">w<", "^w^", ">w<", "^w^", "YwY", "AwA", ""];

    string = string
    .replaceAll(/(?:l)/g, "w")
    .replaceAll(/(?:L)/g, "W")
    .replaceAll(/\!f+/g, ` ${Faces[Math.floor(Math.random() * Faces.length)]}`)
    .replaceAll("u", "wu")
    .replaceAll("U", "Wu")
    .replaceAll("o", "w")
    .replaceAll("O", "W");

    return string;
};