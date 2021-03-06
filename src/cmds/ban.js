const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args) => {

    let member = message.guild.member((message.mentions.users.first() || message.guild.members.cache.get(args[0])));
    if(!member) return message.reply(':x: | I can\'t find this member.')
    
    let reason = '(no reason given)';
    if(args[1]) reason = args.join(' ').slice(args[0].length + 1);
    message.guild.member(member).ban(reason).then(() => {
        message.channel.send(`**${member.user.username}** was permanently banned. | **Raison : ${reason}**`);
    });
}

exports.infos = {
    permission: 'BAN_MEMBERS',
    permissionDelete: false,
    permissionSilent: false
}