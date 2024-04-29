const { EmbedBuilder, AttachmentBuilder } = require("discord.js");
const { Font } = require("canvacord");
const { WelcomeCard } = require("./Zibot/WelcomeCard");
const config = require("../config");
module.exports = async (client , member ) =>{
if (!config?.guildMemberAdd || member?.guild.id !== "1007597270704869387" ) return;
let channel = client.channels.cache.get("1012739464671543497")
Font.loadDefault();
const card = new WelcomeCard()
        .setAvatar(member.user.displayAvatarURL({ dynamic: false, format: 'png' }))
        .setDisplayName(member.user.tag)
        .setType("Goodbye")
        .setMessage("");

const image = await card.build({ format: "png" });
const attachment = new AttachmentBuilder(image, { name: "WelcomeCard.png" });
const embedsss = new EmbedBuilder()
    .setDescription(
    `Tạm biệt ${member?.user} <a:blondenekocry:1008064599393832960>`
    )
    .setColor(client?.color)
    .setImage(`attachment://WelcomeCard.png`)
return channel.send({ embeds:[embedsss], files: [attachment] })

}