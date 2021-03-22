const Discord = require('discord.js');
const fs = require('fs'),
      request = require('request');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args) => {

    let embed = new Discord.MessageEmbed().setDescription(args.join(' ')).setColor('FFF254').setFooter('B0T').setTimestamp();
    if(message.attachments.first()) {
        if(!fs.existsSync('images/')) await fs.mkdirSync('images/')
        download(message.attachments.first().url, 'images/' + message.attachments.first().name?message.attachments.first().name:'unknown.png', ()=>{
            embed.setImage('images/' + message.attachments.first().name?message.attachments.first().name:'unknown.png');
            message.channel.send(embed).then(async()=>{
                await fs.unlinkSync('images/' + message.attachments.first().name?message.attachments.first().name:'unknown.png');
                await fs.rmdirSync('images/');
            })
        })
    } else {
        message.delete();
        message.channel.send(embed);
    }
}

const download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

exports.infos = {
    permission: 'ADMINISTRATOR',
    permissionDelete: false,
    permissionSilent: false
}