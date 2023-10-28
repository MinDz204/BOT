
const { ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("./../../mongoDB");
const config = require("../../config");
module.exports = async (interaction, lang) => {
if(!config.EnableJOINTOCREATE) return;
  try {
    switch (interaction.customId) {
        case "ZiVClock":
            interaction.deferUpdate()
            interaction.member.voice.channel.permissionOverwrites.set([
                {
                    id: interaction.guild.id,
                    deny: ["ViewChannel"],
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel"],
                },
            ]);
            return interaction.message.edit({ components: [creaacs(true)] })
        case "ZiVCunlock":
            interaction.deferUpdate()
            interaction.member.voice.channel.permissionOverwrites.set([
                {
                    id: interaction.guild.id,
                    allow: ["ViewChannel"],
                },
                {
                    id: interaction.user.id,
                    allow: ["ViewChannel"],
                },
            ]);
            return interaction.message.edit({ components: [creaacs(false)] })
        case "ZiVCrename":
          return interaction.showModal(
            new ModalBuilder()
            .setCustomId("ZiVCMODALrename")
            .setTitle(`RENAME VOICE CHANNEL:`)
            .addComponents(
                new ActionRowBuilder().addComponents(
                new TextInputBuilder()
                    .setMaxLength(100)
                    .setCustomId("resu")
                    .setLabel(`Nhập tên bạn muốn đổi:`)
                    .setStyle(TextInputStyle.Short)
                )
          ));
        case"ZiVClimit":{
        const vol = interaction?.values[0];
        interaction.member.voice.channel.edit({
            userLimit: vol
        })
        interaction.deferUpdate().catch(e => { });
        return;
        }
    }

  } catch (e) {
    console.log(e)
  }
  return;
}

function creaacs(log){
    let zilog = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setStyle(ButtonStyle.Danger)
        .setCustomId("ZiVCunlock")
        .setEmoji("<:UNlock:1167543715632521368>")
        .setLabel("UNlock"),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVCrename")
        .setEmoji("<:rename:1167545075958562886>")
        .setLabel("rename"),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVClimit")
        .setEmoji("<:limit:1167545918518722661>")
        .setLabel("limit"),
    )
    let ziunlog = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVClock")
        .setEmoji("<:LOck:1167543711283019776>")
        .setLabel("lock"),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVCrename")
        .setEmoji("<:rename:1167545075958562886>")
        .setLabel("rename"),
        new ButtonBuilder()
        .setStyle(ButtonStyle.Secondary)
        .setCustomId("ZiVClimit")
        .setEmoji("<:limit:1167545918518722661>")
        .setLabel("limit"),
    )
    return log ? zilog : ziunlog;
}