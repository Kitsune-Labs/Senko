/**
 * @param {Interaction} interaction
 */
function hasPerm(interaction, Permission) {
    if (interaction.member.permissions.has(Permission)) return true;
    return false;
}

/**
 * @param {Interaction} interaction
 */
function selfPerm(interaction, Permission, CLientID) {
    if (interaction.guild.members.cache.get((CLientID ? CLientID : process.SenkoClient.user.id)).permissions.has(Permission)) return true;
    return false;
}

function getName(interaction) {
    return interaction.member.nickname || interaction.member.user.username;
}

module.exports = { hasPerm, selfPerm, getName };