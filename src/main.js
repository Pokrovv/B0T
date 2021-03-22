require('dotenv').config();
const Discord = require('discord.js');
const { GiveawaysManager } = require('discord-giveaways');
const fs = require('fs');
const client = new Discord.Client();
const config = require('./config.json');
client.config = config;

let saving = {};

config.warns = require('./storage/warns.json');
config.xp    = require('./storage/xp.json');
client.mutes = require('./storage/mutes.json');
client.bans  = require('./storage/bans.json');
client.rr    = require('./storage/rolereaction.json');
client.misc  = require('./storage/misc.json');

client.queue = new Map();

const updateJson = (path, json) => new Promise(async(resolve, reject) => {
    try {
        if(!saving[path]){
            saving[path] = true;
            await require('util').promisify(fs.writeFile)(path, JSON.stringify(json,null,'\t'));
            saving[path] = false;
            resolve();
        }
    } catch(ex) {
        reject(ex);
    }
});

client.updateBans = (json) => new Promise((resolve, reject) => {
    client.bans = json;
    updateJson('./storage/bans.json', json).then(resolve()).catch(ex=>reject(ex));
});

client.giveawaysManager = new GiveawaysManager(client, {
    storage: './storage/giveaways.json',
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false, 
        exemptPermissions: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
        embedColor: '#FF8956',
        reaction: '🎉'
    }
});

client.updateMisc = () => new Promise((resolve, reject) => {
    updateJson('./storage/misc.json', client.misc).then(resolve()).catch(ex=>reject(ex));
});

client.updateMutes = (json) => new Promise((resolve, reject) => {
    client.mutes = json;
    updateJson('./storage/mutes.json', json).then(resolve()).catch(ex=>reject(ex));
});

client.updateRR = (json) => new Promise((resolve, reject) => {
    client.rr = json;
    updateJson('./storage/rolereaction.json', json).then(resolve()).catch(ex=>reject(ex));
});

client.updateWarns = (json) => new Promise((resolve, reject) => {
    config.warns = json;
    updateJson('./storage/warns.json', json).then(resolve()).catch(ex=>reject(ex));
});

client.updateXP = (json) => new Promise((resolve, reject) => {
    config.xp = json;
    updateJson('./storage/xp.json', json).then(resolve()).catch(ex=>reject(ex));
});

client.setVolume = (volume, guildid) => {
    client.queue.get(guildid).volume = volume;
    client.queue.get(guildid).connection.dispatcher.setVolumeLogarithmic(client.queue.get(guildid).volume / 5);
}

