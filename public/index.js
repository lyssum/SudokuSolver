"use strict";
(function() {

  const SUDOKU_BOARD_SQUARES = 81;

  window.addEventListener("load", init);

  function init() {
    genBoard();
    getDefaultBoard();
    id("solve_button").addEventListener("click", solvePuzzle);
    id("reset_button").addEventListener("click", resetBoard);
    id("clear_button").addEventListener("click", clearBoard);
  }

  function genBoard() {
    let colorIndex = 1;
    for (let i = 0; i < SUDOKU_BOARD_SQUARES; i++) {
      let square = gen("div");
      let input = gen("input");
      input.type = "text";
      input.minLength = "0";
      input.maxLength = "1";
      square.appendChild(input);
      colorIndex = changeColor(colorIndex, i, input);
      square.classList.add("square");
      id("board").appendChild(square);
    }
  }

  function getDefaultBoard() {
    fetch("/getDefault")
      .then(checkStatus)
      .then(resp => resp.text())
      .then(fillBoard)
      .catch(console.error());
  }

  function clearBoard() {
    resetButtons();
    let inputs = qsa("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = 0;
    }
  }

  function resetBoard() {
    resetButtons();
    getDefaultBoard();
  }

  function resetButtons() {
    if (id("solve_button").disabled) {
      id("solve_button").disabled = false;
      id("solve_button").textContent = "Solve";
    }
  }

  function solvePuzzle() {
    id("solve_button").disabled = true;
    id("solve_button").textContent = "Thinking...";
    qs("#loading").classList.toggle("hidden");
    let board = parseBoard();
    let params = new FormData();
    params.append("board", board);
    fetch("/solve", {method: "POST", body: params})
      .then(checkStatus)
      .then(resp => resp.text())
      .then(fillBoard)
      .then(solved)
      .catch(console.error());
  }

  function solved() {
    qs("#loading").classList.toggle("hidden");
    id("solve_button").textContent = "Solved!";
  }

  function parseBoard() {
    let currPuzzle = "";
    let inputs = qsa("input");
    for (let i = 0; i < inputs.length; i++) {
      currPuzzle += inputs[i].value;
    }
    return currPuzzle;
  }

  function changeColor(colorIndex, index, input) {
    if (index >= 0 && index <= 26 || index >= 54) {
      if (colorIndex >= 4 && colorIndex <= 6) {
        input.classList.add("darkerSquare");
      }
    } else {
      if (colorIndex >= 1 && colorIndex < 4 || colorIndex > 6) {
        input.classList.add("darkerSquare");
      }
    }
    if (colorIndex === 9) {
      colorIndex = 1;
    } else {
      colorIndex++;
    }
    return colorIndex;
  }

  function fillBoard(puzzle) {
    puzzle = puzzle.replace(/\s/g,'');
    let inputs = qsa("input");
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].value = puzzle.charAt(i);
    }
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   * @param {object} response - response to check for success/error
   * @return {object} - valid response if response was successful, otherwise rejected
   *                    Promise result
   */
  async function checkStatus(response) {
    if (response.ok) {
      return response;
    } else {
      let resp = await response.json();
      let errorMsg = resp.error;
      throw Error(errorMsg);
    }
  }

  /**
   * Shortcut for getElementByID
   * @param {string} id - element ID
   * @return {object} DOM object associated with id.
   */
  function id(id) {
    return document.getElementById(id);
  }

  /**
   * Shortcut for querySelector
   * @param {string} selector - CSS query selector
   * @return {Element} the first element matching the query
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Shortcut for querySelectorAll
   * @param {string} query - CSS query selector
   * @returns {object[]} array of DOM objects matching the query
   */
  function qsa(query) {
    return document.querySelectorAll(query);
  }

  /**
   * Shortcut for createElement
   * @param {String} elType - type of element to be generated
   * @return {Element} - newly generated element
   */
  function gen(elType) {
    return document.createElement(elType);
  }
})();