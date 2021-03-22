const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {
    
    if(!args[0]) return message.reply(`:x: | Syntaxe: ${config.prefix}unban <membre (ID ou mention)> [<raison>]`);

    let target = args[0].replace("<@", "").replace(">","").replace("!","");
    if(!/^\d+$/.test(target) || target.length != client.user.id.length) {
        return message.reply(`:x: | Syntaxe: ${config.prefix}unban <membre (ID ou mention)> [<raison>]`);
    }

    message.guild.fetchBans().then(bans => {
        let banInfo;

        bans.forEach(bi => banInfo=(bi.user.id === target)?bi:undefined);
    
        if(!banInfo) return message.reply(`:x: | Ce membre n'est pas actuellement banni. (Syntaxe: ${config.prefix}unban <membre (ID ou mention)> [<raison>])`);
    
        let reason = "(Aucune raison spécifiée)";
        if(args[1]) {
            args.shift();
            reason = args.join(' ');
        }
        message.guild.members.unban(banInfo.user, reason).then(message.channel.send(`**${banInfo.user.tag}** a été débanni avec succès ! | **Raison : ${reason}**`));
    });
}

exports.infos = {
    permission: "BAN_MEMBERS",
    permissionDelete: false,
    permissionSilent: false
}