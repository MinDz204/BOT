module.exports = {
    name: "regwelcome",
    description: "register channel welcome (Administrator).",
    options: [{
        name: "content",
        description: "content description... [[user]] = user add ",
        type: 3,
      },{
        name: "imgcontent",
        description: "link img content",
        type: 3,
      }],
    cooldown: 3,
    NODMPer: true,
  };
const { EmbedBuilder } = require('discord.js');
const client = require('../bot');
const db = require("../mongoDB");
  
module.exports.run = async ( lang, interaction ) => {
const name = interaction.options.getString("content");
const img = interaction.options.getString("imgcontent");
if(!interaction?.member?.permissions?.has("0x0000000000000020")) return interaction.reply({content:`Bạn phải có quyền Administrator để sử dụng lệnh này :<`, ephemeral: true })
interaction?.reply({content:`<a:loading:1151184304676819085> Loading...`, ephemeral: true }).then(async Message => { setTimeout(function(){
    Message?.delete().catch( e => { } );
},10000)}).catch(e => { console.log(e) })
let embed = new EmbedBuilder()
    .setColor( lang?.COLOR || client.color )
    .setDescription(`Đã lấy ${interaction.channel} để gửi lời chào đến thành viên mới!`)
let guilss = await db?.Ziguild?.findOne({ GuildID: interaction?.guild.id })
if ( guilss && guilss.channelID == interaction.channel.id){
    await db.Ziguild.deleteOne({ GuildID: interaction.guild.id })
    embed.setDescription(`Bé Zi hông còn gửi lời chào đến thành viên mới vào ${interaction.channel}`)
    return interaction.channel.send({ embeds: [ embed ] })
}
await db.Ziguild.updateOne({ GuildID: interaction.guild.id }, {
    $set: {
        channelID: interaction.channel.id,
        content: name,
        img: img,
    }
    }, { upsert: true })
return interaction.channel.send({ embeds: [ embed ] })
}

