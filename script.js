// GameBoard Module (IIFE)
const GameBoard = (function() {
    let board = ['', '', '', '', '', '', '', '', ''];
  
    const getBoard = () => board;
  
    const resetBoard = () => {
      board = ['', '', '', '', '', '', '', '', ''];
    };
  
    const updateCell = (index, symbol) => {
      if (board[index] === '') {
        board[index] = symbol;
        return true;
      }
      return false;
    };
  
    return {
      getBoard,
      resetBoard,
      updateCell
    };
  })();
  
  // Player Factory Function
  const Player = (name, symbol) => {
    return { name, symbol };
  };
  
  // GameController Module (IIFE)
  const GameController = (function() {
    let players = [];
    let currentPlayerIndex = 0;
    let gameActive = true;
  
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
  
    const initGame = (player1Name, player2Name) => {
      players = [Player(player1Name, 'X'), Player(player2Name, 'O')];
      gameActive = true;
      currentPlayerIndex = 0;
      GameBoard.resetBoard();
      document.getElementById('game-board').style.display = 'grid';
      document.getElementById('reset').style.display = 'block';
      updateMessage(`${players[currentPlayerIndex].name}'s turn`);
      renderBoard();
    };
  
    const handleCellClick = (e) => {
      if (!gameActive) return;
      const cell = e.target;
      const index = cell.getAttribute('data-index');
  
      if (GameBoard.updateCell(index, players[currentPlayerIndex].symbol)) {
        renderBoard();
        if (checkWinner()) {
          updateMessage(`${players[currentPlayerIndex].name} wins!`);
          gameActive = false;
        } else if (isTie()) {
          updateMessage(`It's a tie!`);
          gameActive = false;
        } else {
          switchPlayer();
        }
      }
    };
  
    const switchPlayer = () => {
      currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
      updateMessage(`${players[currentPlayerIndex].name}'s turn`);
    };
  
    const checkWinner = () => {
      const board = GameBoard.getBoard();
      for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return true;
        }
      }
      return false;
    };
  
    const isTie = () => {
      return GameBoard.getBoard().every(cell => cell !== '');
    };
  
    const resetGame = () => {
      GameBoard.resetBoard();
      gameActive = true;
      currentPlayerIndex = 0;
      updateMessage(`${players[currentPlayerIndex].name}'s turn`);
      renderBoard();
    };
  
    const renderBoard = () => {
      const board = GameBoard.getBoard();
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell, index) => {
        cell.textContent = board[index];
      });
    };
  
    const updateMessage = (msg) => {
      document.getElementById('message').textContent = msg;
    };
  
    return {
      initGame,
      handleCellClick,
      resetGame
    };
  })();
  
  // DOM Handling
  document.getElementById('player-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const player1Name = document.getElementById('player1').value;
    const player2Name = document.getElementById('player2').value;
    GameController.initGame(player1Name, player2Name);
  });
  
  document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', GameController.handleCellClick);
  });
  
  document.getElementById('reset').addEventListener('click', GameController.resetGame);
  