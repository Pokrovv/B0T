const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {

    if (!message.member.voice.channel || message.member.voice.channel.id != message.guild.member(client.user).voice.channel.id)
      return message.channel.send(
        ':x: | Vous devez être dans le même salon vocal que moi pour mettre la musique en pause.'
      );
    if (!client.queue.get(message.guild.id))
      return message.channel.send(':x: | There\'s no music to pause!');
    if(client.queue.get(message.guild.id).connection.dispatcher.paused) 
      return message.channel.send(`:x: | Music is already paused! Use ${config.prefix}resume to resume the queue.`);
    client.queue.get(message.guild.id).connection.dispatcher.pause();
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}