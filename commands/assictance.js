
const { useMainPlayer } = require('discord-player');
const { joinVoiceChannel } = require("@discordjs/voice");
const player = useMainPlayer();
const db = require("./../mongoDB");
const { EmbedBuilder } = require('discord.js');
const client = require('../bot');
const config = require('../config');

module.exports = {
  name: "assictance",
  description: "Play/add music.",
  options: [],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  run: async (lang, interaction) => {
    if(!config.messCreate.PlayMusic || !config.messCreate.ASSis) return;
    let embed = new EmbedBuilder()
      .setColor(lang?.COLOR || client.color)
      .setDescription(`${lang?.Assictance}`)
    await interaction?.reply({ embeds: [embed], ephemeral: false })

    let userddd = await db.ZiUser.findOne({ userID: interaction.user.id }).catch(e => { })
    const voiceChannel = interaction.member?.voice.channel;

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      selfDeaf: false,
    });

    let queue = player?.nodes?.create(interaction.guild, {
      metadata: {
        channel: interaction.channel,
        requestby: interaction.user,
        embedCOLOR: userddd?.color || client.color,
      },
      requestedBy: interaction.user,
      volume: userddd?.vol || 50,
      maxSize: 200,
      maxHistorySize: 20,
      leaveOnEmpty: true,
      leaveOnEmptyCooldown: 2000,
      leaveOnEnd: false,
      skipOnNoStream: true,
      selfDeaf: false,
    });
    queue.createDispatcher(connection);

  },
};
