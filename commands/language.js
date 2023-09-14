const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const client = require('..');
const db = require("./../mongoDB");
const { rank } = require('../events/Zibot/ZilvlSys');

module.exports = {
  name: "language",
  description: "Change bot language.",
  options: [{
    name: "name",
    description: "Name language",
    type: 3,
    required: true,
    choices:[
        { "name": 'Tiếng Việt', "value": 'vi' },
        { "name": 'English', "value": 'en' },
        { "name": 'Japanese', "value": 'jp' },
        { "name": 'Korean', "value": 'ko' },
        { "name": 'China (Simplified)', "value": 'zh' },
    ]
  }],
  cooldown: 10,
  run: async ( langOld, interaction ) => {
    interaction?.reply({content:`<a:loading:1151184304676819085> Loading...`, ephemeral: true }).then(async Message => { setTimeout(function(){
      Message?.delete().catch( e => { } );
  },10000)}).catch(e => { console.log(e) })

    const name = interaction.options.getString("name");
    await db.ZiUser.updateOne({ userID: interaction?.user?.id },{
        $set:{
            userN: interaction?.user?.tag,
            lang: name,
        }
    },{ upsert: true }).catch(e => { })
  let lang = await rank({ user: interaction?.user });
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("❌")
    .setStyle(ButtonStyle.Secondary)
  )

const embed = new EmbedBuilder()
  .setColor( lang.COLOR || client.color )
  .setThumbnail(client.user.displayAvatarURL())
  .setDescription(`${lang?.ChangeLanguage}`)
  .setTimestamp()
  .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
//
return interaction.channel.send({ embeds: [embed], components:[row] }).then(async Message => setTimeout(function(){
    Message?.edit({components:[ ]}).catch(e=>{ });;
  },10000)).catch(e=>{ });

  },
};
