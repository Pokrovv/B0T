const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args) => {

    if (!message.member.voice.channel || message.member.voice.channel.id != message.guild.member(client.user).voice.channel.id)
      return message.channel.send(
        ':x: | You must be in the same voice channel as me to skip the queue.'
      );
    if (!client.queue.get(message.guild.id))
      return message.channel.send(':x: | There\'s no music to skip.');
    client.queue.get(message.guild.id).connection.dispatcher.end();
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}