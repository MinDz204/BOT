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
const embed = new EmbedBuilder()
  .setColor( lang.COLOR|| client.color )
  .setTitle("Zi bot help:")
  .setThumbnail('https://cdn.discordapp.com/attachments/1064851388221358153/1143544796393250907/test1.png')
  .setDescription(`${ commands.map(x => `</${x?.name}:${x?.id}> | ${x?.description} `).join('\n') }\n▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬\n**Music Player:**`)
  .addFields([
    { name: "◁", value: `Previous Track`, inline: true },
    { name: "❚❚ | ▶", value: `Pause / Play Track`, inline: true },
    { name: "▷", value: `Next Track`, inline: true },
    { name: "F5", value: `Refresh/Update Messenger`, inline: true },
    { name: "<:sound:1150769215255625759>", value: `Control Volume`, inline: true },
    { name: "<:lyric:1150770291941851187>", value: `Find Lyrics`, inline: true },
    { name: "↻", value: `Loop mode (track | queue)`, inline: true },
    { name: "⤮", value: `Shuffle Queue`, inline: true },
    { name: "✨", value: `Comming Func`, inline: true },
    { name: "Fx", value: `Fillter`, inline: true },
    { name: "<:search:1150766173332443189>", value: `Search`, inline: true },
    { name: "A", value: `Auto Play mode`, inline: true },
    { name: "<:queue:1150639849901133894>", value: `Show Queue`, inline: false },
    // { name: "", value: ``, inline: false },
  ])
  .setTimestamp()
  .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
  .setImage('https://cdn.discordapp.com/attachments/1064851388221358153/1122054818425479248/okk.png');
//
return interaction.editReply({ embeds: [embed] })
  },
};
