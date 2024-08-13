export const saveGameToStorage = ({ board, turn, scores }) => {
  // Guardar el tablero y el turno
  window.localStorage.setItem("board", JSON.stringify(board));
  window.localStorage.setItem("turn", turn);

  // Guardar las puntuaciones
  if (scores) {
    window.localStorage.setItem("scores", JSON.stringify(scores));
  }
};

export const resetGameStorage = () => {
  window.localStorage.removeItem("board");
  window.localStorage.removeItem("turn");
  window.localStorage.removeItem("scores");
};
