const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {
    const xp = config.xp
    if((!config.xp[message.author.id])) {
        xp[message.author.id] = {
            xp: 0,
            level: 0,
            lastXpTime: Date.now()
        };
        client.updateXP(xp);
    }
    message.reply(`vous êtes au niveau ${xp[message.author.id].level} (${xp[message.author.id].xp}XP en tout) - ${xp[message.author.id].xp-(xp[message.author.id].level*250)}/250XP pour passer au niveau suivant !`)
    return;
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}