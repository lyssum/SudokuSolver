export default class Tile {

  // This tile's possible candidates
  #candidates
  // This tile's current value
  #value

  // Constructs a tile from a given number
  constructor(number) {
    if (number != 0) {
      this.#candidates = new Set();
    } else {
      this.#candidates = this.buildSet();
    }
    this.#value = parseInt(number);
  }

  /**
   * @returns a set of this tile's possible values
   */
  buildSet() {
    let temp = new Set();
    for (let i = 1; i < 10; i++) {
      temp.add(i);
    }
    return temp;
  }

  // @returns this tile's value
  getValue() {
    return this.#value;
  }

  // Sets this tile's value
  setValue(value) {
    this.#value = parseInt(value);
  }

  // @returns this tile's candidates
  getCandidates() {
    return this.#candidates;
  }

  // Sets this tile's candidates
  setCandidates(candidates) {
    this.#candidates = candidates;
  }

  // @returns A string representation of this tile's candidates
  toString() {
    return this.#candidates + " ";
  }
}