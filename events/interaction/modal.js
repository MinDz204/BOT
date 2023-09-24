const { useQueue } = require("discord-player");
const db = require("./../../mongoDB");
const { zistart } = require("./../ziplayer/ziStartTrack");
const { rank } = require("../Zibot/ZilvlSys");
const { validURL } = require("../Zibot/ZiFunc");

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

      default:
        console.log(interaction.customId)
    }
  } catch (e) {
    console.log(e)
  }
}
