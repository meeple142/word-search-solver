
const fs = require("fs");
module.exports =  (filename) => {
    var txt =  fs.readFileSync(filename, "utf-8");
    return txt.split(/[\n\r]+/).map(row => row.split(""));
}