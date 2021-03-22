const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args, config) => {
    let messageID = args[0];
    let emoji = args[1];
    let role = (message.mentions.roles.first() || message.guild.roles.cache.get(args[2]));
    if(!args[2] || isNaN(messageID) || messageID.length > "000000000000000000".length || !role) return message.reply(`:x: | Syntaxe : ${config.prefix}catpcha <ID du message> <emoji (avec un '\\' devant)> <rôle (id ou mention)>`);

    let msg = await message.channel.messages.cache.get(messageID) || undefined;
    if(!msg || msg == undefined) return message.reply(`:x: | L'argument 'message' n'est pas bon (le message doit avoir été envoyé après le dernier lancement du bot). Réessayez après avoir envoyé à nouveau le même message.`);

    message.delete();
    let b = false;
    msg.react(emoji).then((r) => {
        emoji = r.emoji instanceof Discord.GuildEmoji?r.emoji.id:r.emoji.identifier;
        let rr = client.rr;
        rr[msg.id] = {
            "emoji": emoji,
            "role": role.id
        }
        client.updateRR(rr).then(() => {
            message.reply(":white_check_mark: | Et voilà !").then((messagee)=>messagee.delete({timeout:7500}))
        }).catch((ex) => message.reply(`:x: | Une erreur est survenue : \n${ex.stack || ex}`));
    }).catch((ex) => message.reply(`:x: | Une erreur est survenue : \n${ex.stack || ex}`));
}

exports.infos = {
    permission: "MANAGE_MESSAGES",
    permissionDelete: false,
    permissionSilent: false
}