client.on('ready', async () => {
    console.log(`${client.user.username} (${client.user.id}) ready !`);
    let stockBans = client.bans, stockMutes = client.mutes;

    function updateMembers() {
        if(client.misc.discord && client.misc.discord + (60000*5) + 5000 <= Date.now()) return; // Update timeout
        client.channels.cache.get(client.config.counters.discord.total.channel)
                             .setName(client.config.counters.discord.total.expression
                                 .replace('{{count}}', client.channels.cache.get(total).guild.members.cache.size));
        client.channels.cache.get(client.config.counters.discord.online.channel)
                             .setName(client.config.counters.discord.online.expression
                                 .replace('{{count}}', client.channels.cache.get(total).guild.members.cache.filter(m => m.presence.status !== 'offline').size));
        client.misc.discord = Date.now();
        client.updateMisc();
    }

    let react = 0;
    function updateMinecraftMembers() {
        require('request')('https://mcapi.us/server/status?ip=' + client.config.counters.minecraft.ip, { json: true }, (err, _, body) => {
            if(err) throw err;
            const num = body.players['now'];
            if(client.misc.minecraft && client.misc.minecraft + (30000) >= Date.now()) {
                client.user.setPresence({
                    status: 'offline',
                    activity: {
                        name: react===0?`${client.config.counters.minecraft.ip} - ${num}/${body.players['max']}`:'@MC',
                        type: react===0?'PLAYING':'WATCHING'
                    }
                })
                react++;
                if(react > 1) react = 0;
            }
            if(client.misc.minecraft && client.misc.minecraft + (60000*5) + 5000 <= Date.now()) return;
            client.channels.cache.get(client.config.counters.minecraft.channel)
                                 .setName(client.config.counters.minecraft.expression
                                     .replace('{{count}}', `${num}/${body.players['max']}`));
            client.misc.minecraft = Date.now();
            client.updateMisc();
        })
    }

    client.misc.minecraft = Date.now();
    client.updateMisc();
    updateMembers();
    updateMinecraftMembers();
    setTimeout(updateMembers, 2500);
    setTimeout(updateMinecraftMembers, 10000);

    let i = 0, i2 = 0;
    new Discord.Collection(Object.entries(client.bans)).map((ban) => {
        if(ban.expire >= Date.now()) {
            client.guilds.cache.get(ban.guild).members.unban(ban.userid);
            delete stockBans[ban.id];
        } else {
            setTimeout(() => {
                client.guilds.cache.get(ban.guild).members.unban(ban.userid);
                delete stockBans[ban.id];
            }, (ban.expire - Date.now())>Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:(ban.expire - Date.now()));
        }
        if(i === Object.entries(client.bans).length - 1) {
            client.updateBans(stockBans);
        }
        i++;
    });
    
    new Discord.Collection(Object.entries(client.mutes)).map(async(mute) => {
        let muterole = await client.guilds.cache.get(mute.guild).roles.cache.find((role) => role.name === 'Muted');
        
        if(!client.guilds.cache.get(mute.guild).member(mute.userid)) delete stockMutes[mute.id];
        else if(mute.expire - Date.now() <= 0) {
            client.guilds.cache.get(mute.guild).member(mute.userid).roles.remove(muterole);
            delete stockMutes[mute.id];
        } else {
            setTimeout(async() => {
                client.guilds.cache.get(mute.guild).member(mute.userid).roles.remove(muterole);
                delete stockMutes[mute.id];
            }, (mute.expire - Date.now())>Number.MAX_SAFE_INTEGER?Number.MAX_SAFE_INTEGER:(mute.expire - Date.now()));
        }
        if(i2 === Object.entries(client.mutes).length - 1) {
            client.updateMutes(stockMutes);
            console.log(client.mutes)
            console.log(stockMutes)
        }
        i2++;
    });
});

client.on('guildMemberAdd', member => {
    member.roles.add(member.guild.roles.cache.get(client.config.roles.member));
    let channel = client.guilds.cache.get(client.config.guildid).channels.cache.get(client.config.channels.welcome);
    channel.send(new Discord.MessageEmbed()
        .setColor('#FFF254')
        .setAuthor('Oh, a new member!', client.user.displayAvatarURL())
        .setDescription(`Welcome ${member.user.username}.\nWe are now **${member.guild.memberCount} members**`)
        .setFooter('B0T |')
        .setTimestamp()
    );
    member.send(new Discord.MessageEmbed()
        .setColor('#FFF254')
        .setDescription(`Welcome to ${member.guild.name}, ${member.user.username}!`)
    )
});

