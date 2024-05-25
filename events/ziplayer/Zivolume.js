const { zistart } = require("./ziStartTrack");
const db = require("./../../mongoDB");
function isNumber(str) {
    return /^[0-9]+$/.test(str);
  }
const deleteAfterTimeout = (message, timeout = 10000) => {
    setTimeout(() => {
      message.delete().catch(e => {  });
    }, timeout);
  };

const replyWithPrompt = async (interaction, content) => {
    const message = await interaction.reply({ content, fetchReply: true });
    return message;
  };
  
const editReplyWithTimeout = async (interaction, content, timeout = 1000) => {
    const message = await interaction.editReply({ content, ephemeral: true });
    deleteAfterTimeout(message, timeout);
  };

const resetAfterTimeout = (message, lang, timeout = 10000) => {
    setTimeout(() => {
      message.edit({ content: `${lang?.volumedes} ex: 1 - 100:` }).catch(e => { console.error(e); });
    }, timeout);
  };
const editReplyWithNOTimeout = async (interaction, content, lang, timeout = 1000) => {
    const message = await interaction.editReply({ content, ephemeral: true });
    resetAfterTimeout(message, lang, timeout);
  };
  
const handleVolumeChange = async (interaction, queue, lang) => {
    const reply = await replyWithPrompt(interaction, `${lang?.volumedes}`);
    
    const collectorFilter = (i) => i.author.id === interaction.user.id;
    const collector = interaction.channel.createMessageCollector({ filter: collectorFilter, time: 30000 });
  
    collector.on('collect', async (i) => {
      const userVol = i.content;
      
      if (!isNumber(userVol)) {
        await editReplyWithNOTimeout(interaction, `${lang?.volumeErr}`, lang);
        return;
      }
  
      const volume = Math.abs(userVol);
      const newVolume = volume > 100 ? 100 : volume;
  
      queue?.node?.setVolume(newVolume);
      i.react("<a:likee:1210193685501706260>").catch(e=> console.log);
      await db.ZiUser.updateOne(
        { userID: interaction.user.id },
        { $set: { vol: newVolume } },
        { upsert: true }
      );
  
      await collector.stop(); // stop collector explicitly
      
      await interaction.deleteReply().catch(e => { console.error('Error deleting reply:', e); });
  
      await queue?.metadata?.Zimess.edit(await zistart(queue, lang)).catch(e => { console.error('Error editing Zimess:', e); });
  
      return;
    });
  
    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        editReplyWithTimeout(interaction, `${lang?.volumeErr}`); // Timeout reached
      }
    });
  };
  
  
  module.exports = { handleVolumeChange }