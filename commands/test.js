module.exports = {
    name: "test",
    description: "test command.",
    options: [ ],
    cooldown: 3,
    dm_permission: true,
  };
const { Font } = require("canvacord");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { MusicCard } = require("./../events/Zibot/musicCard");
const { WelcomeCard } = require("./../events/Zibot/WelcomeCard");
const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const client = require("../bot");

  
  module.exports.run = async ( lang, interaction ) => {
    // const card = new MusicCard()
    // .setAuthor(`${interaction?.guild?.name}`)
    // .setTitle(`${interaction.user.tag}`)
    // .setImage(
    //   interaction.user.displayAvatarURL({ dynamic: false, format: 'png' })
    // )
    // .setProgress(80)
    // .setCurrentTime("02:32")
    // .setTotalTime("02:59");
  
 
    let messages = await ZifetchInteraction(interaction);   
    Font.loadDefault();
    const card = new WelcomeCard()
        .setAvatar(interaction.user.displayAvatarURL({ dynamic: false, format: 'png' }))
        .setDisplayName(interaction.user.tag)
        .setType("welcome")
        .setMessage("to Ziji server!");

        const image = await card.build({ format: "png" });
        const attachment = new AttachmentBuilder(image, { name: "WelcomeCard.png" });
        
        const embedsss = new EmbedBuilder()
            .setDescription(
            `Chào mừng ${interaction?.user}, nhớ ghé qua <id:customize> để lấy role nha~`
            )
            .setColor(client?.color)
            .setImage(`attachment://WelcomeCard.png`)
    return messages?.edit({ embeds:[embedsss], files: [attachment] }).catch(e => interaction?.channel?.send({ files: [attachment] }));


}
