const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {
    
    if(!args[0] || !(message.mentions.members.first() || message.guild.member(args[0]))) return message.reply(`:x: | Syntaxe : ${config.prefix}clearxp <membre (ID ou mention)>`);
    
    const member = (message.mentions.members.first() || message.guild.member(args[0]));
    const XP = config.xp;

    if(!XP[member.id]) return message.channel.send(":x: | Cet utilisateur n'a pas de statut d'expérience.");
    
    delete XP[member.id];
    client.updateXP(XP).then(() => {
        return message.channel.send(":white_check_mark: | C'est fait !");
    });
}

exports.infos = {
    permission: "MANAGE_MESSAGES",
    permissionDelete: false,
    permissionSilent: false
}