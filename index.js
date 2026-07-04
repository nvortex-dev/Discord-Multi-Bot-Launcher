const fs = require('fs');
const path = require('path');
const { parse } = require('comment-json');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const BOTS_FOLDER = path.join(__dirname, 'bots');

const runningClients = [];

function loadConfig() {
  const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
  return parse(raw);
}

async function startBot(botConfig) {
  const botEntryPath = path.join(BOTS_FOLDER, botConfig.name, 'index.js');

  if (!fs.existsSync(botEntryPath)) {
    console.error(`[${botConfig.name}] Fichier introuvable : bots/${botConfig.name}/index.js`);
    return;
  }

  if (!botConfig.token || botConfig.token.startsWith('COLLE_ICI')) {
    console.error(`[${botConfig.name}] Token manquant ou non renseigné dans config.json`);
    return;
  }

  try {
    const botModule = require(botEntryPath);
    const client = await botModule.start({ name: botConfig.name, token: botConfig.token });
    runningClients.push({ name: botConfig.name, client });
    console.log(`[${botConfig.name}] Démarré avec succès`);
  } catch (error) {
    console.error(`[${botConfig.name}] Erreur au démarrage :`, error);
  }
}

async function shutdown() {
  console.log('\nArrêt en cours...');

  for (const { name, client } of runningClients) {
    try {
      await client.destroy();
      console.log(`[${name}] Déconnecté proprement`);
    } catch (error) {
      console.error(`[${name}] Erreur pendant la déconnexion :`, error);
    }
  }

  process.exit(0);
}

async function main() {
  const config = loadConfig();
  const bots = config.bots || [];
  const activeBots = bots.filter((bot) => bot.enabled);

  if (activeBots.length === 0) {
    console.log('Aucun bot actif dans config.json');
    return;
  }

  console.log(`Lancement de ${activeBots.length} bot(s)...`);

  for (const botConfig of activeBots) {
    await startBot(botConfig);
  }
}

process.on('unhandledRejection', (reason) => {
  console.error('Erreur non gérée (promesse rejetée) :', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Erreur non interceptée :', error);
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

main();
