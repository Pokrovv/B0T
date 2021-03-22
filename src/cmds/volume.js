const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {

    if (!message.member.voice.channel || message.member.voice.channel.id != message.guild.member(client.user).voice.channel.id)
      return message.channel.send(
        ':x: | You must be in the same voice channel as me to edit the current volume.'
      );
    if (!args[0] || isNaN(args[0]))
      return message.channel.send(`:x: | Syntax: ${config.prefix}volume <number between 0 and 10>`);
    client.setVolume(args[0], message.guild.id);
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}