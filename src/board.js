import { config } from "./config";
import { Cell } from "./cell";

export class Board {
	#cells = [];

	constructor({ rows, cols, mines }) {
		this.rows = rows;
		this.cols = cols;
		this.mines = mines;
		this.#build();
	}

	#build() {
		const minesCoords = this.#getMinesCoords();
		const isMine = ({ row, col }) => minesCoords.some(mine => mine.row === row && mine.col === col);

		for (let row = 0; row <= this.rows; row++) {
			this.#cells.push([]);
			for (let col = 0; col <= this.cols; col++) {
				const perimeter = this.#getCellPerimeterCoords({ row, col });
				let value = isMine({ row, col }) ? config.MINE : perimeter.filter(isMine).length;
				this.#cells[row][col] = new Cell(value, perimeter);
			}
		}
	}

	#getMinesCoords() {
		let minesRemaining = this.mines;
		const minesCoords = {};
		while (minesRemaining > 0) {
			const { row, col } = this.#getRandomCellCoords();
			if (!minesCoords[row + '_' + col]) {
				minesCoords[row + '_' + col] = { row, col };
				minesRemaining -= 1;
			}
		}
		return Object.values(minesCoords);
	}

	#getRandomCellCoords() {
		let row = Math.floor((Math.random() * this.rows));
		let col = Math.floor((Math.random() * this.cols));
		return { row, col };
	}

	#getCellPerimeterCoords(cell) {
		let perimeter = [];

		const getLimits = (axe, MAX) => {
			const from = axe - 1 >= 0 ? axe - 1 : axe;
			const to = axe + 1 <= MAX ? axe + 1 : axe;
			return { from, to };
		};

		const { from: rowFrom, to: rowTo } = getLimits(cell.row, this.rows);
		const { from: colFrom, to: colTo } = getLimits(cell.col, this.cols);

		for (let row = rowFrom; row <= rowTo; row++) {
			for (let col = colFrom; col <= colTo; col++) {
				if (row + '_' + col !== cell.row + '_' + cell.col)
					perimeter.push({ row, col });
			}
		}
		return perimeter;
	}

	#getAllByCriteria(filetrFn) {
		return this.#cells.flat().filter(filetrFn);
	}

	getCellPerimeter(cell) {
		return cell.getPerimeter().map(({ row, col }) => this.#cells[row][col]);
	}

	getAll() {
		return this.#cells;
	}

	getSafes() {
		return this.#getAllByCriteria(cell => cell.isSafe());
	}

	getEnables() {
		return this.#getAllByCriteria(cell => cell.isEnable());
	}
}