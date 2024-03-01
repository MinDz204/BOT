const { EmbedBuilder } = require("discord.js");
const { rank } = require("./Zibot/ZilvlSys");
const config = require("../config");
const playmusic = async(lang, message, client, content) => {
    if (!message.member.voice.channelId) return message.reply({ content: `${lang?.NOvoice}`, ephemeral: true }).catch(e => { })
    const voiceCME = message?.guild.members.cache.get(client.user.id);
    if (voiceCME.voice.channelId && (voiceCME.voice.channelId !== message.member.voice.channelId))
        return message.reply({ content: `${lang?.NOvoiceChannel}`, ephemeral: true }).catch(e => { })
    return require("./ziplayer/ziSearch")(message, content)
}
module.exports = async (client, message) => {
    if ( message.author.bot ) return;
    let content = message?.content?.toLowerCase()
    if (content.includes("@here") || content.includes("@everyone")) return;
    let lang = await rank({ user: message?.author });
    /////////// gi ??????????????????????????//////////////////////////
    if(message?.channel?.id == "1182675589539307520"){
        try{
        let Gichannel =  client.channels.cache.get("1007723706379935747");
        let Gichannel2 =  client.channels.cache.get("946303749448663040");
        ////////////////////////////////////////////////////////////////////
        const expirationPattern = /(\d+)h/;
        const CODEregex = /\(([^)]+)\)/g;
        const messageContent = message?.content || '';
        
        // Extract expiration hours from the input or default to 12 hours
        const expirationMatch = messageContent.match(expirationPattern);
        const expirationHours = expirationMatch ? parseInt(expirationMatch[1], 10) : 12;
        
        // Calculate expiration time in seconds
        const expirationTime = Math.floor((Date.now() + expirationHours * 60 * 60 * 1000) / 1000);
        
        // Replace substrings and add expiration time
        const modifiedMessage = messageContent.replace(
          /(:Primogem:|:Heros_Wit:|:Mora:|:Mystic_Enhancement_Ore:)/g,
          (match, primogem, herosWit, mora, mysticEnhancementOre) => {
            const replacements = {
              ':Primogem:': '<:Primogem:1182685530245312583>',
              ':Heros_Wit:': '<:Heros_Wit:1182685523840618517>',
              ':Mora:': '<:Mora:1182685520602611803>',
              ':Mystic_Enhancement_Ore:': '<:Mystic_Enhancement_Ore:1182685526407528528>',
            };
        
            return replacements[match] || match; // Return replacement or original match if not found
          }
        );
        
        const codeReplacedMessage = modifiedMessage.replace(
          new RegExp(`${expirationHours}h`, 'g'),
          ''
        ).replace(
          CODEregex,
          (match) => `** [${match.replace(/\(|\)/g, '')}](https://genshin.hoyoverse.com/vi/gift?code=${match.replace(/\(|\)/g, '')}) **
\`\`\`bash
${match.replace(/\(|\)/g, '')}\`\`\``
);        
        ///////////
        const info = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`**New promote code found:**`)
        .setURL(`https://genshin.hoyoverse.com/vi/gift`)
        .setDescription(`${codeReplacedMessage}\nCode sẽ hết hạn sau <t:${expirationTime}:R>`)
        .setTimestamp()
        .setFooter({ text: `By Ziji`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
        .setImage("https://cdn.discordapp.com/attachments/1064851388221358153/1209448467077005332/image.png");
        Gichannel?.send({ embeds: [info] });
        Gichannel2?.send({ embeds: [info] });
    }catch(e){
        message.reply(`ERR: ${e}`);
    }
    }
//////////////////////////////////////////////////////////////////////////////////
    if ( message?.reference && content.includes(`<@${client.user.id}>`) ){
    return message.channel?.messages.fetch({ message: message?.reference?.messageId, cache: false, force: true }).then( mess => {
       if(!mess?.content) return;
        return playmusic(lang, message, client, mess.content )
    })}
    
    if (content.includes(`<@${client.user.id}>`))
    if (content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        message.reply({ embeds:[
            new EmbedBuilder()
            .setColor(lang?.COLOR || client.color)
            .setTitle("Yo... Ziji desu :3")
            .setDescription(`${lang?.MENstion}\n${config?.Zmodule} ✅`)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1005716197259612193&permissions=1067357395521&scope=bot%20applications.commands")
            .setTimestamp()
            .setFooter({ text: `${lang?.RequestBY} ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setImage(lang?.banner)
        ]});
    }else{
        if(content.includes("search")){
            if(config.messCreate.GoogleSearch)
            return require("./../commands/search").run(lang, message, content.replace(`<@${client.user.id}>`,"").replace("search",""))
        }else{
            message.react("<a:likee:1210193685501706260>")
            if(config.messCreate.PlayMusic && message?.guild)
            return playmusic(lang, message, client, message?.content.replace(`<@${client.user.id}>`,"") )
        }
    }
}
