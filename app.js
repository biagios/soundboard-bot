var Discord = require('discord.js')
const client = new Discord.Client()
const talkedRecently = new Set()
const config = require('./private/config.json')
var airhorn

client.on('warn', console.warn)
client.on('error', console.error)
client.on('disconnected', function () {console.error('Disconnected!')})
client.on('reconnecting', () => console.log('Reconnecting'))
client.on('ready', () => {
  console.log(`Logged in as ${config.name}!`);
  console.log('Node version: ' + process.version + '\nDiscord.js version: ' + Discord.version)
  client.user.setActivity('Use s!info to understand what I do!')
});

client.on('message', async message => {
  if (message.author.bot) return
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  let content = message.content.toLowerCase()
  let sContentArgs = message.content.trim().split(/ +/g)
  let sContentCommand = sContentArgs.shift().toLowerCase()
  if (talkedRecently.has(message.author.id)) {return}
  talkedRecently.add(message.author.id)
  setTimeout(() => {talkedRecently.delete(message.author.id)}, 2500)
  if (message.author.bot) return
  if (message.content.indexOf(config.prefix) !== 0) return
  console.log('Recived ' + message.content + ' from ' + message.author)

  if (command === 'ping') {
    message.channel.startTyping()
    const m = await message.channel.send('Calculating...')
    m.edit(':ping_pong:' + (m.createdTimestamp - message.createdTimestamp) + ' ms')
    message.channel.stopTyping()
  }

  if (command === 'bot-invite') {
    message.delete()
    message.author.send('Bot invite link: https://discordapp.com/oauth2/authorize?&client_id=' + config.client_id + '&scope=bot&permissions=36809792')
  }

  if (command === 'airhorn'){
    message.delete()
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
      .then(connection => {
        const dispatcher = connection.playFile('./audio/airhorn.mp3');
        dispatcher.on('end', () => {message.member.voiceChannel.leave()});
        dispatcher.on('error', e => {console.error(e);});
      })
      .catch(console.error);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  if (command === 'smiley'){
    message.delete()
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
      .then(connection => {
        const dispatcher = connection.playFile('./audio/smiley.mp3');
        dispatcher.on('end', () => {message.member.voiceChannel.leave()});
        dispatcher.on('error', e => {console.error(e);});
      })
      .catch(console.error);
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }

  if (command === 'info'){
    message.delete()
    message.author.send(
      {
        "embed": {
          "title": "Sound-Bot has a list of various sounds you can play in voice chats with friends.",
          "description": "Use s!play followed by the name of the sound, here is a list of sounds:",
          "footer": {
            "text": "© Midday Clouds"
          },
          "fields": [
            {
              "name": "soundhorn",
              "value": "Plays the classic meme horn.",
              "inline": true
            },
            {
              "name": "smiley",
              "value": "Plays a well known SwaggerSouls line.",
              "inline": true
            }
          ]
        }
      }
    )
  }


})

if (config.token) {
  client.login(config.token)
} else {
  console.error('Bot token not found!')
}
