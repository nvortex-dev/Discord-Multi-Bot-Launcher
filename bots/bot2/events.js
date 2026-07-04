const { Events } = require('discord.js');
const commands = require('./commands');

function registerEvents(client, name) {
  client.once(Events.ClientReady, (readyClient) => {
    console.log(`[${name}] Connecté en tant que ${readyClient.user.tag}`);
  });

  client.on(Events.MessageCreate, (message) => {
    if (message.author.bot) return;

    const handler = commands[message.content];
    if (handler) {
      handler(message);
    }
  });
}

module.exports = registerEvents;
