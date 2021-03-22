const Discord = require('discord.js');
const ms = require('ms');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */

exports.run = (client, message, args, config) => {
    
    if(args[0] === "create") {
    
        if(!args[1]) {
            return message.reply(`:x: | Syntaxe : ${config.prefix}ticket create <raison de l'ouverture du ticket>`);
        }

        args.shift();
        const reason = args.join(' ');
    
        if(!message.guild.roles.cache.has("731586626203025585")) {
            return message.reply(":x: | Je ne trouve pas le rôle de support.");
        }
        
        if(message.guild.channels.cache.filter(c=>c.name==="ticket-" + message.author.id).size !== 0) {
            return message.reply(`:x: | Vous avez déjà ouvert un ticket. (${message.guild.channels.cache.filter(c=>c.name==="ticket-" + message.author.id).first()})`);
        }
    
        message.guild.channels.create(`ticket-${message.author.id}`, "text").then(async(c) => {
            c.overwritePermissions([{
                id: "731586626203025585",
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
                .setColor("#FFF254")
                .setAuthor("- DaliaMC | Support/Besoin d'aide", client.user.displayAvatarURL())
                .setDescription(`Votre ticket a été créé avec succès ! ${c}`)
                .setFooter("DaliaMC")
                .setTimestamp()
            ).then(msg=>msg.delete({timeout:3000}));
        
            await c.send(message.author,
                new Discord.MessageEmbed()
                .setColor("#FFF254")
                .setAuthor("- DaliaMC | Support/Besoin d'aide", client.user.displayAvatarURL())
                .setDescription(`Bonjour, ${message.author} !\n\nCe ticket a été ouvert sur votre demande pour la raison suivante : **${reason}**\n\nSoyez respectueux, un membre du staff devrait répondre sous peu. Si vous le voulez, décrivez ici votre problème plus en détail.`)
                .setFooter("DaliaMC")
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