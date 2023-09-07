const { useQueue, QueueRepeatMode } = require("discord-player");
const { zistart } = require("./ziStartTrack");
const { ModalBuilder, TextInputStyle } = require("discord.js");
const { ActionRowBuilder, TextInputBuilder } = require("@discordjs/builders");
module.exports = async ( interaction) => {
try{
    const queue = useQueue(interaction?.guildId);
    switch (interaction.customId){
        case "ZiplayerStop":
        return    queue.delete()
        case "ZiplayerSeach":
            const modal = new ModalBuilder()
            .setCustomId("ZiCompSearch")
            .setTitle("Tìm kiếm nhạc")
            .addComponents(
                new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setMaxLength(100)
                        .setCustomId("resu")
                        .setLabel("nhập tên hoặc liên kết đến bài hát:")
                        .setStyle(TextInputStyle.Short)
                )
            )
        return  interaction.showModal(modal);
    }
    let ZiisPlaying = !!queue.node.isPlaying() || !queue?.isEmpty();
    if( ZiisPlaying )
    switch ( interaction.customId ){
    case "Ziplayerf5":
        await interaction?.deferUpdate().catch(e => { });
    return interaction?.message.edit(await zistart(queue)).catch(e => { });
    case "ZiplayerNext":
        if(queue.repeatMode == 1) queue.setRepeatMode(QueueRepeatMode.QUEUE)
        queue.node.skip()
    return interaction?.deferUpdate().catch(e => { });


}
return interaction?.reply({content:"ko co bai dang pghat"})
} catch (e) {
    console.log(e)}
}
