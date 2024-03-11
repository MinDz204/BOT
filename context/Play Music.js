module.exports = {
  name: "Play Music",
  voiceC: true,
  NODMPer: true,
  dm_permission: false,
  cooldown: 3,};

module.exports.run = async (lang, interaction) => {
    // console.log(interaction);
    let name = interaction.targetMessage?.content;
    if (!name){
        const targetMessage = interaction.targetMessage?.embeds[0]?.data;
        if (targetMessage?.fields[0]?.name.includes("▒") || targetMessage?.fields[0]?.name.includes("█")) {
            name = targetMessage.author?.url;
        }
        else return  interaction?.reply(`${lang?.PlayerSearchErr}`).then( async messs => {
            setTimeout(function() {
              messs?.delete().catch(e => { });
            }, 10000)
        })
    }
    console.log(name);
    return require("../events/ziplayer/ziSearch")(interaction, name);
}