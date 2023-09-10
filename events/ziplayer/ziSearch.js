const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const { useMainPlayer, QueryType } = require("discord-player");
const { rank } = require("../Zibot/ZilvlSys");
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

  module.exports = async ( interaction, nameS ) => {
    await interaction?.deferReply();
    if(!nameS) return;
    if(validURL(nameS)){
    try{
      let userddd = await db.ZiUser.findOne({ userID: interaction.user.id }).catch( e=>{ } )
        await player.play(interaction?.member.voice.channelId, nameS, {
            nodeOptions: {
                metadata:{
                    channel: interaction.channel,
                    requestby: interaction.user,
                    embedCOLOR: userddd?.color || client.color,
                },
                requestedBy: interaction.user,
                selfDeaf: true,
                volume: userddd?.vol || 50,
                maxSize: 200,
                maxHistorySize: 20,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 2000,
                leaveOnEnd:false,
                skipOnNoStream: true,
            }
        });
        return interaction?.deleteReply();
    }catch(e){ 
      let lang = await rank({ user: interaction.user });
      return interaction?.editReply(`${lang?.PlayerSearchErr}`).then(async Message => {
        setTimeout(function(){
          Message.delete();
        },10000)}).catch(e => { console.log(e) }); }
    }
    let lang = await rank({ user: interaction.user });
        let res =  await player.search(nameS,{
            fallbackSearchEngine: QueryType.YOUTUBE,
            requestedBy:interaction.user,
          });
          const maxTracks = res.tracks.filter(t => t?.title.length < 100 && t?.url.length < 100).slice(0, 20);
          let track_button_creator = maxTracks.map((Track, index) => {
            return new ButtonBuilder()
              .setLabel(`${index + 1}`)
              .setStyle(ButtonStyle.Secondary)
              .setCustomId(`${maxTracks[Number(index)].url}`)
          })
          let buttons1, buttons2, buttons3, buttons4, code;
          let cancel = new ButtonBuilder()
            .setLabel("❌")
            .setStyle(ButtonStyle.Danger)
            .setCustomId('cancel');
          let cancelB = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setLabel("❌")
              .setStyle(ButtonStyle.Danger)
              .setCustomId('cancel'));
    
          const embed = new EmbedBuilder()
          .setColor(lang?.COLOR || client.color)
          .setTitle(`${lang?.PlayerSearch} ${nameS}`)
          .setDescription(`${maxTracks.map((track, i) => `**${i + 1}**. ${track?.title.substr(0, 35) + "..."} | \`${track.author.substr(0, 18) + "..."}\``).join('\n')}\n <:cirowo:1007607994097344533>`)
          .setTimestamp()
          .setFooter({ text: `${lang?.RequestBY} ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
        
          switch (track_button_creator.length) {
            case 1:
            case 2:
            case 3:
            case 4:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, Math.min(track_button_creator.length, 4)))
                .addComponents(cancel);
              code = { embeds: [embed], components: [buttons1] }
              break;
            case 5:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, 5));
              code = { embeds: [embed], components: [buttons1, cancelB] }
              break;
            case 6:
            case 7:
            case 8:
            case 9:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, 5));
              buttons2 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(5, Math.min(track_button_creator.length, 9)))
                .addComponents(cancel);
              code = { embeds: [embed], components: [buttons1, buttons2] }
              break;
            case 10:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, 5));
              buttons2 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(5, 10));
              code = { embeds: [embed], components: [buttons1, buttons2, cancelB] }
              break;
            case 11:
            case 12:
            case 13:
            case 14:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, 5));
              buttons2 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(5, 10));
              buttons3 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(10, Math.min(track_button_creator.length, 14)))
                .addComponents(cancel);
              code = { embeds: [embed], components: [buttons1, buttons2, buttons3] }
              break;
            case 15:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, 5));
              buttons2 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(5, 10));
              buttons3 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(10, 15));
              code = { embeds: [embed], components: [buttons1, buttons2, buttons3, cancelB] }
              break;
            case 20:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, 5));
              buttons2 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(5, 10));
              buttons3 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(10, 15));
              buttons4 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(15, 20));
              code = { embeds: [embed], components: [buttons1, buttons2, buttons3, buttons4, cancelB] }
              break;
            default:
              buttons1 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(0, 5));
              buttons2 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(5, 10));
              buttons3 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(10, 15));
              buttons4 = new ActionRowBuilder()
                .addComponents(track_button_creator.slice(15, Math.min(track_button_creator.length, 19)))
                .addComponents(cancel);
              code = { embeds: [embed], components: [buttons1, buttons2, buttons3, buttons4] }
              break;
          }
          return interaction.editReply(code)
  }