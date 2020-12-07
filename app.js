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

app.post("/solve", async (req, res) => {
  try {
    let board = req.body["board"];
    let solver = new SudokuSolver(board);
    solver.solve();
    let newBoard = solver.toString();
    res.type("text");
    res.send(newBoard);
  } catch (err) {
    res.status(SERVER_ERROR).send("Yikes! Something went wrong on the server!");
  }
});

app.get("/getDefault", async (req, res) => {
  res.type("text");
  try {
    let data = await fs.readFile("board.txt", "utf8");
    res.send(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      res.status(SERVER_ERROR).send("Oh no! A file is missing!");
    } else {
      res.status(SERVER_ERROR).send("Yikes! Something went wrong on the server!");
    }
  }
});




app.use(express.static('public'));
const PORT = process.env.PORT || PORT_NUM;
app.listen(PORT);