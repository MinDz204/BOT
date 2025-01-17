const { useMainPlayer, useQueue, useMetadata, Util } = require('discord-player');
const db = require("./../mongoDB");
const { ZifetchInteraction, Zitrim } = require('../events/Zibot/ZiFunc');
const player = useMainPlayer();
const client = require('../bot');
const { EmbedBuilder } = require('discord.js');
// Sets or updates metadata for synced lyrics in the queue
async function setSyncedLyrics(queue, messages, syncedLyrics, status = true) {
  const guildId = queue?.guild?.id;
  if (!guildId) {
    throw new Error('Guild ID is not provided.');
  }

  const [getMetadata, setMetadata] = useMetadata(guildId);
  const currentMetadata = getMetadata();

  setMetadata({
    ...currentMetadata,
    ZsyncedLyrics: { messages, Status: status, syncedLyrics },
  });
}
// Displays lyrics or stops synced lyrics based on NOstop parameter
async function displayLyrics({ messages, trackName, NOstop, interaction, synced = true }) {
  const queue = useQueue(messages?.guild?.id || "1150638980803592262");

  if (!NOstop && queue?.metadata?.ZsyncedLyrics?.Status && messages?.guild && !trackName) {
    const ZsyncedLyrics = queue.metadata.ZsyncedLyrics;
    ZsyncedLyrics?.syncedLyrics?.unsubscribe();

    await ZsyncedLyrics?.messages?.delete().catch(console.log);
    await setSyncedLyrics(queue, null, null, false);
    await messages.delete().catch(console.log);
    return;
  }
  const songtile = trackName ?? queue?.currentTrack?.title ?? queue?.currentTrack?.title.toString() ?? "11506389808035922621150638980803592262";
  let results = await player.lyrics.search({ q: songtile }).catch(console.log);
  let lyrics = results[0];

  // If no lyrics are found, try again with a modified song title
  if (!lyrics?.plainLyrics) {
    const songtiles = trackName ?? queue?.currentTrack?.cleanTitle ?? queue?.currentTrack?.title.toString() ?? "11506389808035922621150638980803592262";
    results = await player.lyrics.search({ q: songtiles, artistName: queue?.currentTrack?.author.toString() }).catch(console.log);
    lyrics = results[0];
    // If still no lyrics, inform the user and delete the message after a timeout
    if (!lyrics?.plainLyrics) {
      if (!interaction.guild) return interaction.editReply({
        content: '❌| There are **no** lyrics for this track',
        ephemeral: true
      }).catch(console.log);
      await messages.edit({
        content: '❌| There are **no** lyrics for this track',
        ephemeral: true,
      }).then((msg) => setTimeout(() => msg.delete(), 10000)).catch(console.log);
      return;
    }
  }
  const currentMessages = queue?.metadata?.ZsyncedLyrics?.Status ? queue.metadata.ZsyncedLyrics.messages ?? messages : messages;
  const embed = new EmbedBuilder()
    .setTitle(lyrics.trackName)
    .setAuthor({ name: lyrics.artistName })
    .setColor('Random');

  if (!lyrics.syncedLyrics || !synced) {
    if (queue) await setSyncedLyrics(queue, currentMessages, null);
    embed.setDescription(Zitrim(lyrics.plainLyrics, 1997));
    if (!interaction.guild) return interaction.editReply({ content: ' ', embeds: [embed] }).catch(console.log);

    await currentMessages.edit({ content: ' ', embeds: [embed] });
    return;
  }
  const syncedLyrics = queue?.syncedLyrics(lyrics);

  await setSyncedLyrics(queue, currentMessages, syncedLyrics);
  let previousLyrics = '';

  syncedLyrics?.onChange(async (lyricsText, timestamp) => {
    const formatted = Util.buildTimeCode(Util.parseMS(timestamp));
    embed.setDescription(`\`[${formatted}]\`:** ${lyricsText}**\n${previousLyrics}`);
    previousLyrics = `\`[${formatted}]\`: ${lyricsText}`;
    try {
      await currentMessages.edit({ content: ' ', embeds: [embed] });
    } catch (error) {
      await setSyncedLyrics(queue, messages, syncedLyrics);
      try {
        await currentMessages.edit({ content: ' ', embeds: [embed] });
      } catch (e) {
        console.log(e);
      }
    }
  });

  syncedLyrics?.subscribe();

  if (messages.id !== queue.metadata.ZsyncedLyrics?.messages?.id) {
    await messages.delete().catch(console.log);
  }
}
module.exports = {
  name: 'lyrics',
  description: 'Display synced lyrics or stop them.',
  description_localizations: {
    "en-US": "Display synced lyrics or stop them.",
    "vi": "Hiển thị lời bài hát đồng bộ hoặc dừng hiển thị.",
    "ja": "同期歌詞を表示または停止します",
    "ko": "동기화된 가사 표시 또는 중지",
  },
  integration_types: [0, 1],
  contexts: [0, 1, 2],
  options: [{
    name: 'name',
    description: 'Song name',
    type: 3,
    autocomplete: true
  }, {
    name: 'synced',
    description: 'Synced Lyrics',
    type: 5,
  }],
  cooldown: 3,
  dm_permission: true,
  run: async (lang, interaction, NOstop) => {
    const messages = await ZifetchInteraction(interaction);
    const trackName = interaction?.options?.getString('name');
    const synced = interaction?.options?.getBoolean('synced');
    return displayLyrics({ messages, trackName, NOstop, interaction, synced });
  },
};
