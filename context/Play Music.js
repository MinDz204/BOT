const { Message } = require("discord.js");

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
let name = interaction.targetMessage?.content;
if (!name) {
  const embedData = interaction.targetMessage?.embeds[0]?.data;
  if(embedData){
    const firstFieldName = embedData?.fields?.[0]?.name;
    const hasSpecialField = firstFieldName?.includes("▒") || firstFieldName?.includes("█");
    name = hasSpecialField ? embedData.author?.url :  embedData.description;
  }else{
      const attachments = interaction.targetMessage.attachments;
      if(attachments)
        for (let attachment of attachments.values()) {
          name = attachment.url;
          break;
        }
  }
}
return require("../events/ziplayer/ziSearch")(interaction, name);
}