const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const { useMainPlayer } = require("discord-player");
const client = require("../..");
const player = useMainPlayer();

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

  module.exports = async ( client, interaction, nameS ) => {
    interaction.reply('ok')
    if(validURL(nameS)){
        await player.play(interaction?.member.voice.channelId, nameS, {
            nodeOptions: {
                metadata:{
                    channel: interaction.channel,
                    requestby: interaction.user,
                },
                maxSize: 200,
                maxHistorySize: 20,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 2000,
                leaveOnEnd:false,
                skipOnNoStream: true,
                
            }
        });
        return
    }
    await player.play(interaction?.member.voice.channelId, nameS, {
        nodeOptions: {
            metadata:{
                channel: interaction.channel,
                requestby: interaction.user,
            },
            maxSize: 200,
            maxHistorySize: 20,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 2000,
            leaveOnEnd:false,
            skipOnNoStream: true,
            
        }
    });
    return
  }