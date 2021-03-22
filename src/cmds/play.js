const Discord = require('discord.js');
const ytdl = require('ytdl-core');
/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */
exports.run = async(client, message, args, config) => {
    
    if(!args[0]) return message.reply(`:x: | Syntax : ${config.prefix}play <youtube link>`);
    const voiceChan = message.member.voice.channel;
    if(!voiceChan) return message.reply(':x: | You must be in a voice channel to use this command.');
    if(message.guild.member(client.user.id).voice.channel && client.queue.get(message.guild.id)) return message.reply(':x: | I\'m already in another voice channel.');
    if(!voiceChan.permissionsFor(message.guild.member(client.user.id)).has('CONNECT') ||
       !voiceChan.permissionsFor(message.guild.member(client.user.id)).has('SPEAK'))
        return message.channel.send(':x: | I don\'t have the rights to enter this channel.');
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
              .on('finish', () => {
                serverQueue.songs.shift();
                play(message.guild, serverQueue.songs[0], client);
              })
              .on('error', error => console.error(error));
            dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
            serverQueue.textChannel.send(`Starting audio transmission: **${music.title}**`);
        } catch (err) {
            console.log(err);
            client.queue.delete(message.guild.id);
            return message.channel.send(err);
        }
    } else {
        serverQueue.songs.push(music)
        return message.channel.send(`${music.title} has been added to the queue.`);
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
      .on('finish', () => {
        serverQueue.songs.shift();
        play(guild, serverQueue.songs[0], client);
      })
      .on('error', error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
    serverQueue.textChannel.send(`Starting audio transmission: **${song.title}**`);
}