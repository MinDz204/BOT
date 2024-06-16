const { useQueue } = require("discord-player");
const db = require("./../../mongoDB");
const { zistart } = require("./../ziplayer/ziStartTrack");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL, timeToSeconds, Zitrim, ZifetchInteraction } = require("../Zibot/ZiFunc");
const { SEEKfunc } = require("../ziplayer/ZiSeek");
const config = require("../../config");
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, StringSelectMenuOptionBuilder, ButtonBuilder } = require("discord.js");
const { Deltrack } = require("../../lang/vi");
//test func
var hextest = /^#[0-9A-F]{6}$/i;
function isNumber(str) {
  return /^[0-9]+$/.test(str);
}

module.exports = async (client, interaction) => {
  try {
    let lang = await rank({ user: interaction?.user });
    switch (interaction.customId) {
      case "ZiCompSearch": {
        const nameS = interaction.fields.getTextInputValue("resu");
        return require("./../ziplayer/ziSearch")(interaction, nameS)
      }
      case "ZiSEEKK": {
        await interaction.deferReply({ ephemeral: true }).catch(e => { });
        const queue = useQueue(interaction?.guildId);
        if (!queue) return;
        const timestamp = queue.node.getTimestamp();
        if (timestamp.progress == 'Forever') return interaction.editReply({ content: `❌ | Can't seek in a live stream.`});
        const str = interaction.fields.getTextInputValue("Time");
        const tragetTime = timeToSeconds(str);
        const musicLength = timeToSeconds(timestamp.total.label);
        if(!tragetTime) return interaction.editReply({ content: `❌ | Invalid format for the target time.\n(**\`ex: 3m20s, 1m 50s, 1:20:55, 5:20\`**)`});
        if (tragetTime >= musicLength) return interaction.reply({ content: `❌ | Target time exceeds music duration. (\`${timestamp.total.label}\`)`});
        const success = queue.node.seek(tragetTime * 1000);
        if (success){
          await interaction?.message.edit(await SEEKfunc(queue?.currentTrack, interaction?.user, lang, queue)).catch(e => { });
          return interaction.deleteReply().catch(e => { });
        }else{
          return interaction.reply({ content: `❌ | Something went wrong.`});
        }
      }
      break;
      case "DelTrackmodal": {
        const input = interaction.fields.getTextInputValue("number");
        const queue = useQueue(interaction?.guildId);
        
        // Sử dụng biểu thức chính quy để tách các chỉ số bài hát
        const trackIndices = input.split(/[\s,;]+/); // phân cách bằng khoảng trắng, dấu phẩy, hoặc dấu chấm phẩy
        const invalidInput = trackIndices.some(index => !isNumber(index));
        
        if (invalidInput) {
            return interaction.reply({ content: `${lang?.DeltrackErr}`, ephemeral: true }).catch(e => { });
        }
        
        // Chuyển đổi các giá trị thành số và loại bỏ các bài hát trong hàng chờ
        const validIndices = trackIndices
            .map(index => Math.abs(Number(index)) - 1)
            .filter(index => index >= 0);
        
        validIndices
            .sort((a, b) => b - a) // xóa từ cuối về đầu để tránh lỗi khi xóa liên tiếp
            .forEach(index => queue.removeTrack(index));
        
        return require("./../ziplayer/Ziqueue")(interaction, queue, lang, true);        
      }
      case "editProfilemodal": {
        let hexcolo = interaction.fields.getTextInputValue("Probcolor");
        let imga = interaction.fields.getTextInputValue("Probimage");
        let imgs = !!imga && !!validURL(imga) ? imga : "";
        let hexxs = !!hexcolo && !!hextest.test(hexcolo) ? hexcolo : "";
        await db.ZiUser.updateOne({ userID: interaction.user.id }, {
          $set: { 
            color: hexxs,
            image: imgs 
          }
        }, { upsert: true });
        return interaction.reply({ content: `${lang?.profilesuss}`, ephemeral: true }).catch(e => { });
      }
      case"ZiVCMODALrename":{
        interaction.member.voice.channel.edit({
          name: interaction.fields.getTextInputValue("resu")
        })
       	return interaction.deferUpdate().catch(e => { });
      }
      case "DelPlaylistmodal":{
        const listname = interaction.fields.getTextInputValue("listname");
        const playlist = await db.playlist.findOne({ userID: interaction.user.id, listname}).catch(e=> console.error);
        if (!playlist) return interaction.reply({ content: `${lang.NoPlaylist.replace("{USER}",`${interaction.user.id}`)}`, ephemeral: true }).catch(e => { });
        const message = await ZifetchInteraction(interaction);
        await message.edit({
          content:"",
          embeds:[
            new EmbedBuilder()
              .setColor(lang?.COLOR || client.color)
              .setDescription(`**Playlist:**${Zitrim(playlist?.Song?.map((song, index)=>{ return `\n${index}.${Zitrim(song?.title,30)}`},4000))}`)
              .setTimestamp()
              .setFooter({ text: `${lang?.RequestBY} ${interaction.user?.tag}`, iconURL: interaction.user?.displayAvatarURL({ dynamic: true }) })
              .setImage(lang?.banner)
          ],
          components: [
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId(`ZiDelPlaylist_${listname}_${interaction.user.id}`)
                .setLabel("DELETE")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("❌")
                .setStyle(ButtonStyle.Secondary),
            )
          ]
        })
        return;
      }
      default:
        console.log(interaction.customId)
    }
  } catch (e) {
    console.log(e)
    return client?.errorLog?.send(`**${config?.Zmodule}** <t:${Math.floor(Date.now() / 1000)}:R>\nmodal:${e?.stack}`)
  }
}
