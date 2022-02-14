const Master = require("../Master.js");

/**
 * @param `user` message.author
 * @param `amount` number
 * @deprecated
*/
async function addYen(user, amount) {
    Master.addYen(user, amount);
}

/**
 * @param `user` message.author
 * @param `amount` number
 * @deprecated
 */
async function removeYen(user, amount) {
    Master.removeYen(user, amount);
}


module.exports = { addYen, removeYen };