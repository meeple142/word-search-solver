var trie = require("trie"),
    fs = require("fs"),
    trieOut = new trie.Trie();

var guts = fs.readFileSync("./defaultWordsTrieData.json");
trieOut.loadJson(guts);

module.exports = trieOut;