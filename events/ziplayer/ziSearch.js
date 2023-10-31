const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const client = require('../../bot');
const { useMainPlayer, QueryType, useQueue } = require("discord-player");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL, processQuery, Zilink, Zitrim } = require("../Zibot/ZiFunc");

const player = useMainPlayer();

module.exports = async (interaction, nameS) => {
  let messid,message;
  messid = await interaction?.reply({ content: `<a:loading:1151184304676819085> Loading...`})
  try{
    message = await interaction.fetchReply().catch(e=>{ });
  }catch(e){
    message =  await interaction.channel?.messages.fetch({ message: messid , cache: false, force: true })
  }
  const queue = useQueue(interaction.guild.id);

  if (!nameS) return;
  if (validURL(nameS) || Zilink(nameS)) {
    try {
      let userddd = await db.ZiUser.findOne({ userID: interaction?.user?.id || interaction?.author?.id }).catch(e => { })
      const nameSearch = await processQuery(nameS);
      await player.play(interaction?.member.voice.channelId, nameSearch, {
        nodeOptions: {
          metadata: {
            channel: interaction.channel,
            requestby: interaction?.user ||interaction?.author,
            embedCOLOR: userddd?.color || client.color,
            Zimess: queue?.metadata? queue?.metadata?.Zimess : message,
          },
          requestedBy: interaction.user || interaction?.author,
          selfDeaf: false,
          volume: userddd?.vol || 50,
          maxSize: 200,
          maxHistorySize: 20,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 2000,
          leaveOnEnd: false,
          skipOnNoStream: true,
        }
      });
      if(queue?.metadata) message?.delete();
      return;
    } catch (e) {
      console.log(e)
      let lang = await rank({ user: interaction?.user || interaction?.author });
      return message?.edit(`${lang?.PlayerSearchErr}`).then(
        setTimeout(function() {
          message?.delete().catch(e => { });
        }, 10000)
      )
    }
  }
  let lang = await rank({ user: interaction?.user || interaction?.author });
  let res = await player.search(nameS, {
    fallbackSearchEngine: QueryType.YOUTUBE,
    requestedBy: interaction?.user || interaction?.author,
  });
  const maxTracks = res.tracks.filter(t => t?.url.length < 100).slice(0, 20);
  let track_button_creator = maxTracks.map((Track, index) => {
    return new ButtonBuilder()
      .setLabel(`${index + 1}`)
      .setStyle(ButtonStyle.Secondary)
      .setCustomId(`${maxTracks[Number(index)].url}`)
  })
  let buttons1, buttons2, buttons3, buttons4, code;
  let cancel = new ButtonBuilder()
    .setLabel("❌")
    .setStyle(ButtonStyle.Danger)
    .setCustomId('cancel');
  let cancelB = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setLabel("❌")
      .setStyle(ButtonStyle.Danger)
      .setCustomId('cancel'));

  const embed = new EmbedBuilder()
    .setColor(lang?.COLOR || client.color)
    .setTitle(`${lang?.PlayerSearch} ${nameS}`)
    .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${Zitrim( track?.title , 35)} | \`${Zitrim(track.author,10)}\``).join('\n')}\n <:cirowo:1007607994097344533>`)
    .setTimestamp()
    .setFooter({ text: `${lang?.RequestBY} ${interaction?.user?.tag || interaction?.author?.tag}`, iconURL: interaction?.user?.displayAvatarURL({ dynamic: true }) || interaction?.author?.displayAvatarURL({ dynamic: true }) })

  switch (track_button_creator.length) {
    case 1:
    case 2:
    case 3:
    case 4:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, Math.min(track_button_creator.length, 4)))
        .addComponents(cancel);
      code = { embeds: [embed], components: [buttons1] }
      break;
    case 5:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, 5));
      code = { embeds: [embed], components: [buttons1, cancelB] }
      break;
    case 6:
    case 7:
    case 8:
    case 9:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, 5));
      buttons2 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(5, Math.min(track_button_creator.length, 9)))
        .addComponents(cancel);
      code = { embeds: [embed], components: [buttons1, buttons2] }
      break;
    case 10:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, 5));
      buttons2 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(5, 10));
      code = { embeds: [embed], components: [buttons1, buttons2, cancelB] }
      break;
    case 11:
    case 12:
    case 13:
    case 14:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, 5));
      buttons2 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(5, 10));
      buttons3 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(10, Math.min(track_button_creator.length, 14)))
        .addComponents(cancel);
      code = { embeds: [embed], components: [buttons1, buttons2, buttons3] }
      break;
    case 15:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, 5));
      buttons2 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(5, 10));
      buttons3 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(10, 15));
      code = { embeds: [embed], components: [buttons1, buttons2, buttons3, cancelB] }
      break;
    case 20:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, 5));
      buttons2 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(5, 10));
      buttons3 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(10, 15));
      buttons4 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(15, 20));
      code = { embeds: [embed], components: [buttons1, buttons2, buttons3, buttons4, cancelB] }
      break;
    default:
      buttons1 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(0, 5));
      buttons2 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(5, 10));
      buttons3 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(10, 15));
      buttons4 = new ActionRowBuilder()
        .addComponents(track_button_creator.slice(15, Math.min(track_button_creator.length, 19)))
        .addComponents(cancel);
      code = { embeds: [embed], components: [buttons1, buttons2, buttons3, buttons4] }
      break;
  }
  return message?.edit(code).catch(e => interaction?.channel?.send(code))
}