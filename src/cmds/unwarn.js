const Discord = require('discord.js');
const fs = require('fs');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {

    const id = args[0];
    if(!id || id.length != 5) return message.channel.send(`:x: | Syntax: ${config.prefix}unwarn <warnID>`);

    const warns = config.warns;
    if(!warns[id]) return message.reply(`:x: | This warn doesn't exist. Use ${config.prefix}warns <user> to list warns.`);
    
    warns[id] = {
        id: warns[id].id,
        userid: warns[id].userid,
        reason: warns[id].reason,
        date: warns[id].date,
        moderator: warns[id].moderator,
        revoked: true,
        revoker: message.author.id,
        revokedate: Date.now()
    }

    client.updateWarns(warns).then(()=>{
        message.channel.send(`Warn **#${id}** (for <@${warns[id].userid}> | ${warns[id].userid}) has been deleted.`);
    }).catch((ex)=>{
        message.channel.send(`:x: | An error occured. Contact an administrator.`);
        console.log(ex);
    })
}

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}