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
const eventCall = require('./modules/eventCalls')
const dataRequest = require('./modules/datarequest')
const Util = require('./modules/util')
const config = require('./config.json')

const games = ['with Dr. Freeman', 'Half Life 3', config.prefix + 'help', 'please send ' + config.prefix + 'help', 'with a baguette', 'with you ;)', 'with [slem], he is cool', 'with some code', 'with like 2 people idfk man', 'i am not funny', '🤔 🔫  ', 'stop using other bots.', 'Stop using mee6 and actually right clikc and ban people you lazy fuck', 'Litteraly the best bot out there.', 'gradientforest.com', 'sleme.github.com/porn', 'pineappledoesnotgoonpizza.com', `Okay, let's get this straight. If you put pineapple on your pizza you deserve to be punished.`, `STOP PUTTING PINEAPPLE ON PIZZA`, `I didn't think I would neeed to uh, touch on this subject or even mention it. I obviously don't want to touch on sensitive subjects, politics, social movements or religion, but this has gone too far. Please uhh, take it as a life lesson.`]
setInterval(function () {
  const rangame = games[Math.floor(Math.random() * games.length)]
  client.user.setGame(rangame)
}, 60000 * 5)

client.on('warn', console.warn)
client.on('error', console.error)
client.on('ready', () => {eventCall.consoleReady(client, Discord, hook)})
client.on('disconnected', function () {eventCall.disconnected(hook)})
client.on('reconnecting', () => console.log('I am reconnecting now!'))
client.on('guildCreate', guild => {eventCall.joinedGuild(hook, guild)})
client.on('guildDelete', guild => {eventCall.leftGuild(hook, guild)})

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
})
