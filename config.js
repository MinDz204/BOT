module.exports = {
    Ziusr:{},
    color: "#1a8cff",
    MOGOURL:"mongodb+srv://zijipia:DsmTFCGPLWLIW0xT@divahost.vfxpbsy.mongodb.net/?retryWrites=true&w=majority",
    Status: "idle",
    botStatus:"Ziji",
    //['anime', 'assictance', 'csgo', 'daily', 'help', 'language', 'p', 'ping', 'play', 'player','profile','regwelcome','search'],
    Discommands: [],
    rest: true,
    messCreate:{
        ASSis: true,
        PlayMusic: true,
        GoogleSearch: true,
    },

    guildMemberAdd: true,
    interactionCreate:{
        ApplicationCommand: true,
        MessageComponent: true,/*alway true =>*/ MessageComponentInside: true,
        ApplicationCommandAutocomplete: true,
        ModalSubmit: true,
    }
}
