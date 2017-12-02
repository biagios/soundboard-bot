/**
 *
 * @fileoverview Functions called when an event has happened in the bot.
 * @author Julian Yaman
 *
 */

/**
 * Sends console and webhook output to the production command tool and Pal Bot Discord server.
 *
 * @param client
 * @param Discord
 * @param hook
 */
exports.consoleReady = (client, Discord, hook) => {
  console.log('-------------')
  console.log('Logged in!')
  console.log('Starting Pal...\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version)
  hook.send('Logged in!')
  hook.send('Starting Pal-Bot:\nNode version: ' + process.version + '\nDiscord.js version: ' + Discord.version)
  console.log('-------------')
  console.log(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`)
  hook.send(`Ready to serve in ${client.channels.size} channels on ${client.guilds.size} servers, for a total of ${client.users.size} users.`)
  console.log('-------------')
}

/**
 * See function description from .consoleReady
 *
 * @param hook
 */
exports.disconnected = (hook) => {
  // Logging changes.
  console.error('Disconnected!')
  hook.send('Disconnected!')

  // This should exit node.js with an error.
  process.exit(1)
}

/**
 *
 * @param hook
 * @param guild
 */
exports.joinedGuild = (hook, guild) => {
  // Logging changes.
  console.log(`New server joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
  hook.send(`New server joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`)
}

/**
 *
 * @param hook
 * @param guild
 */
exports.leftGuild = (hook, guild) => {
  // Logging changes.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`)
  hook.send(`I have been removed from: ${guild.name} (id: ${guild.id})`)
}

/**
 *
 * @param hook
 */
exports.tokenLogin = (hook) => {
  // Log whats happening.
  console.log('-------------')
  console.log('Trying to log in with token...')
  hook.send('Trying to log in with token...')
}
