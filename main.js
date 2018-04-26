var fs= require('fs');
var diagnalDownBoardWide = [
    [5, 6, 7, 8, 9, 1, 2],
    [4, 5, 6, 7, 8, 9, 1],
    [3, 4, 5, 6, 7, 8, 9],
    [2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7]],
    diagnalDownBoardTall = [
        [7, 1, 2, 3],
        [6, 7, 1, 2],
        [5, 6, 7, 1],
        [4, 5, 6, 7],
        [3, 4, 5, 6],
        [2, 3, 4, 5],
        [1, 2, 3, 4]],
    diagnalUpBoardWide = [
        [4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6, 7],
        [2, 3, 4, 5, 6, 7, 8],
        [3, 4, 5, 6, 7, 8, 9]],
    diagnalUpBoardTall = [
        [5, 6, 7, 1],
        [6, 7, 1, 2],
        [7, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [4, 5, 6, 7]],
    verticalBoard = [
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7]
    ];


function getVerticalLines(board) {
    //this whole thing is just a transposing function.

    //make an array with one set of arrays
    //the number of arrays in the set is equal to the length of the first row of the board
    var lines = Array(board[0].length).fill(1).map(d => []);

    //go through each row and put each leter in the correct spot
    lines = board.reduce(function (linesIn, row, rowi) {

        row.forEach(function (letter, i) {
            linesIn[i].push(letter);
        });

        return linesIn;
    }, lines);

    return lines;
}


function getDiagnals(board) {
    function padBoard(board, dummyChar, isDown) {
        var paddedBoard = board.map(function (row, i, board) {
            var frontCount = -i + board.length - 1,
                endCount = board.length - frontCount - 1,
                front = Array(frontCount).fill(dummyChar),
                back = Array(endCount).fill(dummyChar);

            //switch frount and back
            if (!isDown) {
                let temp = front;
                front = back;
                back = temp;
            }

            return front.concat(row, back);

        });
        return paddedBoard;
    }

    function removeDummyChar(lines, dummyChar) {
        //and for each line filter out the dummy char
        return lines.map(line => line.filter(letter => letter !== dummyChar));
    }

    var linesDown,
        linesUp,
        dummyChar = 0,
        //pad the rows so the diagnal down line up verticaly
        downPadded = padBoard(board, dummyChar, true),
        upPadded = padBoard(board, dummyChar, false);

    console.log("downPadded:");
    console.log(downPadded);
    console.log("upPadded:");
    console.log(upPadded);

    //now all we need to get the vert lines and remove the dummy chars
    linesDown = removeDummyChar(getVerticalLines(downPadded), dummyChar);
    linesUp = removeDummyChar(getVerticalLines(upPadded), dummyChar);


    return linesDown.concat(linesUp);
}

function makeWordsFromLines(lines) {
    var words;

    words = lines.reduce((words, line) => {

        // var lengthOptions = Array(line.length)
        // .fill(1)
        // .map((d,i)=>line.slice(i));

        //this is way faster
        for (i = 0; i < line.length; ++i) {
            for (j = i + 1; j < line.length; ++j) {
                words.push(line.slice(i, j));
            }
        }


        return words;
    }, []);
    return words;
}

//first thing we need to do is to map the board to a 2d array of letterObjs {letter:"",x:#,y:#}
//that way after we slice the words we can make word obj

// var board = verticalBoard;
var board = diagnalDownBoardTall;
var linesVert = getVerticalLines(board);
var linesDiag = getDiagnals(board);


console.log("board:");
console.log(board);

// we need the horiz and the vert and the diag
//horiz comes from the board it's self
var allLines = board.concat(linesVert, linesDiag);
console.log("allLines:");
console.log(allLines);

//this is where we reverse them if we want to
//just do a map to reverse and concat the lines

//convert the lines in tow words
var words = makeWordsFromLines(allLines);


fs.writeFileSync('out.json',JSON.stringify(words))
// make word objs {value:"abc",start:{x:#,y:#},end:{x:#,y:#}}

//check if the words are actually words in the dictionary list