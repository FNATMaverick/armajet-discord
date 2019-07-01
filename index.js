const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NTk0MjE0MjE3NTQwNjk4MTI3.XRnhcg.jBPGXCsId9fQz-sVrog_EWlvryo';
const ytdl = require('ytdl-core');
const prefix = ';';
var queue = [];

//list of maps for choosing best of
var maps = [
    'Magma',
    'Moon',
    'Canyon',
    'SnowBase',
    'Temple'
];

// shuffle an array order
function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

// check if the bot can join a voice channel
function checkVoice(msg) {
    const voiceChannel = msg.member.voiceChannel;
    if (!voiceChannel) {
        msg.channel.send('You need to be in a voice channel to play music!');
        return false
    }
    const permissions = voiceChannel.permissionsFor(msg.client.user);
    if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
        msg.channel.send('I need the permissions to join and speak in your voice channel!');
        return false
    }
    return true
}

// return a random map
function pickmaps(amount) {
    shuffle(maps)

    var msg = '**Best of ' + amount + '**' + '\r' + '```';
    for (let i = 0; i < amount; i++) {
        mapnumber = i + 1;
        msg = msg + 'Map ' + mapnumber + ': ' + maps[i] + '\r'
    }
    msg = msg + '```'
    return msg;
}

//startup message
bot.on('ready', () => {
    console.log('Bot logged in');
});

// message hook function
bot.on('message', msg => {
    if (msg.author.bot) return;

    //music controls
    if (msg.content.startsWith(';play ')) {
        execute(msg);
        return;
    } else if (msg.content.startsWith(';skip')) {
        skip(msg);
        return;
    } else if (msg.content.startsWith(';stop')) {
        stop(msg);
        return;
    }


    //'best of' map selection
    if (/^;bo[0-9]*$/.test(msg.content)) {
        amount = Number(msg.content.match(/[0-9]{1,}/));
        if (amount > maps.length) {
            var longmsg = '**Best of ' + amount + ': **' + '\r' + '```'
            for (let i = 0; i < amount; i++) {
                var item = maps[Math.floor(Math.random() * maps.length)];
                longmsg = longmsg + 'Map ' + (i + 1) + ':' + item + '\r';
            }
            longmsg = longmsg + '```'
            msg.channel.send(longmsg);
        } else {
            msg.channel.send(pickmaps(amount));
        }
    }

    //random annoyances
    rngchance = Math.floor(Math.random() * 15);

    if (rngchance == 4) {
        msg.reply('This message is here purely to annoy you');
    }
    if (rngchance == 5) {
        msg.reply('WHAT ARE YOU DOING IN MY SWAMP?!');
    }

});


async function execute(msg) {
    console.log('Execute');
    const args = msg.content.split(' ');

    const voiceChannel = msg.member.voiceChannel;
    if (!checkVoice(msg)) {
        return;
    }

    const songInfo = await ytdl.getInfo(args[1]);
    queue.push(songInfo.video_url);
    msg.channel.send('playing ' + song.title);
    play(msg.member.voiceChannel);

}

function skip(msg, serverQueue) {
    if (!msg.member.voiceChannel) return msg.channel.send('You have to be in a voice channel to stop the music!');
    if (queue === undefined || queue.length == 0) {
        console.log('no music left');
        return;
    }
    serverQueue.connection.dispatcher.end();
    play(msg.member.voiceChannel)
}

function stop(msg) {
    if (!msg.member.voiceChannel) return msg.channel.send('You have to be in a voice channel to stop the music!');
    queue = [];
    serverQueue.connection.dispatcher.end();
}

function play(voiceChannel) {
    if (queue === undefined || queue.length == 0) {
        console.log('no music left')
    }
    var songurl = queue.pop();
    var connection = await voiceChannel.join();

    const dispatcher = connection.playStream(ytdl(songurl))
        .on('end', () => {
            console.log('Music ended!');
            play(voiceChannel);
        })
        .on('error', error => {
            console.error(error);
        });
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
}

bot.login(token);