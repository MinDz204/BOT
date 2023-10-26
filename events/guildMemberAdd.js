const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const db = require("../mongoDB");
const gifFrames = require('gif-frames');
const GIFEncoder = require('gif-encoder-2');
const { renderFrame } = require("./Zibot/ZiFunc");
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
channel.send({ embeds:[embedsss] })
}

let url = guild?.gif ? guild?.gif : config.Ziusr.gif

const firstframe = await gifFrames({url, frames: 0})
const cumulative = firstframe[0].frameInfo.disposal !== 1 ? false : true;
  
  let data = await gifFrames({url, frames: 'all', cumulative })
  if(data.length >= 30) data = data.slice(0, 30)


const encoder = new GIFEncoder(700, 250);
encoder.start();
encoder.setDelay(50)
const frames = await Promise.all(data.map(x => renderFrame( x, member?.user, data,  member?.guild )))
for(let frame of frames) encoder.addFrame(frame)
encoder.finish();
const file = new AttachmentBuilder(encoder.out.getData(), { name: "welcome.gif" });

return channel.send({ files: [file] })

}