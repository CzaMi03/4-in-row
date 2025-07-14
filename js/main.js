const ROWS = 6;
const COLS = 7;
let currentPlayer = 1;
let board = [];
let nicknames = ["Red", "Yellow"];

function createBoard() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    // Render column buttons
    const columnButtons = document.getElementById('column-buttons');
    columnButtons.innerHTML = '';
    for (let c = 0; c < COLS; c++) {
        const btn = document.createElement('button');
        btn.className = 'column-btn';
        btn.textContent = '↓';
        btn.title = `Choose column ${c + 1}`;
        btn.dataset.col = c;
        btn.onclick = handleColumnClick;
        columnButtons.appendChild(btn);
    }
    updateColumnIndicator();
    // Render board
    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            gameBoard.appendChild(cell);
        }
    }
    updatePlayersInfo();
}

function updateColumnIndicator() {
    const buttons = document.querySelectorAll('.column-btn');
    buttons.forEach(btn => {
        btn.classList.remove('current-player1', 'current-player2');
        if (currentPlayer === 1) btn.classList.add('current-player1');
        else btn.classList.add('current-player2');
    });
    updatePlayersInfo();
}

function updatePlayersInfo() {
    const info = document.getElementById('players-info');
    if (!info) return;
    info.innerHTML = `<span style="color:#ff6363">${nicknames[0]}</span> (red) vs <span style="color:#fbb034">${nicknames[1]}</span> (yellow) &nbsp;|&nbsp; <b>Turn:</b> <span style="color:${currentPlayer===1?'#ff6363':'#fbb034'}">${nicknames[currentPlayer-1]}</span>`;
}

function handleColumnClick(e) {
    const col = parseInt(e.target.dataset.col);
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) {
            board[row][col] = currentPlayer;
            updateBoard();
            if (checkWin(row, col)) {
                setTimeout(() => alert(`${nicknames[currentPlayer-1]} wins!`), 10);
                disableBoard();
            } else {
                currentPlayer = 3 - currentPlayer;
                updateColumnIndicator();
                // If bot is enabled and it's bot's turn, make bot move
                if (nicknames[1] === 'Bot' && currentPlayer === 2) {
                    setTimeout(botMove, 500);
                }
            }
            return;
        }
    }
    alert('This column is full!');
}


function updateBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);
        cell.classList.remove('player1', 'player2');
        if (board[r][c] === 1) cell.classList.add('player1');
        if (board[r][c] === 2) cell.classList.add('player2');
    });
}

function checkWin(row, col) {
    const player = board[row][col];
    function count(dx, dy) {
        let r = row + dx, c = col + dy, cnt = 0;
        while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
            cnt++;
            r += dx;
            c += dy;
        }
        return cnt;
    }
    return (
        count(0, 1) + count(0, -1) >= 3 ||
        count(1, 0) >= 3 ||
        count(1, 1) + count(-1, -1) >= 3 ||
        count(1, -1) + count(-1, 1) >= 3
    );
}

function disableBoard() {
    document.querySelectorAll('.column-btn').forEach(btn => {
        btn.disabled = true;
    });
}





document.getElementById('restart').onclick = () => {
    currentPlayer = 1;
    createBoard();
};

function showNicknameModal() {
    const modal = document.getElementById('nickname-modal');
    if (modal) modal.style.display = 'flex';
}
function hideNicknameModal() {
    const modal = document.getElementById('nickname-modal');
    if (modal) modal.style.display = 'none';
}

window.onload = () => {
    // Hide board and controls until nicknames are set
    document.getElementById('column-buttons').style.display = 'none';
    document.getElementById('game-board').style.display = 'none';
    document.getElementById('players-info').style.display = 'none';
    document.getElementById('restart').style.display = 'none';
    showNicknameModal();
    const form = document.getElementById('nickname-form');
    const yellowInput = document.getElementById('nickname-yellow');
    const playBotBtn = document.getElementById('play-bot');
    playBotBtn.onclick = function() {
        yellowInput.value = 'Bot';
        yellowInput.disabled = true;
        playBotBtn.disabled = true;
        playBotBtn.textContent = 'Bot enabled';
    };
    form.onsubmit = function(e) {
        e.preventDefault();
        const red = document.getElementById('nickname-red').value.trim() || 'Red';
        let yellow = yellowInput.value.trim() || 'Yellow';
        if (yellowInput.disabled) yellow = 'Bot';
        nicknames = [red, yellow];
        hideNicknameModal();
        currentPlayer = 1;
        // Show board and controls
        document.getElementById('column-buttons').style.display = '';
        document.getElementById('game-board').style.display = '';
        document.getElementById('players-info').style.display = '';
        document.getElementById('restart').style.display = '';
        createBoard();
    };
};

// Simple bot logic: pick a random non-full column
function botMove() {
    if (nicknames[1] !== 'Bot' || currentPlayer !== 2) return;
    // 1. Try to win
    for (let c = 0; c < COLS; c++) {
        const row = getAvailableRow(c);
        if (row !== -1) {
            board[row][c] = 2;
            if (checkWin(row, c)) {
                board[row][c] = 0;
                handleColumnClick({target: {dataset: {col: c}}});
                return;
            }
            board[row][c] = 0;
        }
    }
    // 2. Block opponent
    for (let c = 0; c < COLS; c++) {
        const row = getAvailableRow(c);
        if (row !== -1) {
            board[row][c] = 1;
            if (checkWin(row, c)) {
                board[row][c] = 0;
                handleColumnClick({target: {dataset: {col: c}}});
                return;
            }
            board[row][c] = 0;
        }
    }
    // 3. Otherwise, random
    const available = [];
    for (let c = 0; c < COLS; c++) {
        if (board[0][c] === 0) available.push(c);
    }
    if (available.length === 0) return;
    const col = available[Math.floor(Math.random() * available.length)];
    handleColumnClick({target: {dataset: {col: col}}});
}

function getAvailableRow(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
        if (board[row][col] === 0) return row;
    }
    return -1;
}
