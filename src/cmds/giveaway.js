const Discord = require('discord.js');
const ms = require('ms');

/**
 *  @param {Discord.Client} client
 *  @param {Discord.Message} message
 *  @param {string[]} args
 */

exports.run = (client, message, args) => {
    if(!args[2]) return message.channel.send(`:x: | Syntax : !giveaway <time (ex: 1d)> <participants number> <price>`);
    client.giveawaysManager.start(message.channel, {
        messages: {
            giveaway: ':tada: - A giveaway has been started !',
            giveawayEnded: ':x: | The giveaway has stopped.',
            inviteToParticipate: 'React with :tada: to participate.',
            timeRemaining: ':watch: - Time remaining : **{duration}**',
            winMessage: 'Congratulations {winners} ! You just won {prize}.',
            embedFooter: 'B0T |',
            noWinner: ':x: | Giveaway cancelled : there\'s no players.',
            winners: 'winner(s)',
            endedAt: 'Ended at',
            
            hostedBy: 'Hosted by {user}',
            units: {
                seconds: 'seconds',
                minutes: 'minutes',
                hours: 'hours',
                days: 'days',
                pluralS: true // Not needed, because units end with a S so it will automatically removed if the unit value is lower than 2
            }
        },
        time: ms(args[0]),
        prize: args.slice(2).join(' '),
        winnerCount: parseInt(args[1])
    })/*.then((gData) => {
        console.log(gData);
    })*/;
};

exports.infos = {
    permission: 'MANAGE_MESSAGES',
    permissionDelete: false,
    permissionSilent: false
}