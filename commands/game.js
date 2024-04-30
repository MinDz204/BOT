const client = require("../bot");
const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder, EmbedBuilder } = require("discord.js");
const db = require("../mongoDB");

const symbols = { 0: "⬜", 1: "❌", 2: "⭕" };

function createBoard() {
  return Array(3).fill(null).map(() => Array(3).fill(0));
}

function createActionRow(row, board) {
  const actionRow = new ActionRowBuilder();
  for (let col = 0; col < 3; col++) {
    actionRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`Zttt${row},${col}`)
        .setLabel(symbols[board[row][col]])
        .setStyle(ButtonStyle.Secondary)
    );
  }
  return actionRow;
}

module.exports = {
  name: "game",
  description: "Game function.",
  options: [
    {
        name: "name",
        description: "Name Game.",
        type: 3,
        required: true,
        choices: [
          { name: 'Tic Tac Toe', value: 'Zttt' },
          { name: 'Rock Paper Scissors', value: 'Zrps' },
        ],
      }
  ],
  cooldown: 3,
  dm_permission: true,
  run: async (lang, interaction, zi ) => {
    const messages = await ZifetchInteraction(interaction);
    const gamename = interaction?.options?.getString("name");
    if( gamename == "Zttt" || zi == "ZTTT" ){
        const board = createBoard();
        await db?.ZiguildPlay.updateOne(
          { GuildID: interaction.guild.id, MessengerID: interaction.message.id, Game: "ZTTT" },
          {
              $set: {
                  data: [ ]
              }
          },
          { upsert: true }
      );
        const actionRows = [];
        for (let row = 0; row < 3; row++) {
        actionRows.push(createActionRow(row, board));
        }

        const embed = {
        title: "Tic Tac Toe",
        description: JSON.stringify(board),
        };
    if (!zi) {
        messages.edit({ embeds: [embed], components: actionRows }).catch(() => {
            interaction?.channel?.send({ embeds: [embed], components: actionRows });
        });
    } else {
        interaction.message.edit({ embeds: [embed], components: actionRows }).catch(console.error);
        interaction.deleteReply();
    }
    }else if(gamename == "Zrps" || zi == "ZRPS" ){
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
       .setCustomId("Zrpsrock")
       .setLabel("Rock")
       .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
       .setCustomId("Zrpspaper")
       .setLabel("Paper")
       .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
       .setCustomId("Zrpsscissors")
       .setLabel("Scissors")
       .setStyle(ButtonStyle.Primary)
    )
     const embes = new EmbedBuilder()
     .setDescription("Rock Paper Scissors")
     .setColor(lang?.COLOR || client.color)
    if (!zi) {
      messages.edit({ embeds: [embes], components: [row] }).catch(() => {
          interaction?.channel?.send({ embeds: [embes], components: [row] });
      });
    } else {
        interaction?.message.edit({ embeds: [embes], components: [row] }).catch(console.error);
        interaction.deleteReply();
    }
    }
}};
