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
            .setDescription(`${lang?.MENstion}`)
            .setURL("https://discord.com/api/oauth2/authorize?client_id=1005716197259612193&permissions=1067357395521&scope=bot%20applications.commands")
            .setTimestamp()
            .setFooter({ text: `${lang?.RequestBY} ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
            .setImage('https://cdn.discordapp.com/attachments/1064851388221358153/1122054818425479248/okk.png')
        ]});
    }else{
        if(content.includes("search")){
            if(config.messCreate.GoogleSearch)
            return require("./../commands/search").run(lang, message, content.replace(`<@${client.user.id}>`,"").replace("search",""))
        }else{
            if(config.messCreate.PlayMusic)
            return playmusic(lang, message, client, message?.content.replace(`<@${client.user.id}>`,"") )
        }
    }
}
