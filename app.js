import SudokuSolver from "./SudokuSolver.js";
import express from "express";
import multer from "multer";
import fs from 'fs/promises';

"use strict";

const app = express();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const SERVER_ERROR = 500;
const PARAMS_ERROR = 400;
const PORT_NUM = 8000;

// Uses the board parameter to solve a given sudoku board. Sends a solved board as a response.
app.post("/solve", async (req, res) => {
  try {
    let board = req.body["board"];
    let solver = new SudokuSolver(board);
    solver.solve();
    res.type("text");
    if (solver.board !== null) {
      let newBoard = solver.toString();
      res.send(newBoard);
    } else {
      res.status(PARAMS_ERROR).send({error: "The given puzzle was not a valid Sudoku Puzzle! Try again with a new puzzle!"});
    }
  } catch (err) {
    res.status(SERVER_ERROR).send({error: "Yikes! Something went wrong on the server!"});
  }
});

// Responds with a the board.txt that contains the default sudoku board
app.get("/getDefault", async (req, res) => {
  res.type("text");
  try {
    let data = await fs.readFile("board.txt", "utf8");
    res.send(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(SERVER_ERROR).send({error: "Oh no! A file is missing!"});
    } else {
      res.status(SERVER_ERROR).send({error: "Yikes! Something went wrong on the server!"});
    }
  }
});




app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);