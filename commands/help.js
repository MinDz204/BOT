const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, Message } = require('discord.js');
const client = require('..');
module.exports = {
  name: "help",
  description: "Show bot command.",
  options: [ ],
  cooldown: 3,
  run: async ( lang, interaction ) => {
    await interaction.deferReply().catch(e=>{ });
//
const commands = client.Zicomand;
const row = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
  .setCustomId("cancel")
  .setLabel("❌")
  .setStyle(ButtonStyle.Secondary)
)
const embed = new EmbedBuilder()
  .setColor( lang.COLOR|| client.color )
  .setTitle("Zi bot help")
  .setThumbnail(client.user.displayAvatarURL())
  .setDescription(`${ commands.map(x => `</${x?.name}:${x?.id}> | ${x?.description} `).join('\n') }`)
  .setTimestamp()
  .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
//
return interaction.editReply({ embeds: [embed], components:[row] }).then(async Message => setTimeout(function(){
  Message?.edit({components:[ ]}).catch(e=>{ });;
},1000)).catch(e=>{ });

  },
};
