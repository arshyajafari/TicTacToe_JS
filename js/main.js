// static data
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],
  players = [
    { player_name: "Player 1", player_char: "X", color: "rgb(233, 150, 122)" },
    { player_name: "Player 2", player_char: "O", color: "rgb(127, 255, 212)" },
  ],
  promptModal = document.querySelector(".prompt-modal"),
  alertModal = document.querySelector(".alert-modal");

promptModal.style.display = "block";
alertModal.style.display = "none";

// dynamic data
let currentTurn = 0,
  isFinish = false,
  gameMode = "",
  countPlayerOneScore = 0,
  countPlayerTwoScore = 0,
  boardTiles = ["", "", "", "", "", "", "", "", ""];

// game mode method handler
const radioButton = document.querySelectorAll(".radio-input");
for (let i = 0; i < radioButton.length; i++) {
  radioButton[i].addEventListener("change", (e) => {
    gameMode = e.target.value;

    if (gameMode === "1") {
      document.querySelector(".player-form").style.height = "17rem";
      document.querySelector(".text-box").style.display = "block";
      document.querySelectorAll(".text-label")[1].style.display = "block";
      document.querySelectorAll(".text-input")[1].style.display = "block";
    } else {
      document.querySelector(".player-form").style.height = "11rem";
      document.querySelector(".text-box").style.display = "block";
      document.querySelectorAll(".text-label")[1].style.display = "none";
      document.querySelectorAll(".text-input")[1].style.display = "none";
    }
  });
}

// get player or players name
const submitButton = document.querySelector("#submit");
submitButton.addEventListener("click", (e) => {
  e.preventDefault();

  const playerOne = document.querySelector("#playerOne").value.trim();
  const playerTwo = document.querySelector("#playerTwo").value.trim();

  if (gameMode === "1") {
    players[0].player_name = playerOne ?? "Player 1";
    players[1].player_name = playerTwo ?? "Player 2";
  } else {
    players[0].player_name = playerOne ?? "Player 1";
    players[1].player_name = "Computer";
  }

  promptModal.style.display = "none";
  document.querySelector("#playerOne").value = "";
  document.querySelector("#playerTwo").value = "";
  document.querySelector(".radio-input:checked").checked = false;

  countPlayersScores();
  randomTurn();
  gameTurnMessage();
});

// reset game
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", () => {
  if (
    promptModal.style.display === "block" ||
    alertModal.style.display === "block"
  )
    return;

  isFinish = false;
  boardTiles = ["", "", "", "", "", "", "", "", ""];

  randomTurn();
  gameTurnMessage();

  document.querySelectorAll(".cells").forEach((cell) => (cell.innerHTML = ""));
});

// info game
const infoButton = document.querySelector("#info");
infoButton.addEventListener("click", () => {
  const alertModal = document.querySelector(".alert-modal");
  alertModal.style.display = "block";
  alertModal.setAttribute("alert-text", "About Game");
  document.querySelector(".alert-message").innerHTML =
    "3x3 tic-tac-toe game that provides you with the ability to play for two and play with the computer. You can enter your name as desired. Thanks.";

  if (
    promptModal.style.display === "block" ||
    alertModal.style.display === "block"
  )
    return;
});

// close prompt modal
const closePromptButton = document.querySelector("#close-prompt");
closePromptButton.addEventListener("click", () => {
  document.querySelector(".prompt-modal").style.display = "none";
  countPlayersScores();
  randomTurn();
  gameTurnMessage();
});

// close alert modal
const closeAlertButton = document.querySelector("#close-alert");
closeAlertButton.addEventListener("click", () => {
  document.querySelector(".alert-modal").style.display = "none";
  gameTurnMessage();
});

// random turn
const randomTurn = () => (currentTurn = Math.floor(Math.random() * 2));

// count players scores
const countPlayersScores = () => {
  document.querySelector(
    "#player1"
  ).innerHTML = `${players[0].player_name} : ${countPlayerOneScore}`;
  document.querySelector(
    "#player2"
  ).innerHTML = `${players[1].player_name} : ${countPlayerTwoScore}`;
};

// game turn message
const gameTurnMessage = () => {
  const gameMessage = document.querySelector(".game-message");

  gameMessage.innerHTML = `It's the turn of ${
    currentTurn === 0
      ? `<span style="color:${players[0].color}">${players[0].player_name}</span>`
      : `<span style="color:${players[1].color}">${players[1].player_name}</span>`
  }`;
};

// get data of the selected cell
document.querySelectorAll(".cells").forEach((cell) =>
  cell.addEventListener("click", (e) => {
    if (
      promptModal.style.display === "block" ||
      alertModal.style.display === "block"
    )
      return;

    let dataCellIndex = eval(e.target.getAttribute("data-cell-index"));

    if (boardTiles[dataCellIndex] !== "" || isFinish) return;

    fillCellsHandler(e.target, dataCellIndex);

    checkWinnerGame();
  })
);

// fill cells X and O handler
const fillCellsHandler = (target, index) => {
  if (
    promptModal.style.display === "block" ||
    alertModal.style.display === "block"
  )
    return;

  boardTiles[index] = players[currentTurn].player_char;
  target.innerHTML = players[currentTurn].player_char;
};

// checked winner game
const checkWinnerGame = () => {
  if (
    promptModal.style.display === "block" ||
    alertModal.style.display === "block"
  )
    return;

  let playerWon = false;

  for (let i = 0; i < 8; i++) {
    let winCond = winConditions[i],
      x = boardTiles[winCond[0]],
      y = boardTiles[winCond[1]],
      z = boardTiles[winCond[2]];

    if (x === "" || y === "" || z === "") continue;

    if (x === "X" && x === y && y === z) {
      playerWon = true;
      document.querySelector("#player1").innerHTML = `${
        players[0].player_name
      } : ${countPlayerOneScore++}`;
      break;
    } else if (x === "O" && x === y && y === z) {
      playerWon = true;
      document.querySelector("#player2").innerHTML = `${
        players[1].player_name
      } : ${countPlayerTwoScore++}`;
      break;
    }
  }

  if (playerWon) {
    document.querySelector(
      ".game-message"
    ).innerHTML = `${players[currentTurn].player_name} has won!`;
    countPlayersScores();
    isFinish = true;
    return;
  }

  let drawResult = !boardTiles.includes("");

  if (drawResult) {
    document.querySelector(".game-message").innerHTML = `Game ended in a draw!`;
    isFinish = true;
    return;
  }

  changePLayerTurn();
};

// change player turn
const changePLayerTurn = () => {
  currentTurn = currentTurn === 0 ? 1 : 0;
  gameTurnMessage();
};
