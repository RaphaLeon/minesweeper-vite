import { config } from "./config";
import { Cell } from "./cell";

export class Board {
	#cells = [];

	constructor(level) {
		this.#build(level);
	}
	
	#build(level) {
		const shuffleArray = (array) => array.sort(e => Math.random() - 0.5);
		const boardSize = level.rows * level.cols;
		const safeCells = new Array(boardSize - level.mines).fill(null).map(() => 0);
		const mines = new Array(level.mines).fill(null).map(() => config.MINE);
		const board = shuffleArray([...safeCells, ...mines]).map((value, index) => ({ value, index }));
		const minesIndexes = board.filter(({value}) => value === config.MINE).map(({index}) => index);

		minesIndexes.forEach(mineIndex => {
			this.#getPerimeter(mineIndex, level).forEach(index => {
				if (board[index].value !== config.MINE) board[index].value += 1;
			})
		});

		this.#cells = board.map(({value, index}) => new Cell(value, this.#getPerimeter(index, level)));
	}

	#getPerimeter(index, level) {
		const isLeftBoundary = index => index % level.cols === 0;
		const isRightBoundary = index => index % level.cols === level.cols - 1;
		const isInBoundaries = index => index >= 0 && index < level.rows * level.cols;
		const topCell = index - level.cols;
		const bottomCell = index + level.cols;
		const leftCells = [topCell - 1, index - 1, bottomCell - 1];
		const rightCells = [topCell + 1, index + 1, bottomCell + 1];
		const perimeter = [topCell, bottomCell];
	
		if (!isLeftBoundary(index)) perimeter.push(...leftCells);
		if (!isRightBoundary(index)) perimeter.push(...rightCells);
	
		return perimeter.filter(isInBoundaries).sort((a, b) => a - b);
	}

	#getAllByCriteria(filetrFn) {
		return this.#cells.filter(filetrFn);
	}

	getCellPerimeter(cell) {
		return cell.getPerimeter().map((index) => this.#cells[index]);
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