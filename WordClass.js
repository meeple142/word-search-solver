class Word {
    constructor(value, location) {
        this.value = value;
        this.location = location;
    }
}

class Location {
    constructor(start, end) {
        this.start = start;
        this.end = end;
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y
    }
}
module.exports.Word = Word;
module.exports.Location = Location;
module.exports.Point = Point;
