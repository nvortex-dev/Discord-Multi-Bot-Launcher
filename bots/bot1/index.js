const { Client, GatewayIntentBits } = require('discord.js');
const registerEvents = require('./events');

async function start({ name, token }) {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  });

  registerEvents(client, name);

  await client.login(token);

  return client;
}

module.exports = { start };
