const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {

    if (!message.member.voice.channel || message.member.voice.channel.id != message.guild.member(client.user).voice.channel.id)
      return message.channel.send(
        ":x: | Vous devez être dans le même salon vocal que moi pour passer la musique."
      );
    if (!args[0] || isNaN(args[0]))
      return message.channel.send(`:x: | Syntaxe : ${config.prefix}volume <nombre entre 0 et 10>`);
    client.setVolume(args[0], message.guild.id);
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}