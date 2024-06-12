// config.js
module.exports = {
    color: "Random",
    InviteBot: "https://discord.com/oauth2/authorize?client_id=1005716197259612193",
    MOGOURL:"",
    Status: "idle",
    botStatus:"Ziji", //    botStatus:"Ziji",
    Ziguild: "",//    error channel:,
    JOINTOCREATECHANNEL: "",//    join to create voice channel:,
    EnableJOINTOCREATE: true,
    Zmodule:"Full",
    //['anime', 'assictance', 'csgo', 'daily', 'help', 'language', 'p', 'ping', 'play', 'player','profile','regwelcome','search'],
    Discommands: [],
    DisContext: [],
    rest: true,// loaded application [/] commands.
    ZiFuncs:{
        PlayMusic: true,
    },

    guildMemberAdd: true,
    interactionCreate:{
        ApplicationCommand: true,
        MessageComponent: true,/*alway true =>*/ MessageComponentInside: true,
        ApplicationCommandAutocomplete: true,
        ModalSubmit: true,
    }
}