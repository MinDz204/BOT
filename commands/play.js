const { useMainPlayer } = require('discord-player');
const { EmbedBuilder } = require('discord.js');
const db = require("./../mongoDB");
const player = useMainPlayer();
module.exports = {
  name: "play",
  description: "Play or Add music and play next.",
  options: [{
    name: "name",
    description: "Name Song",
    type: 3,
    required: true,
    autocomplete: true,
  }],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  run: async ( lang, interaction ) => {
    await interaction?.deferReply().catch(e=>{ });
    const nameS = interaction.options.getString("name");
    let userddd = await db.ZiUser.findOne({ userID: interaction.user.id }).catch( e=>{ } )
    let res;
        
    let queue = player?.nodes?.create(interaction.guild,{
        metadata:{
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
        leaveOnEnd:false,
        skipOnNoStream: true,
        selfDeaf: true,
    });

    try {
        res =  await player.search(nameS,{
            requestedBy:interaction.user,
          });
        if( !queue.connection ) await queue.connect(
                interaction?.member.voice.channelId,
                { deaf: true })
    }catch(e){
       return interaction?.editReply(`${lang?.PlayerSearchErr}`).then(async Message => {
            setTimeout(function(){
              Message.delete();
            },10000)}).catch(e => { console.log(e) });
    }
    const entry = queue.tasksQueue.acquire();
    await entry.getTask()
    res.playlist? queue.addTrack(res?.tracks): queue.insertTrack( res?.tracks[0] , 0);
    try{ 
        if (!queue.isPlaying()) await queue.node.play()
    } finally {
        queue.tasksQueue.release();
    }
    return interaction?.deleteReply().catch(e=>{ });
  },
};
