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
    this.show();
  }

  show() {
    if (this.isAMine()) {
      this.htmlCell.classList.add('mine');
      return;
    }
    this.htmlCell.classList.add('safe');
    this.htmlCell.style.color = config.colorValues[this.#value] || '';
    this.htmlCell.innerHTML = this.#value > 0 ? this.#value : '';
  }

  setWrongFlag() {
    this.htmlCell.classList.add('wronglyFlagged');
  }

  highlightOn() {
    this.htmlCell.style.backgroundColor = this.isAMine() ? config.highlighColorValues.mine : config.highlighColorValues.safe;
  }

  highlightOff() {
    this.htmlCell.style.backgroundColor = '';
  }
}
