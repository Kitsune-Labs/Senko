/**
 * @param {Interaction} interaction
 * @deprecated
 */
function hasPerm(interaction, Permission) {
    if (interaction.member.permissions.has(Permission)) return true;
    return false;
}

/**
 * @param {Interaction} interaction
 * @deprecated
 */
function selfPerm(interaction, Permission, CLientID) {
    if (interaction.guild.members.cache.get((CLientID ? CLientID : process.SenkoClient.user.id)).permissions.has(Permission)) return true;
    return false;
}

/**
 * @deprecated
 */
function getName(interaction) {
    return interaction.member.nickname || interaction.member.user.username;
}

module.exports = { hasPerm, selfPerm, getName };