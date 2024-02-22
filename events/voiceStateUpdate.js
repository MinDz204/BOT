const { EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle,PermissionsBitField, StringSelectMenuBuilder  } = require("discord.js");
const db = require("../mongoDB");
const { useQueue } = require('discord-player');
const config = require("../config");
module.exports = async (client, oldState, newState) => {
  const queue = useQueue(oldState?.guild?.id);
  if (queue || queue?.node.isPlaying()) {
    if (newState.id === client.user.id) {
      let lang = await db?.ZiUser?.findOne({ userID: queue?.currentTrack?.requestby?.id || queue?.metadata?.requestby?.id })
      lang = lang?.lang || `vi`
      lang = require(`../lang/${lang}.js`);

      if (oldState.serverMute === false && newState.serverMute === true) {
        if (queue?.metadata) {
          const embed = new EmbedBuilder()
            .setColor(`#ff0000`)
            .setDescription(`${lang.SeverMute}`);
          queue?.node?.pause();
          await queue?.metadata?.channel?.send({ content: ``, embeds: [embed] }).catch(e => { })
        }
      }
      if (oldState.serverMute === true && newState.serverMute === false) {
        if (queue?.metadata) {
          const embed = new EmbedBuilder()
            .setColor(lang?.COLOR || client.color)
            .setDescription(`${lang.SeverUnMute}`)
          queue?.node?.resume();
          await queue?.metadata?.channel?.send({ content: ``, embeds: [embed] }).catch(e => { })
        }
      }
    }
  }
  //::::::::::::::::::::::::::::::::::::: join to create:::::::::::::::::::::::::::://
  if(!config.EnableJOINTOCREATE) return;
  const { member, guild } = oldState;
  const newChannel = newState.channel;
  const oldChannel = oldState.channel;

  const channelid = config.JOINTOCREATECHANNEL;
  const channel = client.channels.cache.get(channelid);

  if (oldChannel !== newChannel && newChannel && newChannel.id === channel.id) {
      const voiceChannel = await guild.channels.create({
          name: `${member.user.tag}'s Channel`,
          type: ChannelType.GuildVoice,
          parent: newChannel.parent,
          permissionOverwrites: [
              {
                  id: member.id,
                  allow: ["Connect", "ManageChannels"],
              },
              {
                  id: guild.id,
                  allow: ["Connect"],
              },
          ],
      }
      );
      const textChannel = await guild.channels.create({
        name: `${member.user.tag}-manager`,
        type: ChannelType.GuildText,
        parent: newChannel.parent,
        permissionOverwrites: [
            {
                id: member.id,
                allow: ["ViewChannel"],
            },
            {
                id: guild.id,
                deny: ["ViewChannel"],
            },
        ],
    }
    );
    let lang = await db?.ZiUser?.findOne({ userID: member.id })
    lang = lang?.lang || `vi`
    lang = require(`../lang/${lang}.js`);
    textChannel.send({embeds:[
      new EmbedBuilder()
      .setColor(lang.COLOR || client.color)
      .setTitle(`${member.user.tag} voice channel manager:`)
      .setThumbnail( member?.user?.displayAvatarURL({ dynamic: true }) )
      .setDescription(`Sử dụng các nút bên dưới để setup voice channel của bạn:`)
      .setTimestamp()
      .setFooter({ text: `${lang?.RequestBY} ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
      .setImage(lang?.banner)
    ], components:[
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVClock")
        .setEmoji("<:LOck:1167543711283019776>")
        .setLabel("lock"),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVCrename")
        .setEmoji("<:rename:1167545075958562886>")
        .setLabel("rename"),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVClimitCOMMON")
        .setDisabled(true)
        .setEmoji("<:limit:1167545918518722661>")
        .setLabel("common"),
      ),
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ZiVClimit")
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder("Số lượng")
          .setOptions([
            { label: "Full", value: "0" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "10", value: "10" },
            { label: "15", value: "15" },
            { label: "20", value: "20" },
            { label: "25", value: "25" },
            { label: "30", value: "30" },
            { label: "35", value: "35" },
            { label: "40", value: "40" },
            { label: "45", value: "45" },
            { label: "50", value: "50" },
            { label: "60", value: "60" },
            { label: "70", value: "70" },
            { label: "80", value: "80" },
            { label: "90", value: "90" },
            { label: "95", value: "95" },
          ])
      ),
    ]})
      await db.voiceManager.updateOne({ userID: member.id }, {
        $set: {
          voiceChannel: voiceChannel.id,
          textChannel: textChannel.id,
        }
      }, { upsert: true }).catch(e => { })

      await newChannel.permissionOverwrites.edit(member, {
          Connect: false
      });
      setTimeout(() => {
          newChannel.permissionOverwrites.delete(member);
      }, 30000);

      return setTimeout(() => {
          member.voice.setChannel(voiceChannel);
      }, 500);
  }

  const jointocreate = await db.voiceManager.findOne({ userID: member.id });
  let channelmoddel = client.channels?.cache?.get(jointocreate?.textChannel);
  const members = oldChannel?.members
      .filter((m) => !m.user.bot)
      .map((m) => m.id);
  if (
      jointocreate?.voiceChannel &&
      oldChannel.id === jointocreate?.voiceChannel &&
      (!newChannel || newChannel.id !== jointocreate?.voiceChannel)
  ) {
      if (members.length > 0) {
          let randomID = members[Math.floor(Math.random() * members.length)];
          let randomMember = guild.members.cache.get(randomID);
          randomMember.voice.setChannel(oldChannel).then((v) => {
              oldChannel.setName(randomMember.user.username).catch((e) => null);
              channelmoddel.permissionOverwrites.edit(randomMember, {
                ViewChannel: true
            });
              channelmoddel.permissionOverwrites.delete(member.id);
              oldChannel.permissionOverwrites.edit(randomMember, {
                  Connect: true,
                  ManageChannels: true
              });
          });
          await db.voiceManager.deleteOne({ userID: member.id })
          await db.voiceManager.updateOne({ userID: randomMember.id }, {
            $set: {
              voiceChannel: oldChannel?.id,
              textChannel: jointocreate?.textChannel,
            }
          }, { upsert: true }).catch(e => { })
      } else {
        await db.voiceManager.deleteOne({ userID: member.id })
        oldChannel.delete().catch((e) => null);
        channelmoddel.delete().catch((e) => null);
      }
  }
}