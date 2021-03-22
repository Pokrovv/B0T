const Discord = require("discord.js");
const {GiveawaysManager} = require('discord-giveaways');
const fs = require("fs");
const config = require('./config.json');
const client = new Discord.Client();
const {promisify} = require("util"),
            write = promisify(fs.writeFile);

let saving = {};

config.warns = require("./warns.json");
config.xp    = require("./xp.json");
client.mutes = require("./mutes.json");
client.bans  = require("./bans.json");
client.rr    = require("./rr.json");
client.misc  = require("./misc.json");

client.queue = new Map();

const updateJson = (path, json) => new Promise(async(resolve, reject) => {
    try {
        if(!saving[path]){
            saving[path] = true;
            await write(path, JSON.stringify(json,null,'\t'));
            saving[path] = false;
            resolve();
        }
    } catch(ex) {
        reject(ex);
    }
})

client.updateWarns = (json) => new Promise((resolve, reject) => {
    config.warns = json;
    updateJson("./warns.json", json).then(resolve()).catch(ex=>reject(ex));
});

client.updateXP = (json) => new Promise((resolve, reject) => {
    config.xp = json;
    updateJson("./xp.json", json).then(resolve()).catch(ex=>reject(ex));
});

client.updateMutes = (json) => new Promise((resolve, reject) => {
    client.mutes = json;
    updateJson("./mutes.json", json).then(resolve()).catch(ex=>reject(ex));
});

client.updateBans = (json) => new Promise((resolve, reject) => {
    client.bans = json;
    updateJson("./bans.json", json).then(resolve()).catch(ex=>reject(ex));
});

client.updateRR = (json) => new Promise((resolve, reject) => {
    client.rr = json;
    updateJson("./rr.json", json).then(resolve()).catch(ex=>reject(ex));
});

client.updateMisc = () => new Promise((resolve, reject) => {
    updateJson("./misc.json", client.misc).then(resolve()).catch(ex=>reject(ex));
});

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./gw.json",
    updateCountdownEvery: 10000,
    default: {
        botsCanWin: false, 
        exemptPermissions: ["ADMINISTRATOR", "MANAGE_MESSAGES"],
        embedColor: "#FF8956",
        reaction: "🎉"
    }
});

client.setVolume = (volume, guildid) => {
    client.queue.get(guildid).volume = volume;
    client.queue.get(guildid).connection.dispatcher.setVolumeLogarithmic(client.queue.get(guildid).volume / 5);
}

