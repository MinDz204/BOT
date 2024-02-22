const { useQueue } = require("discord-player");
const db = require("./../../mongoDB");
const { zistart } = require("./../ziplayer/ziStartTrack");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL, timeToSeconds } = require("../Zibot/ZiFunc");
const { lyricFind } = require("../ziplayer/Zilyric");

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
          await interaction?.message.edit(await lyricFind(queue?.currentTrack, interaction?.user, lang, queue)).catch(e => { });
          return interaction.deleteReply().catch(e => { });
        }else{
          return interaction.reply({ content: `❌ | Something went wrong.`});
        }
      }
      break;
      case "ZiModalVol": {
        await interaction.deferReply({ ephemeral: true }).catch(e => { });
        const queue = useQueue(interaction?.guildId);
        const vol = interaction.fields.getTextInputValue("resu");
        if (!isNumber(vol)) return interaction.editReply({ content: `${lang?.volumeErr}`, ephemeral: true }).catch(e => { });
        queue.node.setVolume(Math.abs(vol))
        await db.ZiUser.updateOne({ userID: interaction.user.id }, {
          $set: {
            vol: Math.abs(vol),
          }
        }, { upsert: true })
        interaction.deleteReply().catch(e => { });
        return queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { });
      }
      case "DelTrackmodal": {
        const num = interaction.fields.getTextInputValue("number");
        if (!isNumber(num)) return interaction.reply({ content: `${lang?.DeltrackErr}`, ephemeral: true }).catch(e => { });
        const queue = useQueue(interaction?.guildId);
        queue.removeTrack(Math.abs(num) - 1)
        return require("./../ziplayer/Ziqueue")(interaction, queue, lang, true);
      }
      case "editProfilemodal": {
        let hexcolo = interaction.fields.getTextInputValue("Probcolor");
        let imga = interaction.fields.getTextInputValue("Probimage");
        let okii = 0;
        if (!!hexcolo && !!hextest.test(hexcolo)) {
          okii += 1;
          await db.ZiUser.updateOne({ userID: interaction.user.id }, {
            $set: { color: hexcolo }
          }, { upsert: true });
        }
        if (!!imga && !!validURL(imga)) {
          okii += 2;
          await db.ZiUser.updateOne({ userID: interaction.user.id }, {
            $set: { image: imga }
          }, { upsert: true });
        }
        let desp = okii == 0 ? `${lang?.profileErr}` : okii == 1 ? `${lang?.profilecol}` : okii == 2 ? `${lang?.profilepic}` : `${lang?.profilesuss}`
        return interaction.reply({ content: `${desp}`, ephemeral: true }).catch(e => { });
      }
      case"ZiVCMODALrename":{
        interaction.member.voice.channel.edit({
          name: interaction.fields.getTextInputValue("resu")
        })
       	return interaction.deferUpdate().catch(e => { });
      }
      case "GIUIDProfilemodal":{

        const vol = interaction.fields.getTextInputValue("uid");
        if (!isNumber(vol)) return interaction.reply({ content: `${lang?.volumeErr}`, ephemeral: true }).catch(e => { });
        await interaction.deferUpdate( ).catch(e => { });
        await db.ZiUser.updateOne({ userID: interaction.user.id }, {
          $set: {
            GIUID: vol,
          }
        }, { upsert: true })
        return;
      }
      default:
        console.log(interaction.customId)
    }
//EQ::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::://
    if (interaction?.customId.includes("ZiModalEQ")){
      const queue = useQueue(interaction?.guildId);
      const Gain = interaction.fields.getTextInputValue("Gain");
      return require("./../ziplayer/ZiEQ")(interaction, lang, queue, Gain)
    } 
   
  } catch (e) {
    console.log(e)
  }
}
