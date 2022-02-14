const chalk = require("chalk");

module.exports = {
    /**
     * @param {String} Color
     * @param {String} Type
     * @param {String} content
     * @deprecated
    */
    print(Color, Type, content) {
        console.log(`[${chalk.hex(Color || "#252525").underline(Type)}]: ${content}`);
    },

    /**
     * @param {Number} time
     * @deprecated
    */
    wait(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    },

    /**
     * @param {Array} Array
     * @param {String} item
     * @deprecated
    */
    spliceArray(Array, item) {
        return Array.splice(Array.indexOf(item), 1);
    },

    /**
     * @param {String} string
     * @deprecated
     */
    stringEndsWithS(string) {
        return string.endsWith("s") ? `${string}'` : `${string}'s`;
    }
};