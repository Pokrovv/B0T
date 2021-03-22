const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */

exports.run = async(client, message, args) => {
    
    const count = args[0];
    if(!count || isNaN(count) || (count > 100 || count < 1)) return message.reply(':x: | You must enter a number between 1 and 100.');
    await message.delete();
    await message.channel.bulkDelete(count);
    message.channel.send(`✅ | ${count} messages have been deleted successfully.`).then(msg=>msg.delete({ timeout: 7500 }));
}


exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}