const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args) => {

    if (!message.member.voice.channel || message.member.voice.channel.id != message.guild.member(client.user).voice.channel.id)
      return message.channel.send(
        ":x: | Vous devez être dans le même salon vocal que moi pour arrêter la musique."
      );
    if (!client.queue.get(message.guild.id))
      return message.channel.send(":x: | Il n'y a pas de musique à arrêter !");
    client.queue.get(message.guild.id).songs = [];
    client.queue.get(message.guild.id).connection.dispatcher.end();
    message.react("✅");
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}