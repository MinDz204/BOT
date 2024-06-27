const db = require("./../../mongoDB");
const client = require('../../bot');
const { useMainPlayer, useQueue } = require("discord-player");
const { rank } = require("../Zibot/ZilvlSys");
const { tracsrowslecs, validURL, processQuery, Zilink, ZifetchInteraction, extractId, ZiplayerOption } = require("../Zibot/ZiFunc");
const player = useMainPlayer();

module.exports = async (interaction, nameS, SearchEngine = 'youtube') => {
  let message;
  if (interaction.type == 3) {
    interaction.deferUpdate().catch(e => { });
    // await interaction?.message.edit({ content: `<a:loading:1151184304676819085> Loading...`})
    message = await interaction.channel?.messages.fetch({ message: interaction?.message?.id, cache: false, force: true })
  } else {
    message = await ZifetchInteraction(interaction);
  }
  const queue = useQueue(interaction.guild.id);
  if (!nameS) return;
  if (validURL(nameS) || Zilink(nameS)) {
    try {
      const nameSearch = await processQuery(nameS);
      const user = await db.ZiUser.findOne({ userID: interaction?.user?.id || interaction?.author?.id }).catch(e => { });
      await player.play(interaction?.member.voice.channelId, nameSearch, {
        nodeOptions: ZiplayerOption({ interaction, message, queue, user })
      });
      if (queue?.metadata && (queue?.metadata?.Zimess.id != message.id)) message?.delete();
      return;
    } catch (e) {
      console.log(e)
      let lang = await rank({ user: interaction?.user || interaction?.author });
      return message?.edit(`${lang?.PlayerSearchErr}`).then(
        setTimeout(function () {
          message?.delete().catch(e => { });
        }, 10000)
      ).catch(e => { })
    }
  }
  let lang = await rank({ user: interaction?.user || interaction?.author });
  if (extractId(nameS?.replace(`<@${client.user.id}>`, "").trim())) return require("./ZiPlaylist")({ interaction, message, nameS, player, queue, lang });
  let res = await player.search(nameS, {
    // fallbackSearchEngine: "youtube",// SearchEngine,
    searchEngine: SearchEngine,
    requestedBy: interaction?.user || interaction?.author,
  });
  let embed = await tracsrowslecs(res, lang, nameS, interaction);
  return message?.edit(embed).catch(e => interaction?.user?.send(e?.message));
}