client.on('message', async(msg) => {
    if(msg.author.bot) return;
    if(!msg.guild) return;

    if(msg.member !== msg.guild.owner && !(msg.content.toLowerCase().startsWith(`${client.config.prefix}play `) && (msg.content.toLowerCase().includes('//youtu.be/') || msg.content.toLowerCase().includes('//youtube.com/'))) && new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).test(msg.content.toLowerCase()) || msg.content.toLowerCase().includes('discord.gg')) {
        msg.delete();
        return msg.reply("you don't have rights to post links here ! :rage:").then(cc=>cc.delete({timeout:7500}));
    }
    
    if(msg.channel.id === client.config.channels.suggestions && !(msg.content.startsWith(client.config.prefix) && msg.member.hasPermission('MANAGE_MESSAGES'))) {
        await msg.channel.send(new Discord.MessageEmbed().setAuthor('Suggestions', client.user.displayAvatarURL())
                                .setDescription(msg.content)
                                .setFooter(msg.author.tag, msg.author.displayAvatarURL())
                                .setColor('#FFF254')
                                .setTimestamp()
        ).then((message) => {
            message.react('✅');
            message.react('❌');
        });
        return msg.delete();
    }
    
    const args = msg.content.slice(client.config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd === undefined || cmd === '' || !fs.existsSync(`./cmds/${cmd}.js`)) {
        if((!client.config.xp[msg.author.id]) || (Date.now() - client.config.xp[msg.author.id].lastXpTime) >= 60000) {
            let toGive = (client.config.xp[msg.author.id]?client.config.xp[msg.author.id].xp:0) + 15 + Math.floor(Math.random() * 11);
            let currLevel = client.config.xp[msg.author.id]?client.config.xp[msg.author.id].level:0;
            client.config.xp[msg.author.id] = {
                xp: toGive,
                level: Math.floor(toGive/250),
                lastXpTime: Date.now()
            };
            if(currLevel != Math.floor(toGive/250)) {
                msg.channel.send(`Congrats, ${msg.author} ! You've won an XP level and you're now level ${Math.floor(toGive/250)}.`).then((cc)=>cc.delete({timeout:7500}));

            }
            client.updateXP(client.config.xp);
        }
        return;
    }

    delete require.cache[require.resolve(`./cmds/${cmd}.js`)];
    const file = require(`./cmds/${cmd}.js`);
    if(file.infos.permission != undefined && !msg.member.hasPermission(file.infos.permission) && !msg.member.hasPermission('ADMINISTRATOR')) {
        if(file.infos.permissionDelete) msg.delete();
        if(!file.infos.permissionSilent) {
            msg.channel.send(
                new Discord.MessageEmbed()
                .setColor('#e74c3c')
                .setAuthor('An error occured', msg.author.displayAvatarURL())
                .setDescription(`You don't have the required permission to do this. **(${file.infos.permission})**`)
                .setFooter(`Requested by ${msg.author.tag}`)
                .setTimestamp()
            ).then(msg => msg.delete({timeout:7500}));
        }
        return;
    }
    try {
        file.run(client, msg, args, config);
    } catch(e) {
        console.log(e.stack || e);
        msg.channel.send(
            new Discord.MessageEmbed()
            .setColor('#e74c3c')
            .setAuthor('An error occured', msg.author.displayAvatarURL())
            .setDescription("Reach for help to an administrator and try again later.")
            .setFooter(`Requested by ${msg.author.tag}`)
            .setTimestamp()
        ).then(msg => msg.delete({timeout:7500}));
    }
});

client.on('raw', async(event) => {
    const events = {
        MESSAGE_REACTION_ADD: 'messageReactionAdd',
        MESSAGE_REACTION_REMOVE: 'messageReactionRemove',
    };
    if (!events.hasOwnProperty(event.t)) return;

	const { d: data } = event;
	const user = client.users.cache.get(data.user_id);
	const channel = client.channels.cache.get(data.channel_id) || await user.createDM();

	if (channel.messages.cache.has(data.message_id)) return;

	const message = await channel.messages.fetch(data.message_id);

	const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;

	client.emit(events[event.t], message.reactions.cache.get(emojiKey), user);
});

client.on('messageReactionAdd', (reaction, user) => {
    if(!client.rr[reaction.message.id]) return;
    if(client.rr[reaction.message.id].emoji !== (reaction.emoji instanceof Discord.GuildEmoji ? reaction.emoji.id : reaction.emoji.identifier)) return reaction.remove();
    reaction.message.guild.member(user).roles.add(client.rr[reaction.message.id].role).catch((ex)=>console.log(ex));
});

client.on('messageReactionRemove', (reaction, user) => {
    if(!client.rr[reaction.message.id]) return;
    if(client.rr[reaction.message.id].emoji !== (reaction.emoji instanceof Discord.GuildEmoji ? reaction.emoji.id : reaction.emoji.identifier)) return;
    reaction.message.guild.member(user).roles.remove(client.rr[reaction.message.id].role).catch((ex)=>console.log(ex));
});

client.login(process.env.TOKEN);