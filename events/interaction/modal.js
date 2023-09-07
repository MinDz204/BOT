const { useQueue } = require("discord-player");
const db = require("./../../mongoDB");
const { zistart } = require("./../ziplayer/ziStartTrack")

module.exports = async (client, interaction) => {
    try{
        switch ( interaction.customId ){
        case "ZiCompSearch":{
            const nameS = interaction.fields.getTextInputValue("resu");
        return require("./../ziplayer/ziSearch")( interaction, nameS )                  }
        case "ZiModalVol":{
            await interaction.deferReply().catch(e => { });
            const queue = useQueue(interaction?.guildId);
            const vol = interaction.fields.getTextInputValue("resu");
            // if(!Number.isInteger(vol))  return interaction.editReply(`nhập sai âm lượng`)
            queue.node.setVolume(Math.abs(vol))
            await db.ZiUser.updateOne({ userID: interaction.user.id },{
                $set:{
                    vol: Math.abs(vol),
                }
            },{ upsert: true })
            interaction.deleteReply().catch(e => { });
        return queue?.metadata?.Zimess.edit( await zistart(queue) ).catch(e => { });    }

        default:
            console.log(interaction.customId)
    }
    } catch (e) {
        console.log(e)}
    }
    