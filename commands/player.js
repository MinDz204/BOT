const { ApplicationCommandOptionType } = require('discord.js');
const { zistart } = require('../events/ziplayer/ziStartTrack');
const { useMetadata, useQueue } = require("discord-player");

async function Ziset(queue, lang, interaction ){
    return interaction.channel.send( await zistart( queue, lang) ).then(async Message =>{
        const [ getMetadata, setMetadata ] = useMetadata(queue?.guild.id);
        const { channel, requestby, embedCOLOR } = getMetadata();
        setMetadata({ channel, requestby, embedCOLOR, Zimess: Message })
    }).catch(e => { })
}
module.exports = {
  name: "player",
  description: "Player media control",
  options: [],
  voiceC: true,
  NODMPer: true,
  cooldown: 3,
  run: async ( lang, interaction ) => {
    interaction?.reply({content:`<a:loading:1151184304676819085> Loading...`, ephemeral: true }).then(async Message => { setTimeout(function(){
        Message.delete();
    },10000)}).catch(e => { console.log(e) })
    //
    const queue = useQueue(interaction.guild.id);
    let ZiisPlaying = !!queue?.node?.isPlaying() || !queue?.isEmpty();
    if(! ZiisPlaying) return interaction.channel.send(lang?.NoPlaying).catch(e => { })
    await queue?.metadata?.Zimess.edit({ components:[ ] }).catch(e => { })
    return Ziset(queue, lang, interaction)
  },
};
