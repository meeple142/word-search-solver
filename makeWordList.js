var fs = require("fs").promises,
    groupby = require("lodash.groupby")
trie = require("trie");

async function getCustomWordList() {
    var fs = require("fs").promises;

    var path = "customWordListSource.txt";

    var words = await fs.readFile(path,"utf-8");

    return words
    .split(/\s+/)
    .map(w => w.toLowerCase());
}

async function getGoogleWords() {
    var nodeFetch = require("node-fetch");

    var url = "https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears.txt";

    var words = await nodeFetch(url).then(res => res.text());
    return words.split("\n").filter(w => w.length > 0);
}

async function getWebsterWords() {
    var wordsIn = require("websters-english-dictionary"),
        notLetters = /[ -]/g;

    var words = Object.keys(wordsIn.dictionary())
        //remove prefix
        .filter(w => w[0] !== "-")
        //remove sufix
        .filter(w => w[w.length - 1] !== "-")
        .map(w => w.replace(notLetters));

    return words;

}

async function writeFile(path, data) {
    await fs.writeFile(path, data);
    console.log(`wrote: ${path}`);

}

async function main() {
    try {

        var filename = "defaultWords";
        var listFilename = `./${filename}.json`;
        var TrieDataFilename = `./${filename}TrieData.json`;


        var wordsIn = await getCustomWordList();
        // var wordsIn = await getGoogleWords();
        // var wordsIn = await getWebsterWords();

        //filter the list
        var words = wordsIn
            .filter(w => w.length > 2)
            .sort();

        var tree = trie.createTrieFromArray(words);
        // words = Object.keys(groupby(words, w => w))

        await writeFile(listFilename, JSON.stringify(words))
        await writeFile(TrieDataFilename, tree.dumpJson())

    } catch (error) {
        console.log(error);
    }

}

main();