const db = require("./../../mongoDB");
const client = require('../../bot');
const { useMainPlayer, useQueue } = require("discord-player");
const { rank } = require("../Zibot/ZilvlSys");
const {tracsrowslecs, validURL, processQuery, Zilink, ZifetchInteraction } = require("../Zibot/ZiFunc");
const config = require("./../../config")
const player = useMainPlayer();

module.exports = async (interaction, nameS, SearchEngine = 'auto' ) => {
  if(!config.messCreate.PlayMusic) return;
  let message;
  if( interaction.type == 3 ){
    interaction.deferUpdate().catch(e => { });
    await interaction?.message.edit({ content: `<a:loading:1151184304676819085> Loading...`})
    message = await interaction.channel?.messages.fetch({ message: interaction?.message?.id , cache: false, force: true })
  }else {
    message = await ZifetchInteraction(interaction);
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
            ZsyncedLyrics: { messages: queue?.metadata?.ZsyncedLyrics?.messages, Status: queue?.metadata?.ZsyncedLyrics?.Status || false },
          },
          requestedBy: interaction?.user || interaction?.author,
          selfDeaf: false,
          volume: userddd?.vol || 50,
          maxSize: 200,
          maxHistorySize: 20,
          leaveOnEmpty: true,
          leaveOnEmptyCooldown: 2000,
          leaveOnEnd: true,
          leaveOnEndCooldown: 300000,
          skipOnNoStream: true,
          selfDeaf: true,
        }
      });
      if(queue?.metadata && ( queue?.metadata?.Zimess.id != message.id ) ) message?.delete();
      return;
    } catch (e) {
      console.log(e)
      let lang = await rank({ user: interaction?.user || interaction?.author });
      return message?.edit(`${lang?.PlayerSearchErr}`).then(
        setTimeout(function() {
          message?.delete().catch(e => { });
        }, 10000)
      ).catch(e => { })
    }
  }
  let lang = await rank({ user: interaction?.user || interaction?.author });
  let res = await player.search(nameS, {
    fallbackSearchEngine: SearchEngine,
    requestedBy: interaction?.user || interaction?.author,
  });
 let embed = await tracsrowslecs(res, lang, nameS, interaction);
  if (SearchEngine != 'auto'){
    message.delete().catch(e => console.log);
    return interaction.edit( embed ).catch(  e => interaction?.user?.send( e?.message ));}
  return message?.edit( embed ).catch(  e => interaction?.user?.send( e?.message ));
}