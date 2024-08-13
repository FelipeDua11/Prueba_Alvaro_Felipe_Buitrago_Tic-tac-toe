import { useState, useEffect } from "react";
import confetti from "canvas-confetti";

import { Square } from "./components/Square.jsx";
import { TURNS } from "./constants.js";
import { checkWinnerFrom, checkEndGame } from "./logic/board.js";
import { WinnerModal } from "./components/WinnerModal.jsx";
import { saveGameToStorage, resetGameStorage } from "./logic/storage/index.js";

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem("board");
    if (boardFromStorage) return JSON.parse(boardFromStorage);
    return Array(9).fill(null);
  });

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn");
    return turnFromStorage ?? TURNS.X;
  });

  const [winner, setWinner] = useState(null);

  const [scores, setScores] = useState(() => {
    const scoresFromStorage = window.localStorage.getItem("scores");
    return scoresFromStorage ? JSON.parse(scoresFromStorage) : { X: 0, O: 0 };
  });

  useEffect(() => {
    window.localStorage.setItem("scores", JSON.stringify(scores));
  }, [scores]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);

    resetGameStorage();
  };

  const updateBoard = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = turn;
    setBoard(newBoard);

    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn);

    saveGameToStorage({
      board: newBoard,
      turn: newTurn,
    });

    const newWinner = checkWinnerFrom(newBoard);
    if (newWinner) {
      confetti();
      setWinner(newWinner);
      updateScores(newWinner, "win");
    } else if (checkEndGame(newBoard)) {
      setWinner(false);
      updateScores(null, "draw");
    }
  };

  const updateScores = (winner, result) => {
    console.log("Current Scores:", scores);
    console.log("Winner:", winner);
    console.log("Result:", result);

    let newScores = { ...scores };

    if (result === "win") {
      if (winner && (winner === TURNS.X || winner === TURNS.O)) {
        newScores[winner] += 100;
        const loser = winner === TURNS.X ? TURNS.O : TURNS.X;
        newScores[loser] -= 20;
      }
    } else if (result === "draw") {
      newScores[TURNS.X] += 50;
      newScores[TURNS.O] += 50;
    }

    console.log("Updated Scores:", newScores);

    setScores(newScores);
  };

  return (
    <main className="board">
      <h1>Tic Tac Toe</h1>
      <button onClick={resetGame}>Reset del juego</button>

      <section className="scores">
        <h2>Scores</h2>
        <p>Player X: {scores.X}</p>
        <p>Player O: {scores.O}</p>
      </section>

      <section className="game">
        {board.map((square, index) => {
          return (
            <Square key={index} index={index} updateBoard={updateBoard}>
              {square}
            </Square>
          );
        })}
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

      <WinnerModal resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
