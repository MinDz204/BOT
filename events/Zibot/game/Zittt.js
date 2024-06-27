
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const db = require("../../../mongoDB");
const client = require("../../../bot");

// Biểu tượng Tic Tac Toe
const symbols = { 0: '⬜', 1: '❌', 2: '⭕' };

// Kiểm tra chiến thắng
function checkWin(board, player) {
  // Kiểm tra hàng ngang, hàng dọc và đường chéo
  for (let i = 0; i < 3; i++) {
    if (board[i].every((cell) => cell === player)) return true;
    if (board.map((row) => row[i]).every((cell) => cell === player)) return true;
  }
  if (board[0][0] === player && board[1][1] === player && board[2][2] === player) return true;
  if (board[0][2] === player && board[1][1] === player && board[2][0] === player) return true;
  return false;
}

// Kiểm tra hòa
function checkDraw(board) {
  return board.every((row) => row.every((cell) => cell !== 0));
}

// Đánh giá trạng thái của bảng để kiểm tra thắng hoặc hòa
const evaluate = (board) => {
  // Kiểm tra xem có người chơi nào thắng không
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === 1)) return 10; // Người chơi thắng
    if (board[i].every(cell => cell === 2)) return -10; // Máy tính thắng
  }
  for (let i = 0; i < 3; i++) {
    if (board.map(row => row[i]).every(cell => cell === 1)) return 10;
    if (board.map(row => row[i]).every(cell => cell === 2)) return -10;
  }
  if ((board[0][0] === 1 && board[1][1] === 1 && board[2][2] === 1) ||
    (board[0][2] === 1 && board[1][1] === 1 && board[2][0] === 1)) {
    return 10;
  }
  if ((board[0][0] === 2 && board[1][1] === 2 && board[2][2] === 2) ||
    (board[0][2] === 2 && board[1][1] === 2 && board[2][0] === 2)) {
    return -10;
  }
  return 0; // Không có người thắng
};

// Kiểm tra xem bảng có còn ô trống không
const isMovesLeft = (board) => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === 0) {
        return true;
      }
    }
  }
  return false;
};

// Thuật toán Minimax
const minimax = (board, depth, isMaximizing) => {
  const score = evaluate(board);

  // Nếu máy tính thắng
  if (score === -10) return score + depth;

  // Nếu người chơi thắng
  if (score === 10) return score - depth;

  // Nếu hòa
  if (!isMovesLeft(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === 0) {
          board[i][j] = 1;
          best = Math.max(best, minimax(board, depth + 1, false));
          board[i][j] = 0;
        }
      }
    }

    return best;
  } else {
    let best = Infinity;

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === 0) {
          board[i][j] = 2;
          best = Math.min(best, minimax(board, depth + 1, true));
          board[i][j] = 0;
        }
      }
    }

    return best;
  }
};

// Chọn nước đi tốt nhất cho máy tính
const getBestMove = (board) => {
  let bestVal = Infinity;
  let bestMove = null;

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === 0) {
        board[i][j] = 2; // Máy tính di chuyển
        const moveVal = minimax(board, 0, true); // Kiểm tra xem nước đi này tốt không
        board[i][j] = 0; // Đặt lại trạng thái bảng

        if (moveVal < bestVal) {
          bestVal = moveVal;
          bestMove = [i, j];
        }
      }
    }
  }

  return bestMove;
};


function createActionRow(row, board, Disables = false) {
  const actionRow = new ActionRowBuilder();
  for (let col = 0; col < 3; col++) {
    actionRow.addComponents(
      new ButtonBuilder()
        .setCustomId(`Zttt${row},${col}`)
        .setLabel(symbols[board[row][col]])
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(Disables)
    );
  }
  return actionRow;
}
module.exports = async (interaction, lang) => {
  const position = interaction?.customId.replace(`Zttt`, "")
  const [x, y] = position.split(',').map(Number);
  const board = JSON.parse(interaction.message.embeds[0].description);

  if (board[x][y] !== 0) {
    await interaction.reply({ content: "Cell đã được đánh dấu!", ephemeral: true });
    return;
  }

  const actionRowreroll = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`TicTacToeReroll`)
      .setLabel('↻')
      .setStyle(ButtonStyle.Secondary)
  )
  const actionRows = [];
  board[x][y] = 1; // Người chơi

  if (checkWin(board, 1)) {
    for (let row = 0; row < 3; row++) {
      actionRows.push(createActionRow(row, board, true));
    }
    actionRows.push(actionRowreroll);
    await interaction.update({
      content: "Bạn đã thắng!",
      embeds: [],
      components: actionRows,
    });
    return;
  }

  if (checkDraw(board)) {
    for (let row = 0; row < 3; row++) {
      actionRows.push(createActionRow(row, board, true));
    }
    actionRows.push(actionRowreroll);
    await interaction.update({
      content: "Trò chơi hòa!",
      embeds: [],
      components: actionRows,
    });
    return;
  }

  const [mx, my] = getBestMove(board); // Máy tính
  board[mx][my] = 2;

  if (checkWin(board, 2)) {
    for (let row = 0; row < 3; row++) {
      actionRows.push(createActionRow(row, board, true));
    }
    actionRows.push(actionRowreroll);
    await interaction.update({
      content: "Zi Bot đã thắng!",
      embeds: [],
      components: actionRows,
    });

    return;
  }

  for (let row = 0; row < 3; row++) {
    actionRows.push(createActionRow(row, board));
  }

  const embed = new EmbedBuilder()
    .setTitle("Tic Tac Toe")
    .setDescription(JSON.stringify(board))
    .setColor(lang?.COLOR || client.color)
    ;


  await interaction.update({
    embeds: [embed],
    components: actionRows,
  });
}