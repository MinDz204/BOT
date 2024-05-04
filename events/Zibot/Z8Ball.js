const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const client = require('../../bot');


const ROWS = 8;
const COLS = 8;

function createBoard() {
    return Array.from({ length: ROWS }, () => Array(COLS).fill('⚪'));
}

function renderBoard(board) {
    return board.map(row => row.join(' ')).join('\n');
}

function parseRenderedBoard(renderedBoard) {
    // Tách chuỗi thành các dòng
    const lines = renderedBoard.split('\n');
  
    // Chuyển mỗi dòng thành một mảng các ký tự (sử dụng khoảng trắng để tách)
    const board = lines.map(line => line.trim().split(' '));
  
    return board;
  }
function checkWin(board, symbol) {
    const checkDirection = (r, c, dr, dc) => {
        let count = 0;
        for (let i = 0; i < 4; i++) {
            if (
                r >= 0 &&
                r < ROWS &&
                c >= 0 &&
                c < COLS &&
                board[r][c] === symbol
            ) {
                count++;
            } else {
                break;
            }
            r += dr;
            c += dc;
        }
        return count === 4;
    };

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            if (
                checkDirection(r, c, 1, 0) || // Vertical
                checkDirection(r, c, 0, 1) || // Horizontal
                checkDirection(r, c, 1, 1) || // Diagonal down-right
                checkDirection(r, c, 1, -1) // Diagonal down-left
            ) {
                return true;
            }
        }
    }

    return false;
}

function isBoardFull(board) {
    return board.every(row => row.every(cell => cell !== '⚪'));
}

function dropPiece(board, col, symbol) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (board[r][col] === '⚪') {
            board[r][col] = symbol;
            return r;
        }
    }
    return -1; // Column is full
}

function createButtonRows() {
    function createActionRow(i) {
      const actionRow = new ActionRowBuilder();
      for (let col = 0; col < 4; col++) {
        actionRow.addComponents(
          new ButtonBuilder()
              .setCustomId(`Z8ball_col_${i+col}`)
              .setLabel((i + col + 1).toString())
              .setStyle(ButtonStyle.Secondary)
        );
      }
      return actionRow;
    }
    return [createActionRow(0), createActionRow(4)];
}

// Function to get a list of valid columns
function getValidColumns(board) {
    const validColumns = [];
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === '⚪') {
            validColumns.push(c);
        }
    }
    return validColumns;
}

function getValidColumns(board) {
    const validColumns = [];
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === '⚪') {
            validColumns.push(c);
        }
    }
    return validColumns;
}

function isWinningMove(board, col, symbol) {
    const tempBoard = board.map(row => row.slice());
    dropPiece(tempBoard, col, symbol);
    return checkWin(tempBoard, symbol);
}

function getBlockingMove(board, opponentSymbol) {
    const validColumns = getValidColumns(board);

    for (const col of validColumns) {
        if (isWinningMove(board, col, opponentSymbol)) {
            return col; // Block opponent's winning move
        }
    }

    return -1; // No blocking move
}

function getRandomValidColumn(board) {
    const validColumns = getValidColumns(board);
    return validColumns[Math.floor(Math.random() * validColumns.length)];
}

function getStrategicMove(board, currentSymbol, opponentSymbol) {
    // Check if there's a winning move for the bot
    const validColumns = getValidColumns(board);
    for (const col of validColumns) {
        if (isWinningMove(board, col, currentSymbol)) {
            return col; // Make the winning move
        }
    }

    // Check if there's a blocking move against the opponent
    const blockingMove = getBlockingMove(board, opponentSymbol);
    if (blockingMove !== -1) {
        return blockingMove;
    }

    // If no winning or blocking move, choose randomly
    return getRandomValidColumn(board);
}
function embes (title,lang, board){
    return new EmbedBuilder()
    .setTitle(`${title}`)
    .setDescription(`${renderBoard(board)}\n1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣`)
    .setColor(lang?.COLOR || client.color)
}
//
module.exports = async (interaction, lang) => {
    const board = parseRenderedBoard (interaction?.message?.embeds[0]?.description.replace("\n1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣ 6️⃣ 7️⃣ 8️⃣","").trim()) || createBoard();
    const col = parseInt(interaction.customId.split('_')[2], 10);
    const row = dropPiece(board, col, '🔴');
    if (row === -1) {
        await interaction?.reply({ content: 'This column is full!', ephemeral: true }).catch(console.log);
        return;
    }
    await interaction.deferUpdate().catch(e => { });
    const resetroe = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId('8ballReroll')
            .setLabel('↻')
            .setStyle(ButtonStyle.Secondary)
    )
    if (checkWin(board, '🔴')) {

        await interaction.message.edit({
            embeds: [embes(`${interaction?.user?.tag} 🔴 wins!`,lang,board)],
            components: [resetroe],
        });
        return;
    }

    if (isBoardFull(board)) {

         await interaction.message.edit({
            embeds: [embes("It's a tie!",lang,board)],
            components: [resetroe],
        });
        return;
    }

    // If it's the bot's turn, make a move

        const aiCol = getStrategicMove(board,'🔵', '🔴');
        dropPiece(board, aiCol,  '🔵');

        if (checkWin(board,  '🔵')) {

             await interaction.message.edit({
                embeds: [embes("Ziji Bot 🔵 wins!",lang,board)],
                components: [resetroe],
        });
        return;

    }

     await interaction.message.edit({
        embeds: [embes("Current Player: 🔴",lang,board)],
        components: createButtonRows(),
    });

};
