const Discord = require('discord.js');
const ms = require('ms');
/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args, config) => {

    let mutedUser = (message.mentions.members.first() || message.guild.member(args[0]));
    if(!mutedUser) return message.reply(`:x: | You must supply a member to **ban**. (Syntax: ${config.prefix}tempban <member> <time (ex: 1d)> (<reason>)`);

    let time = args[1];
    if(!time || !ms(time)) return message.reply(`:x: | You must supply a **valid** time. (Syntaxe : ${config.prefix}tempban <member> <time (ex: 1d)> (<reason>)`);
    
    if(!mutedUser.bannable) return message.reply(`:x: | I can't ban this member.`);

    let reason = '(Aucune raison spécifiée)';
    if(args[2]) {
        args.shift();
        args.shift();
        reason = args.join(' ');
    }

    await mutedUser.ban(`By ${message.author.tag} (${message.author.id}) for ${reason} during ${ms(ms(time), {long:true})}.`);
    await message.channel.send(`${mutedUser.user} has been banned by ${message.author.tag} (${message.author.id}) for ${reason} during ${ms(ms(time), {long:true})}.`)

    let bans = client.bans;
    let id = require('./warn.js').makeId(bans);

    bans[id] = {
        id: id,
        guild: message.guild.id,
        userid: mutedUser.id,
        moderator: message.author.id,
        reason: reason,
        timestamp: Date.now(),
        expire: Date.now() + ms(time)
    }

    client.updateBans(bans);

    setTimeout(function(){
        message.guild.members.unban(mutedUser.user);
        message.channel.send(`${mutedUser.user} has successfully been unbanned !`).then(msg=>msg.delete(5000))
    }, ms(time)>Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:ms(time));
}

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}