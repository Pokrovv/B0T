const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */

exports.run = async(client, message, args) => {
    
    const count = args[0];
    if(!count) return message.reply(":x: | Vous devez spécifier un nombre.");
    if(isNaN(count)) return message.reply(":x: | L'entrée spécifiée n'est pas un **nombre.**");
    if(count > 100 || count < 1) return message.reply(":x: | Le nombre spécifié doit être contenu entre **1 et 100.**");
    await message.delete();
    await message.channel.bulkDelete(count);
    message.channel.send(`✅ | ${count} messages ont été supprimés avec succès.`).then(msg=>msg.delete({timeout:7500}));
}


exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}