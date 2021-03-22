const Discord = require('discord.js');
const ms = require('ms');
/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args) => {

    let mutedUser = (message.mentions.members.first() || message.guild.member(args[0]));
    if(!mutedUser) return message.reply(':x: | You must supply a member to **mute**.');

    let time = args[1];
    if(!time || !ms(time)) return message.reply(`:x: | You must specify a **valid** time.`);

    let muterole = await message.guild.roles.cache.filter((role) => role.name === 'Muted');
    if(!muterole) {
        console.log('ff');
        message.guild.roles.create({
            data: {
                name: 'Muted',
                color: 'DEFAULT'
            }
        }).then(async (role) => {
            console.log(role);
            muterole = role;
            await message.guild.channels.cache.map(async(channel) => {
                await channel.createOverwrite(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false
                });
            });
        }).catch(ex=>console.log(ex));
    }
    await(mutedUser.roles.add(muterole));
    message.channel.send(`${mutedUser.user} has successfully been muted for ${ms(ms(time), {long:true})}`)
    
    let mutes = client.mutes;
    let id = require('./warn.js').makeId(mutes);

    mutes[id] = {
        id: id,
        guild: message.guild.id,
        userid: mutedUser.id,
        moderator: message.author.id,
        timestamp: Date.now(),
        expire: Date.now() + ms(time)
    }

    client.updateMutes(mutes);

    setTimeout(function(){
        mutedUser.roles.remove(muterole.id);
        message.channel.send(`${mutedUser.user} has successfully been unmuted !`).then(msg=>msg.delete(5000))
    }, ms(time)>Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:ms(time));
}

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}