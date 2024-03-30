import { config } from "./src/config";
import { Game } from "./src/game";

const inputLevel = document.querySelector('#level')
inputLevel.addEventListener('change', startGame);
document.querySelector('#retryGame').addEventListener('click', startGame);

function startGame() {
	const level = config.levels.find(level => level.name === inputLevel.value);
	new Game(level);
}

startGame();