const Discord = require('discord.js');
const ytdl = require('ytdl-core');
/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args, config) => {
    
    if(!args[0]) return message.reply(`:x: | Syntaxe : ${config.prefix}play <lien youtube>`);
    const voiceChan = message.member.voice.channel;
    if(!voiceChan) return message.reply(":x: | Vous devez être dans un salon vocal pour utiliser cette commande.");
    if(message.guild.member(client.user.id).voice.channel && client.queue.get(message.guild.id)) return message.reply(":x: | Je suis déjà dans un autre salon vocal.");
    if(!voiceChan.permissionsFor(message.guild.member(client.user.id)).has("CONNECT") ||
       !voiceChan.permissionsFor(message.guild.member(client.user.id)).has("SPEAK"))
        return message.channel.send(":x: | Je n'ai pas la permission d'entrer dans ce salon vocal.");
    const musicInfo = await ytdl.getInfo(args.join(' '));
    const music = {
        title: musicInfo.videoDetails.title,
        url: musicInfo.videoDetails.video_url
    };
    const serverQueue = client.queue.get(message.guild.id);
    if(!serverQueue) {
        const queueContruct = {
            textChannel: message.channel,
            voiceChannel: voiceChan,
            connection: null,
            songs: [],
            volume: 5,
            playing: true
        };
    
        client.queue.set(message.guild.id, queueContruct);
        
        queueContruct.songs.push(music);
    
        try {
            var connection = await voiceChan.join();
            queueContruct.connection = connection;
            const serverQueue = client.queue.get(message.guild.id);
            if (!music) {
                serverQueue.voiceChannel.leave();
                client.queue.delete(guild.id);
                return;
            }
          
            const dispatcher = serverQueue.connection
              .play(ytdl(music.url))
              .on("finish", () => {
                serverQueue.songs.shift();
                play(message.guild, serverQueue.songs[0], client);
              })
              .on("error", error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Démarrage de la transmission auditive de: **${music.title}**`);
        } catch (err) {
            console.log(err);
            client.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(music)
        return message.channel.send(`${music.title} a bien été ajouté à la liste des musiques.`);
    }
}

exports.infos = {
    permission: undefined,
    permissionDelete: false,
    permissionSilent: false
}

function play(guild, song, client) {
    const serverQueue = client.queue.get(guild.id);
    if (!song) {
        serverQueue.voiceChannel.leave();
        client.queue.delete(guild.id);
      return;
    }
  
    const dispatcher = serverQueue.connection
      .play(ytdl(song.url))
      .on("finish", () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0], client);
      })
      .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Démarrage de la transmission auditive de: **${song.title}**`);
}