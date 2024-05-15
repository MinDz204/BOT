module.exports = {
  name: "Play Music",
  name_localizations: {
    "en-US": "Play/add music.",
    "vi": "Phát/Thêm nhạc.",  // Play/Add music in Vietnamese
    "ja": "音楽を再生/追加します", // Play/Add music in Japanese
    "ko": "음악 재생/추가합니다", // Play/Add music in Korean
  },
  integration_types: [0],
  contexts: [0, 1, 2],
  voiceC: true,
  NODMPer: true,
  dm_permission: false,
  cooldown: 3,};

module.exports.run = async (lang, interaction) => {
    // console.log(interaction);
    let name = interaction.targetMessage?.content;
    if (!name){
        const targetMessage = interaction.targetMessage?.embeds[0]?.data ?? {};
        const targetMessageName = targetMessage.fields?.[0]?.name ?? "";
        if( !targetMessageName ){ return interaction?.reply(`${lang?.PlayerSearchErr}`).then( async messs => {
          setTimeout(function() {
            messs?.delete().catch(e => { });
          }, 10000)
      })};
        if (targetMessageName.includes("▒") || targetMessageName.includes("█")) {
            name = targetMessage.author?.url;
        }
        else return  interaction?.reply(`${lang?.PlayerSearchErr}`).then( async messs => {
            setTimeout(function() {
              messs?.delete().catch(e => { });
            }, 10000)
        })
    }
    return require("../events/ziplayer/ziSearch")(interaction, name);
}