client.on("ready", async () => {
    console.log(`${client.user.username} ready !`);
    console.log(client.user.id);
    let i = 0, i2 = 0;
    let stockBans = client.bans, stockMutes = client.mutes;

    function oof() {
        if(client.misc.discord && client.misc.discord + (60000*5) + 5000 <= Date.now()) return;
        let total = "736285261465387068";
        let online = "736285345921892422";

        client.channels.cache.get(total).setName(`『👥』Daliens : ${client.channels.cache.get(total).guild.members.cache.size}`);
        let num = client.channels.cache.get(total).guild.members.cache.filter(m=>m.presence.status !== "offline").size;
        client.channels.cache.get(online).setName(`『😁』Connecté${num>1?"s":""} : ${num}`);
        client.misc.discord = Date.now();
        client.updateMisc();
    }

    let cc = 0;
    function oofMC() {
        require('request')('https://mcapi.us/server/status?ip=play.daliamc.ml', {json:true}, (err,res,body) => {
            const num = body.players["now"];
            if(client.misc.minecraft && client.misc.minecraft + (30000) >= Date.now()) {
                client.user.setPresence({
                    status: 'offline',
                    activity: {
                        name: cc===0?`play.daliamc.ml - ${num}/${body.players["max"]}`:"@DaliaMC",
                        type: cc===0?"PLAYING":"WATCHING"
                    }
                })
                cc++;
                if(cc > 1) cc = 0;
            }
            if(client.misc.minecraft && client.misc.minecraft + (60000*5) + 5000 <= Date.now()) return;
            let chan = "736285626621755534";
    
            client.channels.cache.get(chan).setName(`『😁』Connecté${num>1?"s":""} : ${num}/${body.players["max"]}`);
            client.misc.minecraft = Date.now();
            client.updateMisc();
        })
    }

    client.misc.minecraft = Date.now();
    client.updateMisc();
    oof();
    oofMC();
    setTimeout(oof, 2500);
    setTimeout(oofMC, 10000);

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
        let muterole = await client.guilds.cache.get(mute.guild).roles.cache.find((role) => role.name === "Muted");
        
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

client.on("guildMemberAdd", member => {

    member.roles.add(member.guild.roles.cache.get("736922991182741514"));
    let channel = client.guilds.cache.get("731586626190311474").channels.cache.get("731586627385950230");
    channel.send(new Discord.MessageEmbed()
        .setColor("#FFF254")
        .setAuthor("- DaliaMC | Bienvenue", client.user.displayAvatarURL())
        .setDescription(`Bienvenue parmi nous ${member.user.username}. \n Le serveur Discord compte désormais **${member.guild.memberCount} Dalien**`)
        .setFooter("DaliaMC |")
        .setTimestamp()
    );
    member.send(new Discord.MessageEmbed()
        .setColor("#FFF254")
        .setDescription("**DaliaMC - Présentation** \n Qu'est-ce que c'est ? \n C'est un serveur Minecraft qui **propose plusieurs modes de jeux** sur le **thème de l'Égypte**, le serveur **Accepte les Versions Minecraft non Officielles**. \n \n __**Qu'est-ce qu'il y a de spécial sur ce serveur ?**__ \n Ce serveur sera sous **items 100% Vanilla** mais avec des **nouvelles ajouts**, afin de proposer aux joueurs **des mobs, des items, des armures et plus totalement inédites comprenant des fonctions spéciales**, nous comptons les **rajouter sous forme Vanilla**. Le But du serveur es de **Commencer dans la Création d'un Peuple**, de l'**améliorer en recrutant et construisant une ville de votre manière**. Attention !  **Soyez assez réaliste** car le serveur ce base sur **le RôlePlay (RP)**. \n \n __**Quels seront les modes de jeux proposés ?**__ \n • Un **PvP/Faction** où vous aurez la possible de **voyages vers différentes planètes**. \n • Un **FFA** absolument **unique** comprenant des **fonctionnalités hors du commun**. (Plus pour s'entraîner) \n \n Nos **recrutements sont/seront ouverts**. Si vous êtes **intéressé à rejoindre l'équipe**, **les détails et les instructions a suivre sont dans le salon** #『📃』recrutement . 👀 \n •** Nous remercions la Communauté en leurs aidant dans le Jeu**, vous pouvez **gagner un Pack de Lancement de Peuple** Des **Passes de Combats** et **encore plus**. \n \n ⛔ __**Rappels :**__ \n • ***Merci de lire attentivement nos règlements avant de venir contester une sanction***. \n 💣 __**Règlements :**__ \n •『📜』règlement-ingame \n •『📜』règlement-discord \n •『📜』règlement-forum \n •『📜』règlement-événement \n •『📜』règlement-staff (Celle-ci est pour l'équipe de la DaliaMC, vous pouvez regarder les règles pour le staff si souhaitez) \n \n SiteWeb : https://daliamc.w2.cmws.fr/ \n Discord : discord.gg/2n5pVUc \n Twitter : https://twitter.com/DaliaMC_FR \n \n Bonne continuation, \n __**Cordialement DaliaMC**__ ")
    )
});

client.on("message", async(msg) => {
    if(msg.author.bot) return;
    if(!msg.guild) return;

    if(msg.member !== msg.guild.owner && !(msg.content.toLowerCase().startsWith(`${config.prefix}play `) && (msg.content.toLowerCase().includes("//youtu.be/") || msg.content.toLowerCase().includes("//youtube.com/"))) && new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/).test(msg.content.toLowerCase()) || msg.content.toLowerCase().includes("discord.gg")) {
        msg.delete();
        return msg.reply("vous n'avez pas le droit de poster de liens ici ! :rage:").then(cc=>cc.delete({timeout:7500}));
    }
    
    if(msg.channel.id === "731586626995617830" && !(msg.content.startsWith(config.prefix) && msg.member.hasPermission("MANAGE_MESSAGES"))) {
        let embed = new Discord.MessageEmbed().setAuthor("- DaliaMC | Suggestions", client.user.displayAvatarURL()).setDescription(`${msg.content}`).setFooter(`${msg.author.tag}`, msg.author.displayAvatarURL()).setColor("#FFF254").setTimestamp();
        await msg.channel.send(embed).then((message) => {
            message.react('✅');
            message.react('❌');
        });
        return msg.delete();
    }
    

    const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if(cmd === undefined || cmd === null || cmd === "" || !fs.existsSync(`./cmds/${cmd}.js`)) {
        if((!config.xp[msg.author.id]) || (Date.now() - config.xp[msg.author.id].lastXpTime) >= 60000) {
            let toGive = (config.xp[msg.author.id]?config.xp[msg.author.id].xp:0) + 15 + Math.floor(Math.random() * 11);
            let currLevel = config.xp[msg.author.id]?config.xp[msg.author.id].level:0;
            config.xp[msg.author.id] = {
                xp: toGive,
                level: Math.floor(toGive/250),
                lastXpTime: Date.now()
            };
            if(currLevel != Math.floor(toGive/250)) {
                msg.channel.send(`Bravo, ${msg.author} ! Vous avez gagné un niveau d'expérience, vous êtes maintenant niveau ${Math.floor(toGive/250)}.`).then((cc)=>cc.delete({timeout:7500}));

            }
            client.updateXP(config.xp);
        }
        return;
    }

    delete require.cache[require.resolve(`./cmds/${cmd}.js`)];
    const file = require(`./cmds/${cmd}.js`);
    if(file.infos.permission != undefined && !msg.member.hasPermission(file.infos.permission) && !msg.member.hasPermission("ADMINISTRATOR")) {
        if(file.infos.permissionDelete) msg.delete();
        if(!file.infos.permissionSilent) {
            msg.channel.send(
                new Discord.MessageEmbed()
                .setColor("#e74c3c")
                .setAuthor("Une erreur est survenue", msg.author.displayAvatarURL())
                .setDescription(`Vous n'avez pas la permission nécessaire pour faire cela. **(${file.infos.permission})**`)
                .setFooter(`Demandé par ${msg.author.tag}`)
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
            .setColor("#e74c3c")
            .setAuthor("Une erreur est survenue", msg.author.displayAvatarURL())
            .setDescription("Demandez de l'aide à un administrateur et réessayez plus tard.")
            .setFooter(`Demandé par ${msg.author.tag}`)
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

client.login(config.token);