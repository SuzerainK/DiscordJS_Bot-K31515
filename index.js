const Discord = require('discord.js');
const bot = new Discord.Client();
const { prefix, token } = require('./Data/config.json');
const fs = require('fs');
const ytdl = require("ytdl-core");

var servers = {};

bot.on("guildMemberAdd", member =>{
    bot.channels.cache.get('755724428804882483').send(`Glad to see you here, ${member}-sama :relieved:`)
})
bot.on("guildMemberRemove", member =>{
    bot.channels.cache.get('755724428804882483').send(`Sad to say but, ${member}-sama has left us... :disappointed_relieved:`)
})

bot.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}
bot.on('ready', () => {
    
    console.log('K31515: Online.');
    bot.channels.cache.get('756029365338243113');
    //var testCh = bot.channels.cache.get('755720597274755117')
    //setInterval(() =>{
      //  testCh.send("Good day... this message is an interval.")

    //}, 10000);
    
})

bot.on('message', message => {
    let args = message.content.substring(prefix.length).split(" ");
    if(message.author.bot) return;

    if(message.content.toLowerCase() === 'i love you k'){
        message.reply('( • ̀ω•́ )✄╰U╯');
    }
    if(message.content.toLowerCase() === 'hi k!'){
        message.channel.send(`Hi ${message.author.toString()}!`);
    }
    if(message.content.toLowerCase().includes('lol')){
        const array = [
            'hahah',
            'yah right',
            'lmao',
            'eh?',
            'rofl'
        ]
        const Random = Math.floor(Math.random() * array.length)

        message.channel.send(array[Random])
    }
    if(message.content.toLowerCase().includes('fck you')){
        const array0 = [
            `${message.author.toString()}-san, your grandparents shall be ashamed of you.`,
            `Disgusting.`,
            `Please don't fight here...`
        ]
        const Random0 = Math.floor(Math.random() * array0.length)
        message.channel.send(array0[Random0])
    }

    if(!message.content.startsWith(prefix)) return;
    args = message.content.slice(prefix.length).split(/ +/);
    
    switch(args[0]){
        case 'help':
            const embed = new Discord.MessageEmbed()
            .setAuthor('Command List', 'https://i.imgur.com/i077NnL.png')
            .setDescription('Type k!(command) to use! More features shall be added soon!')
            .addField('Starter Commands', '`say` `hello` `embed` `botstatus`' )
            .setColor(0xFC277F)
            message.channel.send(embed);
            break;
        case 'hello':
            message.channel.send('hi. :blush:');
            break;
        case 'sysclear':
            if(!args[1]) return message.channel.send('How many messages do you want to clear? (You provided none!) :confused:')
            if(isNaN(args[1])) return message.channel.send(`${args[1]} is not a number! :sweat_smile:`);
            message.channel.bulkDelete(args[1]);

            break;
        case 'say':
            bot.commands.get('say').execute(message, args);

            break;
        case 'generalsay':
            if(!args[1]) return message.channel.send('Say what?');
            let generalsay = args.splice(1).join(" ")

            const channel = bot.channels.cache.get('755720597274755117');
            message.channel.bulkDelete(1);
            channel.send(generalsay)

            break;
        case 'sysannounce':
            if(!args[1]) return message.channel.send('Announce what?');
            let announce = args.splice(1).join(" ")

            const channel1 = bot.channels.cache.get('755722045672914944');
            message.channel.bulkDelete(1);
            const embedAnnounce = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setTitle('Important!')
            .setDescription(announce)
            .setColor(0xFC277F)
            .setTimestamp()
            channel1.send(embedAnnounce)

            break;

        case 'botstatus':
            const statusEmbed = new Discord.MessageEmbed()
            .setAuthor('[Project K31515]')
            .setTitle('Current Status')
            .addField('Version', '1.0.5')
            .addField('Type', 'Prototype/Under Construction')
            .setFooter('Requires active VSCode to run')
            .setColor(0xFC277F)
            message.channel.send(statusEmbed);
            break;
        case 'embed':
            let embedContent = message.content.substring(8);
            let embedMessage = new Discord.MessageEmbed();
            
            
            embedMessage.setAuthor(message.author.username, message.author.displayAvatarURL());
            embedMessage.setColor(0xFC277F);
            embedMessage.setDescription(embedContent);
            embedMessage.setTimestamp();
            message.channel.bulkDelete(1);
            message.channel.send(embedMessage);
            break;
        case 'music':
            function play(connection, message){
                var server = servers[message.guild.id];

                server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
                server.queue.shift();
                server.dispatcher.on("finish",() =>{
                    if(server.queue[0]){
                        play(connection, message);
                    }else {
                        connection.disconnect();
                    }
                });
            }
            if(!args[1]){
                message.channel.send("You need to provide a link!");
                return;
            }
            if(!message.member.voice.channel){
                message.channel.send("You must be in a voice channel.");
                return;
            }
            if(!servers[message.guild.id]) servers[message.guild.id] = {
                queue: []
            }
            var server = servers[message.guild.id];

            server.queue.push(args[1]);

            if(!message.guild.voiceConnection) message.member.voice.channel.join().then(function(connection){
                play(connection, message);

            })
            break;
        case 'skip':
            var server = servers[message.guild.id];
            if(server.dispatcher) server.dispatcher.end();
            message.channel.send("Skipped!")
            break;

        case 'stop':
            var server = servers[message.guild.id];
            if(message.guild.voice.connection){
                for(var i = server.queue.length -1; i>=0; i--){
                    server.queue.splice(i, 1);
                }
                server.dispatcher.end();
                message.channel.send("Stopped.")
                console.log("Stopped the queue.")

            }
            if(message.guild.connection) message.guild.voice.connection.disconnect();
            break;
    }
})
bot.login(token)