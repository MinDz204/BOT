const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("../mongoDB");
const config = require("../config");
module.exports = async (client , member ) =>{
if (!config?.guildMemberAdd) return;
let guild = await db?.Ziguild?.findOne({ GuildID: member?.guild.id })
if (!guild) return;
let channel = client.channels.cache.get( guild?.channelID )
if( guild?.content ){
let content = guild?.content
const embedsss = new EmbedBuilder()
    .setDescription(`${content.replace(`[[user]]`, member.user).replace("\n", `\n`)}`)
    .setColor(client?.color)
    if(guild?.img)  embedsss.setImage(`${guild?.img}`)
    return channel.send({ embeds:[embedsss] })
}
}