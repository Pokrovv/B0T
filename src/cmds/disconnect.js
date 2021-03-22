const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args) => {

    if (!message.member.voice.channel || message.member.voice.channel.id != message.guild.member(client.user).voice.channel.id)
      return message.channel.send(
        ':x: | You must be in the same voice channel as the bot to disconnect it.'
      );
    if (!client.queue.get(message.guild.id))
      return message.channel.send(":x: | There's no music to stop !");
    client.queue.get(message.guild.id).songs = [];
    client.queue.get(message.guild.id).connection.dispatcher.end();
    message.guild.member(client.user).voice.connection.disconnect();
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}