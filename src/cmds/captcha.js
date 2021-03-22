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
    if(!args[2] || isNaN(messageID) || messageID.length > '000000000000000000'.length || !role) return message.reply(`:x: | Syntax : ${config.prefix}catpcha <message id> <emoji (with a '\\' before)> <role (id or mention)>`);

    let msg = await message.channel.messages.cache.get(messageID) || undefined;
    if(!msg || msg == undefined) return message.reply(`:x: | The 'message' argument is not matching the format (it must have been sent AFTER the last bot start). Retry after sending the same message again.`);

    message.delete();
    let b = false;
    msg.react(emoji).then((r) => {
        emoji = r.emoji instanceof Discord.GuildEmoji?r.emoji.id:r.emoji.identifier;
        let rr = client.rr;
        rr[msg.id] = {
            'emoji': emoji,
            'role': role.id
        }
        client.updateRR(rr).then(() => {
            message.reply(':white_check_mark: | Here we go !').then((messagee)=>messagee.delete({timeout:7500}))
        }).catch((ex) => message.reply(`:x: | An error occured : \n${ex.stack || ex}`));
    }).catch((ex) => message.reply(`:x: | An error occured : \n${ex.stack || ex}`));
}

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}