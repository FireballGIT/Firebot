const permissions = require("../config/permissions.json");

/**
 * @param {GuildMember} member
 * @returns {number}
 */

function getPermissionLevel(member) {
    let level = 0;

    member.roles.cache.forEach(role => {
        if (permissions[role.name] !== undefined) {
            if (permissions[role.name] > level) {
                level = permissions[role.name];
            }
        }
    });

    return level;
}

/**
 * @param {GuildMember} member
 * @param {string} requiredRole
 * @returns {boolean}
 */

function hasPermission(member, requiredRole) {
    const requiredLevel = permissions[requiredRole];

    if (requiredLevel === undefined) return false;

    const memberLevel = getPermissionLevel(member);
    return memberLevel >= requiredLevel;
}

module.exports = {
    getPermissionLevel,
    hasPermission
}