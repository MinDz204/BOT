const { Client, GatewayIntentBits, Partials,Events } = require("discord.js");
const config = require("./config.js");
const fs = require("fs");
const { Player } = require('discord-player');
const { addSpeechEvent } = require("./events/Zibot/discord-speech");
const client = new Client({
  partials: [
    Partials.Message, // for message
    Partials.Channel, // for text channel
    Partials.GuildMember, // for guild member
    Partials.Reaction, // for message reaction
    Partials.GuildScheduledEvent, // for guild events
    Partials.User, // for discord user
    Partials.ThreadMember, // for thread member
  ],
  intents: [
    GatewayIntentBits.Guilds, // for guild related things
    GatewayIntentBits.GuildMembers, // for guild members related things
    GatewayIntentBits.GuildEmojisAndStickers, // for manage emojis and stickers
    GatewayIntentBits.GuildIntegrations, // for discord Integrations
    GatewayIntentBits.GuildWebhooks, // for discord webhooks
    GatewayIntentBits.GuildInvites, // for guild invite managing
    GatewayIntentBits.GuildVoiceStates, // for voice related things
    GatewayIntentBits.GuildPresences, // for user presence things
    GatewayIntentBits.GuildMessages, // for guild messages things
    GatewayIntentBits.GuildMessageReactions, // for message reactions things
    GatewayIntentBits.GuildMessageTyping, // for message typing things
    GatewayIntentBits.DirectMessages, // for dm messages
    GatewayIntentBits.DirectMessageReactions, // for dm message reaction
    GatewayIntentBits.DirectMessageTyping, // for dm message typinh
    GatewayIntentBits.MessageContent, // enable if you need message content things
  ],
  shards: 'auto',
});
addSpeechEvent(client, { lang: "vi" });
client.color = config.color;
module.exports = client;
//-------------------------------------------------------------//
//        discord player          //
//-------------------------------------------------------------//
const player = new Player(client, {
  useLegacyFFmpeg: true,
  ytdlOptions: {
    filter: "audioonly",
    opusEncoded: true,
    quality: 'highestaudio',
  }
});
player.setMaxListeners(200);
player.extractors.loadDefault()

// player.events.on("debug",(_,m) => console.log(m));
// player.on("debug",console.log)
// console.log(player.scanDeps())

fs.readdir("./events/player", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const Playerevent = require(`./events/player/${file}`);
    let playerName = file.split(".")[0];
    console.log(`👌 Loadded player Event: ${playerName}`);
    player.events.on(playerName, Playerevent.bind(null, client));
    delete require.cache[require.resolve(`./events/player/${file}`)];
  });
});

fs.readdir("./events", (_err, files) => {
  files.forEach((file) => {
    if (!file.endsWith(".js")) return;
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`👌 Loadded Event: ${eventName}`);
    client.on(eventName, event.bind(null, client));
    delete require.cache[require.resolve(`./events/${file}`)];
  });
});

client.commands = [];
fs.readdir("./commands", (err, files) => {
  if (err) throw err;
  files.forEach(async (f) => {
    try {
      let props = require(`./commands/${f}`);
      client.commands.push({
        name: props.name,
        description: props.description,
        options: props.options
      });
      console.log(`Loaded command: ${props.name}`);
    } catch (err) {
      console.log(err);
    }
  });
});


process.on('unhandledRejection', error => {
  client.errorLog?.send(`<t:${Math.floor(Date.now() / 1000)}:R>\n${error?.stack}`)
  console.error('Unhandled promise rejection:', error);
});

client.login(config.token).catch(e => {
  console.log("The Bot Token You Entered Into Your Project Is Incorrect Or Your Bot's INTENTS Are OFF!")
})