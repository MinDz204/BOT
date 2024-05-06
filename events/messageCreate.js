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
    if (message?.content.includes("@here") || message?.content.includes("@everyone")) return;
    if (!message?.content.includes(`<@${client.user.id}>`)) return;
    let content = message?.content?.toLowerCase();
    let lang = await rank({ user: message?.author });
//////////////////////////////////////////////////////////////////////////////////
    if ( message?.reference && content.includes(`<@${client.user.id}>`) ){
    return message.channel?.messages.fetch({ message: message?.reference?.messageId, cache: false, force: true }).then( mess => {
        let  msgcontenet = mess?.content;
       if(!msgcontenet){
            const targetMessage = mess?.embeds[0]?.data;
            if (targetMessage?.fields[0]?.name.includes("▒") || targetMessage?.fields[0]?.name.includes("█")) {
                msgcontenet = targetMessage.author?.url;
            }
            else return  interaction?.reply(`${lang?.PlayerSearchErr}`).then( async messs => {
                setTimeout(function() {
                  messs?.delete().catch(e => { });
                }, 10000)
            })
       }
        return playmusic(lang, message, client, msgcontenet )
    })}
    
    if (content.includes(`<@${client.user.id}>`))
    if (content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
        message.reply({ embeds:[
            new EmbedBuilder()
            .setColor(lang?.COLOR || client.color)
            .setTitle("Yo... Ziji desu :3")
            .setDescription(`${lang?.MENstion}\n${config?.Zmodule} ✅`)
            .setURL(`${client?.InviteBot}`)
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
