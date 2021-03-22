const Discord = require('discord.js');
const ms = require("ms");
/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args, config) => {

    let mutedUser = (message.mentions.members.first() || message.guild.member(args[0]));
    if(!mutedUser) return message.reply(`:x: | Vous devez spécifier un membre à **bannir**. (Syntaxe : ${config.prefix}tempban <membre> <temps (ex: 1d)> (<raison>)`);

    let time = args[1];
    if(!time || !ms(time)) return message.reply(`:x: | Vous devez spécifier un temps **valide**. (Syntaxe : ${config.prefix}tempban <membre> <temps (ex: 1d)> (<raison>)`);
    
    if(!mutedUser.bannable) return message.reply(`:x: | Je ne peux pas bannir ce membre.`);

    let reason = "(Aucune raison spécifiée)";
    if(args[2]) {
        args.shift();
        args.shift();
        reason = args.join(' ');
    }

    await mutedUser.ban(`Par ${message.author.tag} (${message.author.id}) pour ${reason} pendant ${ms(ms(time), {long:true}).replace("day", "jour").replace("hour", "heure").replace("second", "seconde")}.`);
    await message.channel.send(`${mutedUser.user} a bien banni par ${message.author.tag} (${message.author.id}) pour ${reason} pendant ${ms(ms(time), {long:true}).replace("day", "jour").replace("hour", "heure").replace("second", "seconde")}.`)

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
        message.channel.send(`${mutedUser.user} a bien été débanni !`).then(msg=>msg.delete(5000))
    }, ms(time)>Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:ms(time));
}

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}