// eslint-disable-next-line no-unused-vars
const { Interaction, Permissions } = require("discord.js");

/**
 * @param {Interaction} interaction
 */
function CheckPermission(interaction, Permission, User) {
    let perms = interaction.channel.permissionsFor(User, Permission);
    const bitPermissions = new Permissions(perms.bitfield);
    const Result = bitPermissions.has([ Permissions.FLAGS[Permission] ]);

    if (Result) return true;
    return false;
}

module.exports = { CheckPermission };