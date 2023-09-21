const { EmbedBuilder } = require("discord.js");
module.exports = async ( client, queue, track ) =>{
    let embed = new EmbedBuilder()
    .setDescription(`Đã thêm danh sách phát: [${track[0]?.playlist?.title}](${track[0]?.playlist?.url})`)
    .setThumbnail(track?.thumbnail)
    .setColor(queue?.metadata?.embedCOLOR || client.color)

return queue?.metadata?.channel?.send({ embeds:[ embed ] }).then(async Message => { setTimeout(function(){
    Message.delete();
},10000)}).catch(e => { console.log(e) })
}