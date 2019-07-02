const Discord = require('discord.js');
const bot = new Discord.Client();
const token = 'NTk0MjE0MjE3NTQwNjk4MTI3.XRvYGw.qIF4oq_cRTZ3r8XCPQEh3qmyXzU';
bot.music = require("discord.js-musicbot-addon");

// Now we start the music module.
bot.music.start(bot, {
  // Set the api key used for YouTube.
  // This is required to run the bot.
  youtubeKey: "AIzaSyCPaImHND8JgP_k_O8nJ1jl2mz6cJ2K7cw"

});
const prefix = '!';

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


bot.login(token);
