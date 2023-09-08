const { EmbedBuilder } = require("discord.js");
module.exports = async ( client, queue, track ) =>{
    console.log(track)
    let embed = new EmbedBuilder()
    .setDescription(`Đã thêm danh sách phát: [${track?.title}](${track?.url}) \`[${track?.duration}]\``)
    .setThumbnail(track?.thumbnail)
    .setColor(client.color)

return queue?.metadata.channel.send({ embeds:[ embed ] }).then(async Message => { setTimeout(function(){
    Message.delete();
},10000)}).catch(e => { console.log(e) })
}