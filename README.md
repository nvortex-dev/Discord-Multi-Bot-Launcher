# Discord Multi-Bot Launcher

Lanceur Node.js permettant de démarrer **plusieurs bots Discord en simultané** depuis un seul processus, avec une configuration centralisée dans `config.json`.

## Fonctionnalités

- Lancement de plusieurs bots en parallèle depuis un seul `index.js`
- Chaque bot vit dans son propre **dossier** sous `bots/`, et peut être découpé en plusieurs fichiers (commandes, événements, utilitaires, etc.)
- Activation/désactivation d'un bot sans supprimer sa configuration (`enabled: true/false`)
- Un bot qui plante (token invalide, erreur interne) n'arrête pas les autres
- Arrêt propre de tous les bots avec `Ctrl+C` (SIGINT) ou `SIGTERM`
- `config.json` accepte des commentaires (`//`) grâce à `comment-json`

## Structure du projet

```
discord-multi-bot-launcher/
├── bots/
│   ├── bot1/
│   │   ├── index.js       # Point d'entrée, exporte start({ name, token })
│   │   ├── events.js      # Écoute les événements Discord (ready, messageCreate...)
│   │   └── commands.js    # Répond "Pong !" à !ping
│   └── bot2/
│       ├── index.js
│       ├── events.js
│       └── commands.js    # Répond à !hello et !info
├── config.example.json    # Template à copier (safe pour GitHub)
├── index.js                 # Le launcher
├── package.json
└── .gitignore
```

Chaque bot n'a qu'une seule obligation : posséder un `bots/<nom>/index.js` qui exporte une fonction `start({ name, token })` retournant le client Discord.js connecté. Tout le reste (nombre de fichiers, organisation interne) est libre.

## Prérequis

- [Node.js](https://nodejs.org/) version 18 ou supérieure
- Un ou plusieurs bots créés sur le [Discord Developer Portal](https://discord.com/developers/applications)

## Installation

```bash
git clone https://github.com/nvortex-dev/Discord-Multi-Bot-Launcher.git
cd discord-multi-bot-launcher
npm install
```

Renommez le fichier d'exemple et renseignez vos tokens :

```bash
cp config.example.json config.json
```

Ouvrez `config.json` et remplacez les valeurs `COLLE_ICI_LE_TOKEN_DU_BOTx` par les vrais tokens de vos bots.

## Lancer les bots

```bash
npm start
```

Chaque bot actif (`enabled: true`) dans `config.json` sera démarré. Les logs sont préfixés par le nom du bot pour s'y retrouver facilement.

## Ajouter un nouveau bot

1. Créez un dossier dans `bots/`, par exemple `bots/bot3/`, avec au minimum un `index.js` qui exporte une fonction `start({ name, token })` retournant le client Discord.js connecté (inspirez-vous de `bots/bot1/`).
2. Découpez le code comme vous voulez à l'intérieur du dossier : `events.js`, `commands.js`, `utils.js`... tant que `index.js` reste le point d'entrée et que les `require('./...')` restent cohérents entre les fichiers du bot.
3. Ajoutez une entrée correspondante dans `config.json` (le champ `name` doit correspondre au nom du **dossier**, pas d'un fichier) :

```json
{
  "name": "bot3",
  "token": "TOKEN_DU_BOT3",
  "enabled": true
}
```

Le champ `name` doit correspondre exactement au nom du dossier dans `bots/`.

## Dépannage

**Erreur "Used disallowed intents"** : le bot n'a pas accès à l'intent `MESSAGE CONTENT`. Allez sur le Developer Portal > votre application > Bot > activez **Message Content Intent**.

**Un bot ne démarre pas mais les autres oui** : vérifiez le log correspondant, le launcher isole chaque bot et continue les autres même en cas d'erreur (token invalide, fichier manquant, etc.).

**"Token manquant ou non renseigné"** : le token dans `config.json` contient encore la valeur par défaut `COLLE_ICI_...`, remplacez-le par le vrai token.

## Licence

MIT
