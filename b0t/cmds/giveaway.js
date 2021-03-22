const Discord = require('discord.js');
const ms = require('ms');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */

exports.run = (client, message, args) => {
    if(!args[2]) return message.channel.send(`:x: | Syntaxe: !giveaway <temps (ex: 1d)> <nombre de participants> <prix>`);
    client.giveawaysManager.start(message.channel, {
        messages: {
            giveaway: ':tada: - Un concours a été lancé !',
            giveawayEnded: ':x: | Le concours est terminé',
            inviteToParticipate: 'Réagissez avec :tada: pour participer.',
            timeRemaining: ':watch: - Temps restant : **{duration}**',
            winMessage: 'Félicitations : {winners} ! Vous venez de gagner {prize}',
            embedFooter: 'DaliaMC -',
            noWinner: ':x: | Concours annulé : il n\'y a pas de participations.',
            winners: 'gagnant(s)',
            endedAt: "Fin",
            
            hostedBy: "Hébergé par {user}",
            units: {
                seconds: "secondes",
                minutes: "minutes",
                hours: "heures",
                days: "jours",
                pluralS: true // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        },
        time: ms(args[0]),
        prize: args.slice(2).join(" "),
        winnerCount: parseInt(args[1])
    })/*.then((gData) => {
        console.log(gData);
    })*/;
};

exports.infos = {
    permission: "MANAGE_MESSAGES",
    permissionDelete: false,
    permissionSilent: false
}