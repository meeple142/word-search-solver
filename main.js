
var fs = require('fs'),
    pretty = require('json-stringify-pretty-compact'),
    stringify = s => pretty(s, null, 4),
    log = x => console.log(stringify(x)),
    binarySearch = require('binary-search'),
    groupby = require("lodash.groupby"),
    wordTrie = require("./getDefaultWordTrie"),
    Classes = require("./WordClass"),
    readInBoard = require("./readInBoard");

var diagnalDownBoardWide = [
    [5, 6, 7, 8, 9, 1, 2],
    [4, 5, 6, 7, 8, 9, 1],
    [3, 4, 5, 6, 7, 8, 9],
    [2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7]
],
    diagnalDownBoardTall = [
        [7, 1, 2, 3],
        [6, 7, 1, 2],
        [5, 6, 7, 1],
        [4, 5, 6, 7],
        [3, 4, 5, 6],
        [2, 3, 4, 5],
        [1, 2, 3, 4]
    ],
    diagnalUpBoardWide = [
        [4, 5, 6, 7, 8, 9, 1],
        [5, 6, 7, 8, 9, 1, 2],
        [6, 7, 8, 9, 1, 2, 3],
        [7, 8, 9, 1, 2, 3, 4],
        [8, 9, 1, 2, 3, 4, 5],
        [9, 1, 2, 3, 4, 5, 6],
        [1, 2, 3, 4, 5, 6, 7],
        [2, 3, 4, 5, 6, 7, 8],
        [3, 4, 5, 6, 7, 8, 9]
    ],
    diagnalUpBoardTall = [
        [5, 6, 7, 1],
        [6, 7, 1, 2],
        [7, 1, 2, 3],
        [1, 2, 3, 4],
        [2, 3, 4, 5],
        [3, 4, 5, 6],
        [4, 5, 6, 7]
    ],
    verticalBoard = [
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7],
        [1, 2, 3, 4, 5, 6, 7]
    ],
    testBoard = [
        ["L", "Y", "M", "T", "H", "A", "T"],
        ["I", "T", "O", "H", "P", "Y", "C"],
        ["G", "H", "D", "T", "P", "R", "R"],
        ["N", "E", "S", "A", "B", "U", "A"],
        ["U", "M", "L", "K", "S", "J", "S"],
        ["F", "S", "L", "H", "L", "T", "S"],
        ["Y", "T", "H", "E", "Y", "I", "D"]
    ];
//https://api.razzlepuzzles.com/wordsearch
//copy(Array.from(document.querySelectorAll(".row")).map(r => r.innerText.replace(/\s+/g,'')).join('\n'))
//copy(Array.from(document.querySelectorAll(".word")).map(w => w.innerText).join("\n"))
var testBoardWords = ["BASE", "CRASS", "FUNGI", "ILKS", "JURY", "MODS", "PALSY", "RUSH", "STY", "THAT", "THEM", "THEY"];

function makeLeterObjects(board) {
    return board.map((row, iRow) => {
        return row.map((letter, iLetter) => {
            return {
                x: iLetter,
                y: iRow,
                letter: letter.toLowerCase()
            };
        });
    });
}


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

    //console.log("downPadded:");
    //console.log(downPadded);
    //console.log("upPadded:");
    //console.log(upPadded);

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
    }, [])
        .map(word => {
            var start = word[0],
                end = word[word.length - 1];
            valueOut = word.reduce((word, letter) => word + letter.letter, '');
            wordOut = new Classes.Word(valueOut,
                new Classes.Location(
                    new Classes.Point(start.x, start.y),
                    new Classes.Point(end.x, end.y)
                )
            );

            return wordOut;
        });
    return words;
}

function uniqueWords(locationIn, i, whole) {
    var indexFound = whole.findIndex(location => {
        var sx = locationIn.start.x == location.start.x,
            sy = locationIn.start.y == location.start.y,
            ex = locationIn.end.x == location.end.x,
            ey = locationIn.end.y == location.end.y
        return sx && sy && ex && ey;
    });
    return i === indexFound;
}

// var board = verticalBoard;
// var board = diagnalDownBoardTall;
// var board = testBoard;
var board = readInBoard("./customBoard.txt");

//first thing we need to do is to map the board to a 2d array of letterObjs {letter:"",x:#,y:#}
//that way after we slice the words we can make word obj

board = makeLeterObjects(board);
log(board);
var linesVert = getVerticalLines(board);
var linesDiag = getDiagnals(board);


// console.log("board:");
// console.log(pretty(board));

// we need the horiz and the vert and the diag
//horiz comes from the board it's self
var allLines = board.concat(linesVert, linesDiag);
//console.log("allLines:");
//console.log(stringify(allLines));

//this is where to split lines into multiple lines if the board has null chars in it

//convert the lines into words
var potentialWords = makeWordsFromLines(allLines);
var stackedPotentialWords = potentialWords.reduce((stacks, word) => {
    var wordStack = stacks.find(stack => {
        return stack.value === word.value;
    });

    if (wordStack === undefined) {
        stacks.push({
            value: word.value,
            locations: []
        });
        wordStack = stacks[stacks.length - 1];
    }

    wordStack.locations.push(word.location);
    return stacks;
}, [])
    .sort((a, b) => a.value.localeCompare(b.value))
    .map(word => {
        //the length 1 words will have a bunch of repeat locations so just remove doubles
        if (word.value.length === 1) {
            word.locations = word.locations.filter(uniqueWords)
        }
        return word;
    });

fs.writeFileSync('potentialWords.json', stringify(potentialWords))
fs.writeFileSync('stackedPotentialWords.json', stringify(stackedPotentialWords))

function reverseString(stringIn) {
    var sOut = '';
    for (let i = stringIn.length - 1; i > -1; i--) {
        sOut += stringIn[i];
    }

    return sOut;
}

var realWords = stackedPotentialWords.reduce((wordsOut, word) => {
    if (word.value === "ESAB") {
        log(word);
    }


    if (wordTrie.lookup(word.value)) {
        wordsOut.push(word);
    } else {
        var flipedWord = reverseString(word.value);
        if (wordTrie.lookup(flipedWord)) {

            wordsOut.push(
                {
                    value: flipedWord,
                    locations: word.locations.map(l => {
                        return new Classes.Location(l.end, l.start);
                    })
                }
            );
        };
    }
    return wordsOut;
}, [])
    .sort((a, b) => a.value.localeCompare(b.value));
fs.writeFileSync('realWords.json', stringify(realWords));
console.log("Wrote: realWords.json");

//check if the words are actually words in the dictionary list
//also reverse each word if that option is on and check the reverse
//i did varify that we don't have to reverse lines just words
//more efficient here

// just a filter -- well I guess it could be a a bininary search 


//then just make an svg doc with all the letters and the words highlighted

// refactor with more functions and files