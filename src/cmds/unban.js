const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {
    
    if(!args[0]) return message.reply(`:x: | Syntax: ${config.prefix}unban <membre (ID or mention)> [<reason>]`);

    let target = args[0].replace('<@', '').replace('>','').replace('!','');
    if(!/^\d+$/.test(target) || target.length != client.user.id.length) {
        return message.reply(`:x: | Syntax: ${config.prefix}unban <member (ID or mention)> [<reason>]`);
    }

    message.guild.fetchBans().then(bans => {
        let banInfo;

        bans.forEach(bi => banInfo=(bi.user.id === target)?bi:undefined);
    
        if(!banInfo) return message.reply(`:x: | This member is not currently banned. (Syntax: ${config.prefix}unban <member (ID or mention)> [<reason>])`);
    
        let reason = '(no reason given)';
        if(args[1]) {
            args.shift();
            reason = args.join(' ');
        }
        message.guild.members.unban(banInfo.user, reason).then(message.channel.send(`**${banInfo.user.tag}** has successfully been unbanned ! | **Reason : ${reason}**`));
    });
}

exports.infos = {
    permission: 'BAN_MEMBERS',
    permissionDelete: false,
    permissionSilent: false
}