
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const db = require("../../mongoDB");
const client = require("../../bot");

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
  // Kiểm tra các hàng, cột, và đường chéo để tìm người thắng
  for (let i = 0; i < 3; i++) {
    if (board[i].every(cell => cell === 1) || board.map(row => row[i]).every(cell => cell === 1)) {
      return 10; // Người chơi thắng
    }
    if (board[i].every(cell => cell === 2) || board.map(row => row[i]).every(cell => cell === 2)) {
      return -10; // Máy tính thắng
    }
  }

  // Kiểm tra đường chéo
  if (
    (board[0][0] === 1 && board[1][1] === 1 && board[2][2] === 1) ||
    (board[0][2] === 1 && board[1][1] === 1 && board[2][0] === 1)
  ) {
    return 10;
  }

  if (
    (board[0][0] === 2 && board[1][1] === 2 && board[2][2] === 2) ||
    (board[0][2] === 2 && board[1][1] === 2 && board[2][0] === 2)
  ) {
    return -10;
  }

  return 0; // Không có người thắng
};

// Kiểm tra xem bảng có còn ô trống không
const isMovesLeft = (board) => {
  return board.flat().includes(0);
};

// Thuật toán Minimax với Alpha-Beta Pruning
const minimax = (board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) => {
  const score = evaluate(board);

  // Nếu đã có kết quả thắng hoặc hòa
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (!isMovesLeft(board)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[i][j] === 0) {
          board[i][j] = 1;
          best = Math.max(best, minimax(board, depth + 1, false, alpha, beta));
          board[i][j] = 0;
          alpha = Math.max(alpha, best);
          if (beta <= alpha) return best; // Alpha-Beta Pruning
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
          best = Math.min(best, minimax(board, depth + 1, true, alpha, beta));
          board[i][j] = 0;
          beta = Math.min(beta, best);
          if (beta <= alpha) return best; // Alpha-Beta Pruning
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


function createActionRow(row, board, Disables = false ) {
    const actionRow = new ActionRowBuilder();
    for (let col = 0; col < 3; col++) {
      actionRow.addComponents(
        new ButtonBuilder()
          .setCustomId(`ZtttR${row},${col}`)
          .setLabel(symbols[board[row][col]])
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(Disables)
      );
    }
    return actionRow;
  }

  // Hàm hỗ trợ
  function createActionRows(board, actionRowReroll) {
    const actionRows = [];
    for (let row = 0; row < 3; row++) {
      actionRows.push(createActionRow(row, board,!!actionRowReroll));
    }
    if(actionRowReroll)
    actionRows.push(actionRowReroll);
    return actionRows;
  }
  
  async function updateInteraction(interaction, content, actionRows, embeds = []) {
    await interaction.update({
      content,
      components: actionRows,
      embeds
    });
  }
  
  async function updateGameData(interaction, data) {
    await db?.ZiguildPlay.updateOne(
      {
        GuildID: interaction.guild.id,
        MessengerID: interaction.message.id,
        Game: 'ZTTT'
      },
      {
        $set: {
          data
        }
      },
      {
        upsert: true
      }
    );
  }


//==================================================================================//
module.exports = async (interaction, lang) => {
  const position = interaction?.customId.replace('ZtttR', '');
  const [x, y] = position.split(',').map(Number);
  const board = JSON.parse(interaction?.message?.embeds[0]?.description);
  const ZiPlay = await db?.ZiguildPlay.findOne({
    GuildID: interaction.guild.id,
    MessengerID: interaction.message.id,
    Game: 'ZTTT'
  });
  
  const actionRowReroll = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('TicTacToeRReroll')
      .setLabel('↻')
      .setStyle(ButtonStyle.Secondary)
  );
  
  // Kiểm tra nếu ô đã được đánh dấu
  if (board[x][y] !== 0) {
    await interaction.reply({
      content: 'Cell đã được đánh dấu!',
      ephemeral: true
    });
    return;
  }
  
  // Người chơi thực hiện nước đi
  board[x][y] = 1;
  
  // Kiểm tra kết quả
  if (checkWin(board, 1)) {
    await updateInteraction(interaction, 'Bạn đã thắng!',  createActionRows(board, actionRowReroll), []);
    await updateGameData(interaction, []);
    return;
  }
  
  if (checkDraw(board)) {
    await updateInteraction(interaction, 'Trò chơi hòa!',  createActionRows(board, actionRowReroll), []);
    return;
  }
  
  // Máy tính thực hiện nước đi
  const [mx, my] = getBestMove(board);
  board[mx][my] = 2;
  
  if (checkWin(board, 2)) {
    await updateInteraction(interaction, 'Zi Bot đã thắng!', createActionRows(board, actionRowReroll), []);
    await updateGameData(interaction, []);
    return;
  }
  // Nếu đã có dữ liệu, xóa nước đi cũ
  if (ZiPlay?.data?.length >= 3) {
    const LastMove = ZiPlay.data[0];
    board[LastMove.userMove.x][LastMove.userMove.y] = 0; // Người chơi
    board[LastMove.botMove.x][LastMove.botMove.y] = 0; // Máy tính
  }
  // Lưu dữ liệu mới nhất
  const check = [{ userMove: { x, y }, botMove: { x: mx, y: my } }];
  let dataIndex = [...(ZiPlay?.data || []), ...check];
  if (dataIndex.length > 3) {
    dataIndex = dataIndex.slice(-3); // Lấy 4 phần tử cuối cùng
  }
  await updateGameData(interaction, dataIndex);
  
  await updateInteraction(
    interaction,
    'Tic Tac Toe',
    createActionRows(board),
    [
      new EmbedBuilder()
        .setTitle('Tic Tac Toe')
        .setDescription(JSON.stringify(board))
        .setColor(lang?.COLOR || client.color)
    ]
  );
}