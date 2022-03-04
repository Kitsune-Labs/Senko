/**
 * @param {String} string
 */
module.exports.owoify = (string) => {
    const Faces = ["OwO", "UwU", ">w<", "^w^", ">w<", "^w^", "YwY", "AwA", ""];

    // eslint-disable-next-line no-useless-escape
    return string.replace(/(?:l)/g, "w").replace(/(?:L)/g, "W").replace(/\!+/g, ` ${Faces[Math.floor(Math.random() * Faces.length)]}`);
};