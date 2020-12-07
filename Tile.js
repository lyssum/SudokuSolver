export default class Tile {
  #candidates
  #value
  constructor(number) {
    if (number != 0) {
      this.#candidates = new Set();
    } else {
      this.#candidates = this.buildSet();
    }
    this.#value = parseInt(number);
  }

  buildSet() {
    let temp = new Set();
    for (let i = 1; i < 10; i++) {
      temp.add(i);
    }
    return temp;
  }

  getValue() {
    return this.#value;
  }

  setValue(value) {
    this.#value = parseInt(value);
  }

  getCandidates() {
    return this.#candidates;
  }

  setCandidates(candidates) {
    this.#candidates = candidates;
  }

  toString() {
    return this.#candidates + " ";
  }
}