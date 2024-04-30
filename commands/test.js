const { ZifetchInteraction } = require("../events/Zibot/ZiFunc");
const { ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");

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
  name: "test",
  description: "test command.",
  options: [],
  cooldown: 3,
  dm_permission: true,

  run: async (lang, interaction) => {
    const messages = await ZifetchInteraction(interaction);
    const board = createBoard();

    const actionRows = [];
    for (let row = 0; row < 3; row++) {
      actionRows.push(createActionRow(row, board));
    }

    const embed = {
      title: "Tic Tac Toe",
      description: JSON.stringify(board),
    };

    try {
      await messages.edit({ embeds: [embed], components: actionRows });
    } catch (e) {
      if (interaction?.channel) {
        await interaction.channel.send({ embeds: [embed], components: actionRows });
      }
    }
  },
};
