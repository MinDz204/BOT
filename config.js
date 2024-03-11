const full = {
    Ziusr:{},
    color: "Random",
    InviteBot: "https://discord.com/api/oauth2/authorize?client_id=1005716197259612193&permissions=139610933824&scope=bot%20applications.commands",
    MOGOURL:"mongodb+srv://zijipia:DsmTFCGPLWLIW0xT@divahost.vfxpbsy.mongodb.net/?retryWrites=true&w=majority",
    Status: "idle",
    botStatus:"Ziji",
    Ziguild: "1007597270704869387",
    JOINTOCREATECHANNEL: "1167513157137334282",
    EnableJOINTOCREATE: true,
    Zmodule:"Full",
    //['anime', 'assictance', 'csgo', 'daily', 'help', 'language', 'p', 'ping', 'play', 'player','profile','regwelcome','search'],
    Discommands: [],
    DisContext: [],
    rest: true,
    messCreate:{
        GI:true,
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
const diva = {
    Ziusr:{},
    color: "Random",
    InviteBot: "https://discord.com/api/oauth2/authorize?client_id=1005716197259612193&permissions=139610933824&scope=bot%20applications.commands",
    MOGOURL:"mongodb+srv://zijipia:DsmTFCGPLWLIW0xT@divahost.vfxpbsy.mongodb.net/?retryWrites=true&w=majority",
    Status: "idle",
    botStatus:"Ziji",
   	Ziguild: "1007597270704869387",
    JOINTOCREATECHANNEL: "1167513157137334282",
    EnableJOINTOCREATE: true,
    Zmodule:"diva",
    //['anime', 'assictance', 'csgo', 'daily', 'help', 'language', 'p', 'ping', 'play', 'player','profile','regwelcome','search','genshin],
    Discommands: ['anime', 'assictance', 'csgo', 'daily', 'help', 'language', 'p', 'ping', 'play', 'player','profile','regwelcome','genshin'],
    rest: false,
    messCreate:{
        GI:false,
        ASSis: false,
        PlayMusic: false,
        GoogleSearch: true,
    },

    guildMemberAdd: true,
    interactionCreate:{
        ApplicationCommand: true,
        MessageComponent: true,/*alway true =>*/ MessageComponentInside: false,
        ApplicationCommandAutocomplete: false,
        ModalSubmit: false,
    }
}
const daki = {
    Ziusr:{},
    color: "Random",
    InviteBot: "https://discord.com/api/oauth2/authorize?client_id=1005716197259612193&permissions=139610933824&scope=bot%20applications.commands",
    MOGOURL:"mongodb+srv://zijipia:DsmTFCGPLWLIW0xT@divahost.vfxpbsy.mongodb.net/?retryWrites=true&w=majority",
    Status: "idle",
    botStatus:"Ziji",
    Ziguild: "1007597270704869387",
    JOINTOCREATECHANNEL: "1167513157137334282",
    EnableJOINTOCREATE: false,
    Zmodule:"daki",
    //['anime', 'assictance', 'csgo', 'daily', 'help', 'language', 'p', 'ping', 'play', 'player','profile','regwelcome','search','genshin'],
    Discommands: ['search'],
    rest: true,
    messCreate:{
        GI:true,
        ASSis: true,
        PlayMusic: true,
        GoogleSearch: false,
    },

    guildMemberAdd: false,
    interactionCreate:{
        ApplicationCommand: true,
        MessageComponent: true,/*alway true =>*/ MessageComponentInside: true,
        ApplicationCommandAutocomplete: true,
        ModalSubmit: true,
    }
}

module.exports = full;
