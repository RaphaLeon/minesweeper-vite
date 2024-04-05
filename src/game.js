import { config } from "./config";
import { Board } from "./board";

const gameBoard = document.querySelector('#board');
const spnTotalFlags = document.querySelector('#spnTotalFlags');
const endGameModal = document.querySelector('#messageModal');
const endGameMessage = document.querySelector('#divMessage');

export class Game {
	constructor(level) {
		this.level = level;
		this.board = new Board(level);
		this.start();
	}

	start() {
		this.totalFlaggeds = 0;
		this.movesRemaining = this.board.getSafes().length;
		this.renderBoard();
		this.updateTotalFlagsIndicator();
	}

	renderBoard() {
		gameBoard.innerHTML = ''
		this.board.getAll().forEach((row) => {
			const rowDiv = document.createElement('div');
			rowDiv.className = 'board-row';
			row.forEach((cell) => {
				const cellDiv = document.createElement('div');
				cellDiv.className = 'cell';
				cellDiv.addEventListener('click', (e) => {
					this.openCell(cell);
				});
				
				cellDiv.addEventListener('contextmenu', (e) => {
					e.preventDefault();
					this.setFlag(cell);
				}, false);
				
				if (config.showHelp) {
					cellDiv.addEventListener('mouseover', () => {
						this.showPerimeter(cell);
					});
					cellDiv.addEventListener('mouseout', () => {
						this.hidePerimeter(cell);
					});
				}
				
				cell.setUI(cellDiv);
				rowDiv.appendChild(cellDiv);
			});
			gameBoard.appendChild(rowDiv);
		})
	}

	openCell(cell) {
		if (!cell.isEnable() || cell.isFlagged()) return;

		if (cell.isAMine()) {
			this.openMine(cell);
			return;
		}

		if (cell.isSafe()) {
			this.openSafe(cell);
			return;
		}

		this.openEmpty(cell);
	}

	openMine(cell) {
		cell.open();
		this.lose();
		this.showMessage(config.messages.LOSE);
	}

	openSafe(cell) {
		cell.open();
		this.movesRemaining -= 1;
		if (this.movesRemaining === 0) {
			this.win();
			this.totalFlaggeds = this.level.mines;
			this.updateTotalFlagsIndicator();
			this.showMessage(config.messages.WIN);
		}
	}

	openEmpty(cell) {
		cell.open();
		let perimeter = this.board.getCellPerimeter(cell);
		for (let itrCell of perimeter) {
			if (!itrCell.isEnable() || itrCell.isFlagged()) continue;

			itrCell.isEmpty() ? this.openEmpty(itrCell) : this.openSafe(itrCell);
		}
	}

	setFlag(cell) {
		if (!cell.isEnable()) return;

		cell.toggleFlag();
		if (cell.isFlagged()) {
			this.totalFlaggeds += 1;
		} else {
			this.totalFlaggeds -= 1;
		}
		this.updateTotalFlagsIndicator();
	}

	win() {
		this.board.getEnables().forEach(cell => {
			cell.disable();
			if (cell.isAMine() && !cell.isFlagged()) cell.toggleFlag();
		})
	}

	lose() {
		this.board.getEnables().forEach(cell => {
			cell.disable();
			if (cell.isAMine())
				cell.show()
			else if (cell.isFlagged())
				cell.setWrongFlag();
		})
	}

	updateTotalFlagsIndicator() {
		spnTotalFlags.innerHTML = `${this.totalFlaggeds}/${this.level.mines}`;
	}

	showMessage(message) {
		endGameModal.innerHTML = message.content;
		endGameMessage.className = message.class;
		$('#modalMessage').modal('show');
	}

	showPerimeter(cell) {
		this.board.getCellPerimeter(cell).forEach(perimeterCell => perimeterCell.highlightOn());
	}

	hidePerimeter(cell) {
		this.board.getCellPerimeter(cell).forEach(perimeterCell => perimeterCell.highlightOff())
	}
}
