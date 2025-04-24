class Row {
    constructor(data) {
        this.cells = data.split(" ");
    }

    get(cell) {
        return this.cells[cell];
    }
}

class Table {
    constructor(data) {
        this.rows = data.split("\n").map((row_data) => new Row(row_data));
    }

    get(row, col) {
        return this.rows[row].get(col);
    }
}

module.exports = Table;