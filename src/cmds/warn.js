const Discord = require('discord.js');
const fs = require('fs');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = (client, message, args, config) => {
    const member = message.mentions.members.first();
    if(!member) return message.reply(':x: | You must specify a **valid** number.')
    if(member.id === message.guild.ownerID) return message.reply(':x: | I cannot warn this member, he\'s the guild owner!');
    
    if(message.member.roles.highest.comparePositionTo(member.roles.highest) < 1 &&
        message.author.id !== message.guild.ownerID)
        return message.reply(':x: | You cannot warn this member.');
    
    let reason = '(no reason given)';
    if(args[1]) reason = args.slice(1).join(' ');

    const warns = config.warns;
    const warnid = makeId(warns);

    warns[warnid] = {
        id: warnid,
        userid: member.id,
        reason: reason,
        date: Date.now(),
        moderator: message.author.id,
        revoked: false,
        revoker: '',
        revokedate: null
    }

    client.updateWarns(warns).then(() => {
        message.channel.send(`${member.user} has been warned for **${reason}** (ID ${warnid}) !`);
    }).catch((ex) => {
        message.channel.send(`:x: | An error occured. Contact an administrator.`);
        console.log(ex);
    });
}

function makeId(warns) {
    let result = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234567890123456789';
    for(let i = 0; i < 5; i++) {
       result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return warns[result]?makeId(warns):result;
}

exports.makeId = makeId;

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}