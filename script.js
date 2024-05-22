// Seleccionamos todas las celdas del juego
const cells = document.querySelectorAll('.cell');
// Seleccionamos el contenedor de texto para el estado del juego
const statusText = document.getElementById('status');
// Estado inicial del juego, un array con 9 posiciones vacías
let gameState = ["", "", "", "", "", "", "", "", ""];
// Condiciones para ganar, cada sub-array contiene las posiciones que forman una línea ganadora
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
    [0, 4, 8], [2, 4, 6]  // Diagonales
];
// Variable para determinar si el juego está activo
let gameActive = true;
// El jugador actual comienza como 'X'
let currentPlayer = 'X';

// Función que maneja los clics en las celdas
const handleCellClick = (e) => {
    // La celda clickeada
    const cell = e.target;
    // El índice de la celda clickeada
    const index = cell.getAttribute('data-index');

    // Si la celda ya está ocupada o el juego ha terminado, no hacer nada
    if (gameState[index] !== "" || !gameActive) {
        return;
    }

    // Actualizar el estado del juego y la interfaz de usuario
    gameState[index] = currentPlayer;
    cell.textContent = currentPlayer;

    // Verificar si el jugador actual ha ganado
    if (checkWin(currentPlayer)) {
        statusText.textContent = `¡Jugador ${currentPlayer} ha ganado!`;
        gameActive = false;
        return;
    }

    // Verificar si hay empate (todas las celdas ocupadas)
    if (!gameState.includes("")) {
        statusText.textContent = '¡Es un empate!';
        gameActive = false;
        return;
    }

    // Cambiar el jugador actual a 'O' (computadora)
    currentPlayer = 'O';
    // Hacer que la computadora realice su movimiento después de medio segundo
    setTimeout(computerMove, 500);
};

// Función para verificar si el jugador actual ha ganado
const checkWin = (player) => {
    // Revisar cada condición ganadora
    return winningConditions.some(condition => {
        // Verificar si todas las posiciones en la condición tienen el símbolo del jugador
        return condition.every(index => {
            return gameState[index] === player;
        });
    });
};

// Función que hace que la computadora realice su movimiento
const computerMove = () => {
    // Usar el algoritmo minimax para encontrar el mejor movimiento
    let bestMove = minimax(gameState, currentPlayer).index;
    // Actualizar el estado del juego y la interfaz de usuario
    gameState[bestMove] = currentPlayer;
    cells[bestMove].textContent = currentPlayer;

    // Verificar si la computadora ha ganado
    if (checkWin(currentPlayer)) {
        statusText.textContent = `¡La computadora ha ganado!`;
        gameActive = false;
        return;
    }

    // Verificar si hay empate
    if (!gameState.includes("")) {
        statusText.textContent = '¡Es un empate!';
        gameActive = false;
        return;
    }

    // Cambiar el jugador actual de vuelta a 'X'
    currentPlayer = 'X';
    // Actualizar el mensaje de estado para el turno del jugador
    statusText.textContent = `Turno del Jugador ${currentPlayer}`;
};

// Algoritmo minimax para determinar el mejor movimiento
const minimax = (newGameState, player) => {
    // Encontrar todas las celdas disponibles
    const availSpots = newGameState.map((val, index) => val === "" ? index : null).filter(val => val !== null);

    // Verificar si alguien ha ganado o si hay empate
    if (checkWin('X')) {
        return { score: -10 };
    } else if (checkWin('O')) {
        return { score: 10 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    // Guardar todos los movimientos posibles y sus puntajes
    const moves = [];
    for (let i = 0; i < availSpots.length; i++) {
        const move = {};
        move.index = availSpots[i];
        newGameState[availSpots[i]] = player;

        if (player === 'O') {
            const result = minimax(newGameState, 'X');
            move.score = result.score;
        } else {
            const result = minimax(newGameState, 'O');
            move.score = result.score;
        }

        newGameState[availSpots[i]] = "";
        moves.push(move);
    }

    // Elegir el mejor movimiento
    let bestMove;
    if (player === 'O') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = moves[i];
            }
        }
    }

    return bestMove;
};

// Añadir el evento de clic a cada celda
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
// Mostrar el turno inicial del jugador
statusText.textContent = `Turno del Jugador ${currentPlayer}`;

