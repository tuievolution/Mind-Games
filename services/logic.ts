export function generateBoard(rows: number, cols: number, mines: number): (string | number)[][] {
  const board: (string | number)[][] = Array.from({ length: rows }, () => Array(cols).fill(0));

  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (board[r][c] === '💣') continue;
    board[r][c] = '💣';
    placed++;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === '💣') continue;

      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && board[nr][nc] === '💣') {
            count++;
          }
        }
      }
      board[r][c] = count;
    }
  }

  return board;
}

export function isValidBoard(board: (string | number)[][]): boolean {
  const rows = board.length;
  const cols = board[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cell = board[r][c];
      if (cell !== 1) continue;

      let bombCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            board[nr][nc] === '💣'
          ) {
            bombCount++;
          }
        }
      }

      if (bombCount !== 1) return false;
    }
  }

  return true;
}

export function generateValidBoard(rows: number, cols: number, mines: number): (string | number)[][] {
  let board: (string | number)[][];
  let attempts = 0;
  do {
    board = generateBoard(rows, cols, mines);
    attempts++;
    if (attempts > 20) break; // sonsuz döngüye girme önlemi
  } while (!isValidBoard(board));
  return board;
}
