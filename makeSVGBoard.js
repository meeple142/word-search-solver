const letterHeight = 10,
    letterSpacing = 10,
    margin = letterSpacing * 2,
    boardFont = {
        family: 'Arial',
        size: letterHeight
    },
    wordStroke = {
        color: 'red',
        opacity: 0.25,
        width: letterHeight,
        linecap: "round"
    },
    circleStroke = {
        color: 'red',
        width: 1
    },
    circleFill= {
        color: 'transparent'
    };;



function getCanvas(board) {
    const { createSVGWindow } = require('svgdom');
    const window = createSVGWindow();
    const SVG = require('svg.js')(window);
    const document = window.document;
    const boardWidth = board[0].length;
    const boardHeight = board.length;

    const width = boardWidth * letterHeight + (boardWidth - 1) * letterSpacing + margin * 2;
    const height = boardHeight * letterHeight + (boardHeight - 1) * letterSpacing + margin * 2;
    const canvas = SVG(document.documentElement)
        .viewbox(0, 0, width, height);
    return canvas;
}

function saveSVG(string) {
    var fs = require("fs");
    fs.writeFileSync("board.svg", string, "utf8");
}

function boardScale(num) {
    return num * (letterSpacing + letterHeight)
}

function makeSvgBoard(boardData, wordsData) {
    //Get Canvas
    var canvas = getCanvas(boardData);

    //set up groups
    var boardGroup = canvas.group().move(margin, margin),
        lettersGroup = boardGroup.group(),
        wordsGroup = boardGroup.group();

    // make Letters
    boardData.forEach((row, iRow) => {
        row.forEach((letter, iLetter) => {
            lettersGroup.plain(letter)
                .font(boardFont)
                .cx(boardScale(iLetter))
                .cy(boardScale(iRow))
        })
    });

    //make Words
    wordsData.forEach(word => {
        word.locations.forEach(l => {
            wordsGroup
                .line(
                    boardScale(l.start.x),
                    boardScale(l.start.y),
                    boardScale(l.end.x),
                    boardScale(l.end.y))
                .stroke(wordStroke);
            wordsGroup
            .circle(letterHeight * 1.1)
            .cx(boardScale(l.start.x))
            .cy(boardScale(l.start.y))
            .fill(circleFill)
            .stroke(circleStroke);
        })
    })
   
    // get your svg as string
    saveSVG(canvas.svg());

}



module.exports = makeSvgBoard;