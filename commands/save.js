const { useQueue, serialize } = require("discord-player");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { ZifetchInteraction } = require('../events/Zibot/ZiFunc');
const db = require("./../mongoDB");
const client = require("../bot");

module.exports = {
  name: "save",
  description: "Saves the played music to you.",
  integration_types: [0],
  contexts: [0, 1, 2],
  options: [{
    name: "type",
    description: "Saves type.",
    type: 3,
    required: true,
    choices: [
        {
            name: "Now Playing", 
            value: "now", 
        },{
            name: "Queue", 
            value: "queue", 
        }
    ],
  },{
    name:"name",
    description: "Playlist name",
    type: 3,
    required: true,
  },{
    name: "private",
    description: "Set private",
    type: 5
  }],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  dm_permission: false,
  run: async (lang, interaction) => {
    try {
        const messages = await ZifetchInteraction(interaction);
        const Savetype = interaction?.options?.getString("type");
        const isPrivate = interaction?.options?.getBoolean("private") || false;
        const playlistName = interaction?.options?.getString("name") || "Untitled";

        const queue = useQueue(interaction.guild.id);
        let ZiisPlaying = !!queue?.node?.isPlaying() || !queue?.isEmpty();
        if (!queue || !ZiisPlaying ) {
        await messages.edit(`${lang?.NoPlaying}`);
        return;
        }
        const tracl = (tralc = []) =>{
            tralc.push( serialize(queue.currentTrack))
            if ( !!queue.tracks && Savetype == "queue" ){
                const serializedTracks = queue?.tracks?.map((track) => serialize(track));
                tralc.push(...serializedTracks);
            }
            return tralc;
        };
        const playlist = await db?.playlist?.findOne({ userID: interaction.user.id, listname: playlistName }).catch(e => { })

        if ( !!playlist ){
            await db.playlist.updateOne({ userID: interaction.user.id, listname: playlistName }, {
                $set: {
                    Song: tracl( playlist?.Song )
                }
            }, { upsert: true }).catch(e => { })
         }else{
            await db.playlist.updateOne({ userID: interaction.user.id, listname: playlistName  }, {
                $set: {
                    userN: interaction.user.tag,
                    plays: 0,
                    private: isPrivate,
                    createdTime: Date.now(),
                    Song: tracl()
                }
                }, { upsert: true }).catch(e => { })
         }
        messages.edit({
          context:``,
          embeds:[
          new EmbedBuilder()
            .setColor(lang?.COLOR || client.color)
            .setDescription(`${lang?.savedPlaylist}: ${playlistName}\n Sử dụng: Tag <@${client?.user?.id}> + ${interaction?.user} + (${playlistName})`)
          ],
          components:[
            new ActionRowBuilder().addComponents(
              new ButtonBuilder()
                .setCustomId("cancel")
                .setLabel("❌")
                .setStyle(ButtonStyle.Secondary)
            )
          ]
      });

    } catch (e) {
      console.error("Error in player command:", e);
    }
  },
};
