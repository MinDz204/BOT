const { useQueue, serialize } = require("discord-player");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');
const db = require("./../mongoDB");
const client = require("../bot");

function removeDuplicates(array) {
  const seen = new Set();
  return array.filter(item => {
    const duplicate = seen.has(item.url);
    seen.add(item.url);
    return !duplicate;
  });
}

module.exports = {
  name: "save",
  description: "Saves the played music to you.",
  integration_types: [0],
  contexts: [0, 1, 2],
  options: [
    {
      name: "type",
      description: "Saves type.",
      type: 3,
      required: true,
      choices: [
        { name: "Now Playing", value: "now" },
        { name: "Queue", value: "queue" }
      ],
    },
    {
      name: "name",
      description: "Playlist name",
      type: 3,
      required: true,
    },
    {
      name: "private",
      description: "Set private",
      type: 5
    }
  ],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  dm_permission: false,
  run: async (lang, interaction) => {
    try {
      const messages = await ZifetchInteraction(interaction);
      const saveType = interaction.options?.getString("type");
      const isPrivate = interaction.options?.getBoolean("private") || false;
      const playlistName = interaction.options?.getString("name").replace("_", "") ||
        interaction.fields?.getTextInputValue("listname").replace("_", "") ||
        interaction.user.tag || "Unknown";

      const queue = useQueue(interaction.guild.id);
      if (!queue || !queue.node.isPlaying() && queue.isEmpty()) {
        await messages.edit(`${lang?.NoPlaying}`);
        return;
      }

      const tracks = [
        serialize(queue.currentTrack),
        ...(saveType === "queue" ? queue.tracks.map(serialize) : [])
      ];

      const playlist = await db.playlist.findOne({ userID: interaction.user.id, listname: playlistName });

      const updatedPlaylist = {
        $set: {
          userN: interaction.user.tag,
          plays: playlist ? playlist.plays : 0,
          private: isPrivate,
          createdTime: playlist ? playlist.createdTime : Date.now(),
          Song: removeDuplicates(playlist ? tracks.concat(playlist.Song) : tracks)
        }
      };

      await db.playlist.updateOne({ userID: interaction.user.id, listname: playlistName }, updatedPlaylist, { upsert: true });

      messages.edit({
        content: ``,
        embeds: [
          new EmbedBuilder()
            .setColor(lang?.COLOR || client.color)
            .setDescription(`${lang?.savedPlaylist}: ${playlistName}\n Sử dụng: Tag <@${client.user.id}> + ${interaction.user} + (${playlistName})`)
        ],
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("cancel")
              .setLabel("❌")
              .setStyle(ButtonStyle.Secondary)
          )
        ]
      });

    } catch (e) {
      console.error("Error in save command:", e);
    }
  },
};
