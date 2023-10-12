const { EmbedBuilder } = require("discord.js");
const { rank } = require("./Zibot/ZilvlSys");
const playmusic = async(message, client, content) => {
    if (!message.member.voice.channelId) return message.reply({ content: `${lang?.NOvoice}`, ephemeral: true }).catch(e => { })
    const voiceCME = message?.guild.members.cache.get(client.user.id);
    if (voiceCME.voice.channelId && (voiceCME.voice.channelId !== message.member.voice.channelId))
        return message.reply({ content: `${lang?.NOvoiceChannel}`, ephemeral: true }).catch(e => { })
    return require("./ziplayer/ziSearch")(message, content)
}
module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone")) return;
    if ( message?.reference && message.content.includes(`<@${client.user.id}>`) ){

    // if ()
    return message.channel?.messages.fetch({ message: message?.reference?.messageId, cache: false, force: true }).then( mess => {
       if(!mess?.content) return;
        return playmusic( message, client, mess.content )
    })}
    
    let lang = await rank({ user: message?.author });
    if (message.content.includes(`<@${client.user.id}>`))
    if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
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
        return playmusic( message, client, message.content )
    }
}
