const Discord = require('discord.js');
const ms = require('ms');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */

exports.run = (client, message, args, config) => {
    
    if(args[0] === 'create') {
    
        if(!args[1]) {
            return message.reply(`:x: | Syntax: ${config.prefix}ticket create <reason>`);
        }

        args.shift();
        const reason = args.join(' ');
    
        if(!message.guild.roles.cache.has('731586626203025585')) {
            return message.reply(':x: | I cannot find the support role.');
        }
        
        if(message.guild.channels.cache.filter(c=>c.name==='ticket-' + message.author.id).size !== 0) {
            return message.reply(`:x: | You already opened a ticket. (${message.guild.channels.cache.filter(c=>c.name==='ticket-' + message.author.id).first()})`);
        }
    
        message.guild.channels.create(`ticket-${message.author.id}`, 'text').then(async(c) => {
            c.overwritePermissions([{
                id: '731586626203025585',
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
            },{
                id: message.author.id,
                allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
            },{
                id: message.guild.roles.everyone.id,
                deny: ['VIEW_CHANNEL']
            }]);
            
            await message.channel.send(
                new Discord.MessageEmbed()
                .setColor('#FFF254')
                .setAuthor('B0T | Support/Need help', client.user.displayAvatarURL())
                .setDescription(`Your ticket has been created ! ${c}`)
                .setFooter('B0T')
                .setTimestamp()
            ).then(msg=>msg.delete({timeout:3000}));
        
            await c.send(message.author,
                new Discord.MessageEmbed()
                .setColor('#FFF254')
                .setAuthor('B0T | Support/Need help', client.user.displayAvatarURL())
                .setDescription(`Hello, ${message.author} !\n\nThis ticket has been opened on your demand for : **${reason}**\n\nBe respectful, a new staff member should answer soon.`)
                .setFooter('B0T')
                .setTimestamp()
            );
        });
    }
};

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}