const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args) => {

    let member = (message.guild.member(message.mentions.users.first() || message.guild.members.cache.get(args[0])));
    if(!member) return message.reply(":x: | Veuillez préciser un membre **valide**.")

    let reason = args.join(' ').slice(args[0].length + 1)
    if(!reason) return message.reply(":x: | Veuillez spécifier une raison.")

    message.guild.member(member).kick(reason).then(() => {
        message.channel.send(`**${member.user.username}** a été expulsé avec succès | **Raison : ${reason}** !`);
    });
}

exports.infos = {
    permission: "KICK_MEMBERS",
    permissionDelete: false,
    permissionSilent: false
}