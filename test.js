function createBoard() {
  return Array.from({ length: 8 }, () => Array(8).fill('⚪'));
}
const board = createBoard()
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

console.log(renderBoard(board))
console.log(parseRenderedBoard(renderBoard(board)))


console.log(board)
