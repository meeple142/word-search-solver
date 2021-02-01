var svgMaker = require("./makeSVGBoard"),
    readInBoard = require("./readInBoard"),
    realWords = require("./realWords.json"),
    boardPath = "./customBoard.txt";

svgMaker(readInBoard(boardPath), realWords);