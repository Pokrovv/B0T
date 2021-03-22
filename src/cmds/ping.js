const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args) => {

    message.channel.send(
        new Discord.MessageEmbed()
        .setAuthor(`Pong ! I have a latency of ${Math.round(Date.now() - message.createdTimestamp)}ms.`, message.author.displayAvatarURL())
        .setFooter(`Requested by ${message.author.tag}`)
        .setTimestamp()
    ).then(msg => msg.delete({timeout:7500}));
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}