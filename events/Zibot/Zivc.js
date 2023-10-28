
const { ModalBuilder, TextInputStyle, ActionRowBuilder, TextInputBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require("discord.js");
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
            return interaction.message.edit({ components: creaacs(true) })
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
            return interaction.message.edit({ components: creaacs(false) })
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
        interaction.update().catch(e => { });
        return;
        }
    }

  } catch (e) {
    console.log(e)
  }
  return;
}

function creaacs(log){
    let zilog = [ new ActionRowBuilder().addComponents(
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
        .setCustomId("ZiVClimitCOMMON")
        .setDisabled(true)
        .setEmoji("<:limit:1167545918518722661>")
        .setLabel("common"),
      ),
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ZiVClimit")
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder("Số lượng")
          .setOptions([
            { label: "Full", value: "0" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "10", value: "10" },
            { label: "15", value: "15" },
            { label: "20", value: "20" },
            { label: "25", value: "25" },
            { label: "30", value: "30" },
            { label: "35", value: "35" },
            { label: "40", value: "40" },
            { label: "45", value: "45" },
            { label: "50", value: "50" },
            { label: "60", value: "60" },
            { label: "70", value: "70" },
            { label: "80", value: "80" },
            { label: "90", value: "90" },
            { label: "95", value: "95" },
          ])
      )]
    let ziunlog = [ new ActionRowBuilder().addComponents(
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
        .setCustomId("ZiVClimitCOMMON")
        .setDisabled(true)
        .setEmoji("<:limit:1167545918518722661>")
        .setLabel("common"),
      ),
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("ZiVClimit")
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder("Số lượng")
          .setOptions([
            { label: "Full", value: "0" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
            { label: "3", value: "3" },
            { label: "4", value: "4" },
            { label: "5", value: "5" },
            { label: "10", value: "10" },
            { label: "15", value: "15" },
            { label: "20", value: "20" },
            { label: "25", value: "25" },
            { label: "30", value: "30" },
            { label: "35", value: "35" },
            { label: "40", value: "40" },
            { label: "45", value: "45" },
            { label: "50", value: "50" },
            { label: "60", value: "60" },
            { label: "70", value: "70" },
            { label: "80", value: "80" },
            { label: "90", value: "90" },
            { label: "95", value: "95" },
          ])
      )]
    return log ? zilog : ziunlog;
}