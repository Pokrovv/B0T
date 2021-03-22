const Discord = require('discord.js');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args, config) => {

    if(!args[0]) return message.reply(`:x: | Syntax: ${config.prefix}warns <member (ID or mention)>`);

    const member = (message.mentions.members.first() || message.guild.member(args[0]));
    if(!member) return message.reply(':x: | You must specify a **valid** member.')

    let embed = new Discord.MessageEmbed().setAuthor(`Active warns for ${member.user.tag} (${member.id})`, member.user.displayAvatarURL()).setDescription('');
    let other = 0;
    let other2 = 0;

    let i = 0;

    new Discord.Collection(Object.entries(config.warns)).map((warn) => {
        if(warn.userid === member.id) {
            if(!warn.revoked) {
                embed.setDescription(embed.description + `(**#${warn.id}**/${new Date(warn.date).toLocaleString()}) Par <@${warn.moderator}>, raison: ${warn.reason}\n`);
                other2++;
            } else other++;
        }
        if(i === Object.entries(config.warns).length - 1) {
            if(other2 == 0) embed.setDescription('(none)')
            embed.setFooter(`(${other!=0?'+'+other:'none'} other revoked warn${other>1?s:''}) | B0T`).setTimestamp();
            message.channel.send(embed);
        }
        i++;
    });
}

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}