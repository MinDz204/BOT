const { useMetadata } = require("discord-player");
const { EmbedBuilder, Message } = require("discord.js");
const { zistart } = require("./../ziplayer/ziStartTrack")
async function Ziset(queue){
    return queue?.metadata.channel.send( await zistart(queue) ).then(async Message =>{
        const [ getMetadata, setMetadata ] = useMetadata(queue?.guild.id);
        const { channel, requestby, embedCOLOR } = getMetadata();
        setMetadata({ channel, requestby, embedCOLOR, Zimess: Message })
    })
}
module.exports = async ( client , queue ) =>{
    if (queue){
        if (!queue?.metadata?.Zimess) return Ziset(queue)
    }
    return queue?.metadata?.Zimess.edit( await zistart(queue) ).catch(e => {
        return Ziset(queue);
    })
}