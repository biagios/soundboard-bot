try {
  var Discord = require('discord.js')
  if (process.version.slice(1).split('.')[0] < 8) {
    throw new Error('Node 8.0.0 or higher is required. Please upgrade / update Node.js on your computer / server.')
  }
} catch (e) {
  console.error(e.stack)
  console.error('Current Node.js version: ' + process.version)
  console.error("In case you´ve not installed any required module: \nPlease run 'npm install' and ensure it passes with no errors!")
  process.exit()
}

const client = new Discord.Client()
const talkedRecently = new Set()
const config = require('./config.json')

const games = ['with Dr. Freeman', 'Half Life 3', config.prefix + 'help', 'please send ' + config.prefix + 'help', 'with a baguette', 'with you ;)', 'with [slem], he is cool', 'with some code', 'with like 2 people idfk man', 'i am not funny', '🤔 🔫  ', 'stop using other bots.', 'Stop using mee6 and actually right clikc and ban people you lazy fuck', 'Litteraly the best bot out there.', 'gradientforest.com', 'sleme.github.com/porn', 'pineappledoesnotgoonpizza.com', `Okay, let's get this straight. If you put pineapple on your pizza you deserve to be punished.`, `STOP PUTTING PINEAPPLE ON PIZZA`, `I didn't think I would neeed to uh, touch on this subject or even mention it. I obviously don't want to touch on sensitive subjects, politics, social movements or religion, but this has gone too far. Please uhh, take it as a life lesson.`]
setInterval(function () {
  const rangame = games[Math.floor(Math.random() * games.length)]
  client.user.setGame(rangame)
}, 60000 * 5)

client.on('disconnected', function () {console.log("Mission failed, I'll get them next time.")})
client.on('ready', () => {console.log("I am ready."); console.log('Bot invite link: https://discordapp.com/oauth2/authorize?&client_id=' + config.client_id + '&scope=bot&permissions=1878522945')})
client.on('reconnecting', () => console.log('I am reconnecting now!'))
client.on('guildCreate', guild => {console.log("I joined a server")})
client.on('guildDelete', guild => {console.log("I left a server")})

client.on('message', async message => {
  if (message.author.bot) return
  let args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const command = args.shift().toLowerCase()
  let content = message.content.toLowerCase()
  if (talkedRecently.has(message.author.id)) {return}
  talkedRecently.add(message.author.id)
  setTimeout(() => {talkedRecently.delete(message.author.id)}, 2500)

  if (command === 'ping') {
    const pings = ['the moon', 'europe', 'oceania', 'Trump', 'a baguette', 'pizza', 'the netherlands', 'September 11th, 2001', 'digital ocean', 'the BBC', 'my mother', 'Mr. Meeseeks', "pewdipie's firewatch stream", 'uncensored hentai. :warning: `not found`', 'Julian Assange', 'african food supplies, jk']
    const ranQuote = pings[Math.floor(Math.random() * pings.length)]
    const m = await message.channel.send('One second...')
    m.edit('It took ` ' + (m.createdTimestamp - message.createdTimestamp) + ' ms ` to ping ' + ranQuote + '\nAlso, the API latency is `' + Math.round(client.ping) + ' ms`')
  }

  if (command === 'setgame') {
    const game = args.join(' ')
    message.delete().catch(O_o => {})
    client.user.setGame(game)
  }

  if (command === 'bot-invite') {
    message.delete()
    message.author.send('Bot invite link: https://discordapp.com/oauth2/authorize?&client_id=' + config.client_id + '&scope=bot&permissions=1878522945')
  }
  if (command === 'fuck'){
    let dispatcher
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join().then(connection => {
      dispatcher = connection.playFile('/audio/airhorn.mp3')
      dispatcher.on('error', e => {console.log(e);})
      dispatcher.on('end', () => {message.member.voiceChannel.leave()});
    } else {
      message.reply('You need to join a voice channel first!');
    }
  }
}

})

if (config.token) {
	// Log whats happening.
  console.log('-------------')
  console.log('Trying to log in with token...')
  client.login(config.token)
} else {
	// Only will happpen is error. This should only happen if the error is you dont have a bot token.
  console.log('Bot token not found! Remember you cant log in with credentials anymore.')
}
