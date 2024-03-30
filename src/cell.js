import { config } from "./config";

export class Cell {
  #value;
  #isEnable = true;
  #isFlagged = false;
  #perimeter = [];

  constructor(value, perimeter) {
    this.#value = value;
    this.#perimeter = perimeter
  }

  isAMine() { return this.#value === config.MINE }
  isEmpty() { return this.#value === 0; }
  isSafe() { return this.#value > 0; }
  isFlagged() { return this.#isFlagged }
  isEnable() { return this.#isEnable }
  getPerimeter() { return this.#perimeter }
  disable() { this.#isEnable = false }
  setUI(htmlCell) { this.htmlCell = htmlCell }

  toggleFlag() {
    this.#isFlagged = !this.#isFlagged;
    this.htmlCell.classList.toggle('flag');
  }

  open() {
    this.disable();
    if (this.isAMine()) {
      this.htmlCell.classList.add('boom');
      return;
    }

    this.htmlCell.classList.add('safe');
    this.htmlCell.style.color = config.colorValues[this.#value] || '';
    this.htmlCell.innerHTML = this.#value > 0 ? this.#value : '';
  }

  show(gameStatus) {
    this.disable();

    if (this.isAMine()) {
      if (this.isFlagged()) return;
      this.htmlCell.classList.add(gameStatus === 'win' ? 'flag' : 'mine');
    }

    if (this.isFlagged()) {
      this.htmlCell.classList.add('wronglyFlagged');
      return;
    }
  }

  highlightOn() {
    this.htmlCell.style.backgroundColor = this.isAMine() ? config.highlighColorValues.mine : config.highlighColorValues.safe;
  }

  highlightOff() {
    this.htmlCell.style.backgroundColor = '';
  }
}
