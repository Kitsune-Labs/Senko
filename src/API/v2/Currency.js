const config = require("../../Data/DataConfig.json");
const { getData, updateUser } = require("./FireData.js");

/**
 * @param `user` message.author
 * @param `amount` number
*/
async function addYen(user, amount) {
    let Data = await getData(user);

    updateUser(user, {
        Currency: {
            Yen: Data.Currency.Yen + (amount * config.multiplier)
        }
    });
}

/**
 * @param `user` message.author
 * @param `amount` number
 */
async function removeYen(user, amount) {
    let Data = await getData(user);

    updateUser(user, {
        Currency: {
            Yen: Data.Currency.Yen - amount
        }
    });
}


module.exports = { addYen, removeYen };