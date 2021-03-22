const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args) => {

    let mutedUser = (message.mentions.members.first() || message.guild.member(args[0]));
    if(!mutedUser) return message.reply(":x: | Vous devez spécifier un membre à **mute**.");

    let muterole = await message.guild.roles.cache.filter((role) => role.name === "Muted");
    if(!muterole) {
        console.log("ff");
        message.guild.roles.create({
            data: {
                name: "Muted",
                color: "DEFAULT"
            }
        }).then(async (role) => {
            console.log(role);
            muterole = role;
            await message.guild.channels.cache.map(async(channel, id) => {
                await channel.createOverwrite(muterole, {
                    SEND_MESSAGES: false,
                    ADD_REACTIONS: false,
                    CONNECT: false
                });
            });
        }).catch(ex=>console.log(ex));
    }
    await mutedUser.roles.add(muterole);
    message.channel.send(`${mutedUser.user} a bien été mute.`)
}

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}